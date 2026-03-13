from pydantic import BaseModel, Field


class PropSettingsIn(BaseModel):
    max_daily_loss: float = Field(gt=0)
    max_drawdown: float = Field(gt=0)
    profit_target: float = Field(gt=0)


class PropSettingsOut(PropSettingsIn):
    remaining_daily_loss: float
    remaining_drawdown: float
    profit_target_progress: float
