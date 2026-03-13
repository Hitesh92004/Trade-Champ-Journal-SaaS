from pydantic import BaseModel


class DashboardOverview(BaseModel):
    total_trades: int
    win_rate: float
    profit_factor: float
    expectancy: float
    net_profit: float
    max_drawdown: float
