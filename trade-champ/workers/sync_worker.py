"""Periodic MT5 sync worker.

This module reads connected MT5 accounts from Supabase,
imports fresh deal history via MetaTrader5 API,
and stores normalized trade rows per user.
"""

from datetime import datetime, timedelta, timezone
import os
import time
from dotenv import load_dotenv
from supabase import create_client
import MetaTrader5 as mt5

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SYNC_INTERVAL_SECONDS = int(os.getenv("SYNC_INTERVAL_SECONDS", "300"))

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_accounts():
    return supabase.table("mt5_accounts").select("id,user_id,login,server,encrypted_password").execute().data


def sync_account(account: dict):
    # Password decryption can reuse backend security helper in production.
    password = account["encrypted_password"]
    if not mt5.initialize(login=account["login"], password=password, server=account["server"]):
        print(f"MT5 initialize failed for account {account['id']}")
        return

    from_date = datetime.now(timezone.utc) - timedelta(days=30)
    to_date = datetime.now(timezone.utc)
    deals = mt5.history_deals_get(from_date, to_date)

    if deals:
        rows = []
        for deal in deals:
            if deal.entry not in (0, 1):
                continue
            rows.append(
                {
                    "user_id": account["user_id"],
                    "ticket": int(deal.ticket),
                    "symbol": deal.symbol,
                    "volume": float(deal.volume),
                    "entry_price": float(deal.price),
                    "exit_price": float(deal.price),
                    "stop_loss": None,
                    "take_profit": None,
                    "open_time": datetime.fromtimestamp(deal.time, timezone.utc).isoformat(),
                    "close_time": datetime.fromtimestamp(deal.time, timezone.utc).isoformat(),
                    "profit": float(deal.profit),
                    "commission": float(deal.commission),
                    "swap": float(deal.swap),
                    "trade_duration_minutes": 0,
                }
            )
        if rows:
            supabase.table("trades").upsert(rows, on_conflict="user_id,ticket").execute()
            print(f"Synced {len(rows)} trades for {account['user_id']}")
    mt5.shutdown()


def run():
    while True:
        try:
            accounts = get_accounts()
            for account in accounts:
                sync_account(account)
        except Exception as exc:  # noqa: BLE001
            print(f"Sync cycle failed: {exc}")
        time.sleep(SYNC_INTERVAL_SECONDS)


if __name__ == "__main__":
    run()
