from datetime import datetime
from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    assets = relationship("Asset", back_populates="user", cascade="all, delete-orphan")
    liabilities = relationship("Liability", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    exchange_rates = relationship("ExchangeRate", back_populates="user", cascade="all, delete-orphan")
    strategic_objectives = relationship("StrategicObjective", back_populates="user", cascade="all, delete-orphan")
    annual_objectives = relationship("AnnualObjective", back_populates="user", cascade="all, delete-orphan")
    hoshin_programs = relationship("HoshinProgram", back_populates="user", cascade="all, delete-orphan")
    hoshin_kpis = relationship("HoshinKPI", back_populates="user", cascade="all, delete-orphan")
    hoshin_correlations = relationship("HoshinCorrelation", back_populates="user", cascade="all, delete-orphan")
