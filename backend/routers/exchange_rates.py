from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.dependencies import get_db, get_current_user
from ..models.exchange_rate import ExchangeRate
from ..models.user import User
from ..schemas.exchange_rate import ExchangeRateCreate, ExchangeRateOut, ExchangeRateUpdate

router = APIRouter()


@router.get("", response_model=list[ExchangeRateOut])
def list_rates(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ExchangeRate).filter(ExchangeRate.user_id == current_user.id).all()


@router.post("", response_model=ExchangeRateOut, status_code=status.HTTP_201_CREATED)
def create_rate(data: ExchangeRateCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rate = ExchangeRate(**data.model_dump(), user_id=current_user.id)
    db.add(rate)
    db.commit()
    db.refresh(rate)
    return rate


@router.put("/{rate_id}", response_model=ExchangeRateOut)
def update_rate(
    rate_id: int,
    data: ExchangeRateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rate = db.query(ExchangeRate).filter(ExchangeRate.id == rate_id, ExchangeRate.user_id == current_user.id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Exchange rate not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(rate, field, value)
    db.commit()
    db.refresh(rate)
    return rate


@router.delete("/{rate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rate(rate_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rate = db.query(ExchangeRate).filter(ExchangeRate.id == rate_id, ExchangeRate.user_id == current_user.id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Exchange rate not found")
    db.delete(rate)
    db.commit()
