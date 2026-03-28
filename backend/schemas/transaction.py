from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class TransactionCreate(BaseModel):
    type: str
    amount: float
    currency: str
    description: str
    category: Optional[str] = None
    date: date
    asset_id: Optional[int] = None
    liability_id: Optional[int] = None


class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    date: Optional[date] = None
    asset_id: Optional[int] = None
    liability_id: Optional[int] = None


class TransactionOut(BaseModel):
    id: int
    user_id: int
    asset_id: Optional[int]
    liability_id: Optional[int]
    type: str
    amount: float
    currency: str
    description: str
    category: Optional[str]
    date: date
    created_at: datetime

    model_config = {"from_attributes": True}
