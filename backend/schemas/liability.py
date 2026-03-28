from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class LiabilityCreate(BaseModel):
    name: str
    category: str
    currency: str
    outstanding_balance: float
    original_amount: Optional[float] = None
    interest_rate: Optional[float] = None
    due_date: Optional[date] = None
    institution: Optional[str] = None
    notes: Optional[str] = None


class LiabilityUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    currency: Optional[str] = None
    outstanding_balance: Optional[float] = None
    original_amount: Optional[float] = None
    interest_rate: Optional[float] = None
    due_date: Optional[date] = None
    institution: Optional[str] = None
    notes: Optional[str] = None


class LiabilityOut(BaseModel):
    id: int
    user_id: int
    name: str
    category: str
    currency: str
    outstanding_balance: float
    original_amount: Optional[float]
    interest_rate: Optional[float]
    due_date: Optional[date]
    institution: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
