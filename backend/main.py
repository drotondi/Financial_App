from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import User, Asset, Liability, Transaction, ExchangeRate  # noqa: F401 — ensures models are registered
from .models import StrategicObjective, AnnualObjective, HoshinProgram, HoshinKPI, HoshinCorrelation, InitiativeTask  # noqa: F401
from .database import Base
from .routers import auth, assets, liabilities, transactions, dashboard, exchange_rates, hoshin

app = FastAPI(title="Wealth Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(assets.router, prefix="/api/assets", tags=["assets"])
app.include_router(liabilities.router, prefix="/api/liabilities", tags=["liabilities"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(exchange_rates.router, prefix="/api/exchange-rates", tags=["exchange_rates"])
app.include_router(hoshin.router, prefix="/api/hoshin", tags=["hoshin"])


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health():
    return {"status": "ok"}
