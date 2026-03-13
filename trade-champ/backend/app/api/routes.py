from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.auth import get_current_user_id
from app.core.config import get_settings
from app.core.security import encrypt_value
from app.schemas.dashboard import DashboardOverview
from app.schemas.mt5 import MT5ConnectRequest
from app.schemas.prop import PropSettingsIn, PropSettingsOut
from app.services.supabase_client import get_supabase

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    settings = get_settings()
    return {"status": "ok", "service": settings.app_name}


@router.post("/mt5/connect")
def connect_mt5(payload: MT5ConnectRequest, user_id: str = Depends(get_current_user_id)):
    settings = get_settings()
    supabase = get_supabase()
    data = {
        "user_id": user_id,
        "login": payload.login,
        "server": payload.server,
        "encrypted_password": encrypt_value(payload.password, settings.credential_secret),
    }
    try:
        supabase.table("mt5_accounts").upsert(data, on_conflict="user_id,login,server").execute()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Could not save MT5 account: {exc}")
    return {"message": "MT5 account connected"}


@router.get("/dashboard/overview", response_model=DashboardOverview)
def dashboard_overview(user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase()
    trades = supabase.table("trades").select("profit").eq("user_id", user_id).execute().data or []

    total = len(trades)
    profits = [float(t["profit"]) for t in trades]
    wins = [p for p in profits if p > 0]
    losses = [abs(p) for p in profits if p < 0]

    gross_profit = sum(wins)
    gross_loss = sum(losses)
    net_profit = sum(profits)
    win_rate = (len(wins) / total * 100) if total else 0.0
    expectancy = (net_profit / total) if total else 0.0
    profit_factor = (gross_profit / gross_loss) if gross_loss else gross_profit
    peak, max_drawdown, running = 0.0, 0.0, 0.0
    for p in profits:
        running += p
        peak = max(peak, running)
        max_drawdown = min(max_drawdown, running - peak)

    return DashboardOverview(
        total_trades=total,
        win_rate=round(win_rate, 2),
        profit_factor=round(profit_factor, 2),
        expectancy=round(expectancy, 2),
        net_profit=round(net_profit, 2),
        max_drawdown=round(max_drawdown, 2),
    )


@router.get("/trades")
def list_trades(
    symbol: str | None = Query(default=None),
    strategy: str | None = Query(default=None),
    date_from: str | None = Query(default=None),
    date_to: str | None = Query(default=None),
    user_id: str = Depends(get_current_user_id),
):
    supabase = get_supabase()
    query = supabase.table("trades").select("*").eq("user_id", user_id).order("open_time", desc=True)
    if symbol:
        query = query.eq("symbol", symbol)
    if strategy:
        query = query.eq("strategy_tag", strategy)
    if date_from:
        query = query.gte("open_time", date_from)
    if date_to:
        query = query.lte("open_time", date_to)
    return query.execute().data


@router.get("/trades/{trade_id}")
def get_trade_detail(trade_id: int, user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase()
    trade = (
        supabase.table("trades").select("*").eq("id", trade_id).eq("user_id", user_id).single().execute().data
    )
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")

    entry = float(trade["entry_price"])
    exit_price = float(trade.get("exit_price") or entry)
    stop_loss = float(trade.get("stop_loss") or entry)

    risk = abs(entry - stop_loss) if stop_loss != entry else 0
    reward = abs(exit_price - entry)
    rr_ratio = round((reward / risk), 2) if risk else 0.0

    enriched: dict[str, Any] = {**trade, "rr_ratio": rr_ratio}
    return enriched


@router.put("/prop-settings", response_model=PropSettingsOut)
def upsert_prop_settings(payload: PropSettingsIn, user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase()
    payload_data = {"user_id": user_id, **payload.model_dump()}
    supabase.table("prop_settings").upsert(payload_data, on_conflict="user_id").execute()

    daily_pnl_query = (
        supabase.table("trades")
        .select("profit")
        .eq("user_id", user_id)
        .gte("open_time", datetime.utcnow().date().isoformat())
        .execute()
        .data
        or []
    )
    total_query = supabase.table("trades").select("profit").eq("user_id", user_id).execute().data or []

    daily_pnl = sum(float(t["profit"]) for t in daily_pnl_query)
    net = sum(float(t["profit"]) for t in total_query)

    return PropSettingsOut(
        **payload.model_dump(),
        remaining_daily_loss=round(payload.max_daily_loss + min(daily_pnl, 0), 2),
        remaining_drawdown=round(payload.max_drawdown + min(net, 0), 2),
        profit_target_progress=round(max(0, min((net / payload.profit_target) * 100, 100)), 2),
    )
