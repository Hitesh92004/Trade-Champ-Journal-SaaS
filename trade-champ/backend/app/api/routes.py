from fastapi import APIRouter, HTTPException
from app.schemas.mt5 import MT5ConnectRequest
from app.core.config import settings
from app.core.security import encrypt_value
from app.services.supabase_client import get_supabase

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok", "service": "trade-champ-api"}


@router.post("/mt5/connect")
def connect_mt5(payload: MT5ConnectRequest, user_id: str):
    supabase = get_supabase()
    try:
        supabase.table("mt5_accounts").insert(
            {
                "user_id": user_id,
                "login": payload.login,
                "server": payload.server,
                "encrypted_password": encrypt_value(payload.password, settings.credential_secret),
            }
        ).execute()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Could not save MT5 account: {exc}")
    return {"message": "MT5 account connected"}
