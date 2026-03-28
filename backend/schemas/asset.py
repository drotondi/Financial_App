from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AssetCreate(BaseModel):
    name: str
    category: str
    currency: str
    current_value: float
    cost_basis: Optional[float] = None
    quantity: Optional[float] = None
    institution: Optional[str] = None
    notes: Optional[str] = None


class AssetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    currency: Optional[str] = None
    current_value: Optional[float] = None
    cost_basis: Optional[float] = None
    quantity: Optional[float] = None
    institution: Optional[str] = None
    notes: Optional[str] = None


class AssetOut(BaseModel):
    id: int
    user_id: int
    name: str
    category: str
    currency: str
    current_value: float
    cost_basis: Optional[float]
    quantity: Optional[float]
    institution: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
