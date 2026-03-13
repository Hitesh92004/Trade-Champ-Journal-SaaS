from pydantic import BaseModel


class MT5ConnectRequest(BaseModel):
    login: int
    password: str
    server: str
