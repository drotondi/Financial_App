from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.dependencies import get_db, get_current_user
from ..models.liability import Liability
from ..models.user import User
from ..schemas.liability import LiabilityCreate, LiabilityOut, LiabilityUpdate

router = APIRouter()


@router.get("", response_model=list[LiabilityOut])
def list_liabilities(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Liability).filter(Liability.user_id == current_user.id).order_by(Liability.created_at.desc()).all()


@router.post("", response_model=LiabilityOut, status_code=status.HTTP_201_CREATED)
def create_liability(data: LiabilityCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    liability = Liability(**data.model_dump(), user_id=current_user.id)
    db.add(liability)
    db.commit()
    db.refresh(liability)
    return liability


@router.get("/{liability_id}", response_model=LiabilityOut)
def get_liability(liability_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    liability = db.query(Liability).filter(Liability.id == liability_id, Liability.user_id == current_user.id).first()
    if not liability:
        raise HTTPException(status_code=404, detail="Liability not found")
    return liability


@router.put("/{liability_id}", response_model=LiabilityOut)
def update_liability(
    liability_id: int,
    data: LiabilityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    liability = db.query(Liability).filter(Liability.id == liability_id, Liability.user_id == current_user.id).first()
    if not liability:
        raise HTTPException(status_code=404, detail="Liability not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(liability, field, value)
    db.commit()
    db.refresh(liability)
    return liability


@router.delete("/{liability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_liability(liability_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    liability = db.query(Liability).filter(Liability.id == liability_id, Liability.user_id == current_user.id).first()
    if not liability:
        raise HTTPException(status_code=404, detail="Liability not found")
    db.delete(liability)
    db.commit()
