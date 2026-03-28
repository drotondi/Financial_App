from datetime import date
from calendar import monthrange
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..core.dependencies import get_db, get_current_user
from ..models.asset import Asset
from ..models.liability import Liability
from ..models.exchange_rate import ExchangeRate
from ..models.user import User

router = APIRouter()


def build_rate_map(rates: list[ExchangeRate]) -> dict:
    """Build a rate map: (from, to) -> rate. Always add inverse."""
    rate_map: dict[tuple, float] = {}
    for r in rates:
        key = (r.from_currency, r.to_currency)
        # prefer labeled rates that are not None; otherwise take last
        if key not in rate_map:
            rate_map[key] = r.rate
        # also store inverse
        inv_key = (r.to_currency, r.from_currency)
        if inv_key not in rate_map and r.rate != 0:
            rate_map[inv_key] = 1.0 / r.rate
    return rate_map


def convert(amount: float, from_currency: str, to_currency: str, rate_map: dict) -> float | None:
    if from_currency == to_currency:
        return amount
    direct = rate_map.get((from_currency, to_currency))
    if direct:
        return amount * direct
    # Try via USD pivot
    to_usd = rate_map.get((from_currency, "USD"))
    from_usd = rate_map.get(("USD", to_currency))
    if to_usd and from_usd:
        return amount * to_usd * from_usd
    return None


@router.get("/summary")
def get_summary(
    base_currency: str = Query("USD"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assets = db.query(Asset).filter(Asset.user_id == current_user.id).all()
    liabilities = db.query(Liability).filter(Liability.user_id == current_user.id).all()
    rates = db.query(ExchangeRate).filter(ExchangeRate.user_id == current_user.id).all()
    rate_map = build_rate_map(rates)

    total_assets = 0.0
    assets_converted = 0
    for a in assets:
        v = convert(a.current_value, a.currency, base_currency, rate_map)
        if v is not None:
            total_assets += v
            assets_converted += 1

    total_liabilities = 0.0
    for l in liabilities:
        v = convert(l.outstanding_balance, l.currency, base_currency, rate_map)
        if v is not None:
            total_liabilities += v

    return {
        "base_currency": base_currency,
        "total_assets": round(total_assets, 2),
        "total_liabilities": round(total_liabilities, 2),
        "net_worth": round(total_assets - total_liabilities, 2),
        "asset_count": len(assets),
        "liability_count": len(liabilities),
    }


@router.get("/allocation")
def get_allocation(
    base_currency: str = Query("USD"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assets = db.query(Asset).filter(Asset.user_id == current_user.id).all()
    rates = db.query(ExchangeRate).filter(ExchangeRate.user_id == current_user.id).all()
    rate_map = build_rate_map(rates)

    by_category: dict[str, float] = {}
    for a in assets:
        v = convert(a.current_value, a.currency, base_currency, rate_map)
        if v is not None:
            by_category[a.category] = by_category.get(a.category, 0) + v

    total = sum(by_category.values())
    result = [
        {
            "category": cat,
            "value": round(val, 2),
            "percentage": round(val / total * 100, 1) if total > 0 else 0,
        }
        for cat, val in by_category.items()
    ]
    result.sort(key=lambda x: x["value"], reverse=True)
    return {"base_currency": base_currency, "total": round(total, 2), "allocation": result}


@router.get("/trend")
def get_trend(
    months: int = Query(12, ge=1, le=60),
    base_currency: str = Query("USD"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns monthly net worth snapshots based on assets and liabilities created_at dates.
    For simplicity, uses current values as a snapshot (no historical value tracking yet).
    Returns the last N months with the current snapshot value for each month that has data.
    """
    from datetime import datetime
    assets = db.query(Asset).filter(Asset.user_id == current_user.id).all()
    liabilities = db.query(Liability).filter(Liability.user_id == current_user.id).all()
    rates = db.query(ExchangeRate).filter(ExchangeRate.user_id == current_user.id).all()
    rate_map = build_rate_map(rates)

    today = date.today()
    points = []
    for i in range(months - 1, -1, -1):
        # Compute month offset
        month = today.month - i
        year = today.year
        while month <= 0:
            month += 12
            year -= 1
        last_day = monthrange(year, month)[1]
        snapshot_date = date(year, month, last_day)

        total_a = sum(
            convert(a.current_value, a.currency, base_currency, rate_map) or 0
            for a in assets
            if a.created_at.date() <= snapshot_date
        )
        total_l = sum(
            convert(l.outstanding_balance, l.currency, base_currency, rate_map) or 0
            for l in liabilities
            if l.created_at.date() <= snapshot_date
        )
        points.append({
            "month": f"{year}-{month:02d}",
            "assets": round(total_a, 2),
            "liabilities": round(total_l, 2),
            "net_worth": round(total_a - total_l, 2),
        })

    return {"base_currency": base_currency, "trend": points}
