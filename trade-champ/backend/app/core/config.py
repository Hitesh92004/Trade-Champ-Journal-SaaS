from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseModel):
    app_name: str = "Trade Champ API"
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_service_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    credential_secret: str = os.getenv("MT5_CREDENTIAL_SECRET", "change-me")


settings = Settings()
