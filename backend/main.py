import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .database import engine
from .models import User, Asset, Liability, Transaction, ExchangeRate  # noqa: F401 — ensures models are registered
from .database import Base
from .routers import auth, assets, liabilities, transactions, dashboard, exchange_rates

app = FastAPI(title="Wealth Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health():
    return {"status": "ok"}


# Serve the built React SPA — must be AFTER all /api routes
_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(_dist, "assets")), name="static-assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        index = os.path.join(_dist, "index.html")
        return FileResponse(index)
