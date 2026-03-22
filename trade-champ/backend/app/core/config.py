from functools import lru_cache
import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseModel):
    app_name: str = "Trade Champ API"
    environment: str = os.getenv("ENVIRONMENT", "development")
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_service_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    supabase_anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
    credential_secret: str = os.getenv("MT5_CREDENTIAL_SECRET", "change-me")
    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")


@lru_cache
def get_settings() -> Settings:
    return Settings()
