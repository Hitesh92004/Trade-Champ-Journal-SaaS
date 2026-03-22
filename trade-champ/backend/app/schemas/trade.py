from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Trade(BaseModel):
    id: int
    user_id: str
    ticket: int
    symbol: str
    volume: float
    entry_price: float
    exit_price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    open_time: datetime
    close_time: Optional[datetime] = None
    profit: float
    commission: float = 0
    swap: float = 0
    trade_duration_minutes: Optional[int] = None
    strategy_tag: Optional[str] = None
