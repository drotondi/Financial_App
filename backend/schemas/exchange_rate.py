from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ExchangeRateCreate(BaseModel):
    from_currency: str
    to_currency: str
    rate: float
    label: Optional[str] = None


class ExchangeRateUpdate(BaseModel):
    rate: float
    label: Optional[str] = None


class ExchangeRateOut(BaseModel):
    id: int
    user_id: int
    from_currency: str
    to_currency: str
    rate: float
    label: Optional[str]
    updated_at: datetime

    model_config = {"from_attributes": True}
