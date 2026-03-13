"""Periodic MT5 sync worker for Trade Champ."""

from datetime import datetime, timedelta, timezone
import os
import time
from dotenv import load_dotenv
from supabase import create_client
import MetaTrader5 as mt5
from cryptography.fernet import Fernet
import base64
import hashlib

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
CREDENTIAL_SECRET = os.getenv("MT5_CREDENTIAL_SECRET", "change-me")
SYNC_INTERVAL_SECONDS = int(os.getenv("SYNC_INTERVAL_SECONDS", "300"))

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def _derive_key(secret: str) -> bytes:
    digest = hashlib.sha256(secret.encode()).digest()
    return base64.urlsafe_b64encode(digest)


def decrypt_value(value: str, secret: str) -> str:
    return Fernet(_derive_key(secret)).decrypt(value.encode()).decode()


def get_accounts():
    return supabase.table("mt5_accounts").select("id,user_id,login,server,encrypted_password").execute().data or []


def sync_account(account: dict):
    password = decrypt_value(account["encrypted_password"], CREDENTIAL_SECRET)
    if not mt5.initialize(login=account["login"], password=password, server=account["server"]):
        print(f"MT5 initialize failed for account {account['id']}")
        return

    start = datetime.now(timezone.utc) - timedelta(days=30)
    end = datetime.now(timezone.utc)
    deals = mt5.history_deals_get(start, end)

    if not deals:
        mt5.shutdown()
        return

    rows = []
    for deal in deals:
        if deal.entry not in (0, 1):
            continue

        open_time = datetime.fromtimestamp(deal.time, timezone.utc)
        close_time = datetime.fromtimestamp(deal.time, timezone.utc)
        duration = int((close_time - open_time).total_seconds() // 60)
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
                "open_time": open_time.isoformat(),
                "close_time": close_time.isoformat(),
                "profit": float(deal.profit),
                "commission": float(deal.commission),
                "swap": float(deal.swap),
                "trade_duration_minutes": duration,
            }
        )

    if rows:
        supabase.table("trades").upsert(rows, on_conflict="user_id,ticket").execute()
        print(f"Synced {len(rows)} trades for {account['user_id']}")

    mt5.shutdown()


def run():
    while True:
        try:
            for account in get_accounts():
                sync_account(account)
        except Exception as exc:  # noqa: BLE001
            print(f"Sync cycle failed: {exc}")
        time.sleep(SYNC_INTERVAL_SECONDS)


if __name__ == "__main__":
    run()
