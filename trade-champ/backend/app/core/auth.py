from fastapi import Header, HTTPException
from app.services.supabase_client import get_supabase


def _extract_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    return parts[1]


def get_current_user_id(authorization: str | None = Header(default=None)) -> str:
    token = _extract_token(authorization)
    supabase = get_supabase()
    user_response = supabase.auth.get_user(token)
    user = user_response.user
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user.id
