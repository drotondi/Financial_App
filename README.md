# Wealth Tracker

Aplicación web personal para registrar y visualizar patrimonio: activos, pasivos y transacciones.

## Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Recharts
- **Backend**: FastAPI + SQLAlchemy
- **Base de datos**: SQLite (archivo local `backend/wealth.db`)
- **Auth**: JWT (7 días)

## Inicio rápido

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API: http://localhost:8000
# Swagger: http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

## Módulos

- **Dashboard** — Patrimonio neto, distribución de activos, evolución histórica
- **Activos** — CRUD con categorías, multi-moneda, P&L
- **Pasivos** — Deudas con tasa de interés y vencimiento
- **Transacciones** — Ingresos/gastos con filtros por fecha y tipo
- **Configuración** — Tipos de cambio personalizados (soporte ARS blue, etc.)