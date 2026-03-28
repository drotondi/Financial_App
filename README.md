# Wealth Tracker

Aplicación web personal para registrar y visualizar patrimonio: activos, pasivos y transacciones.

## Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Recharts
- **Backend**: FastAPI + SQLAlchemy
- **Base de datos**: SQLite (archivo local `backend/wealth.db`)
- **Auth**: JWT (7 días)

## Inicio rápido

### Un solo comando (recomendado)

```bash
bash start.sh
```

Esto instala todas las dependencias, compila el frontend y arranca el servidor.
**Accedé a la app en: http://localhost:8000**

### Manual (desarrollo)

**Backend + frontend integrado:**
```bash
cd frontend && npm install && npm run build
cd ../backend && pip install -r requirements.txt
cd .. && python -m uvicorn backend.main:app --reload
# App en http://localhost:8000
# Swagger en http://localhost:8000/docs
```

**O para desarrollo con hot-reload del frontend:**
```bash
# Terminal 1 — backend
python -m uvicorn backend.main:app --reload

# Terminal 2 — frontend dev server
cd frontend && npm run dev
# App en http://localhost:5173
```

## Módulos

- **Dashboard** — Patrimonio neto, distribución de activos, evolución histórica
- **Activos** — CRUD con categorías, multi-moneda, P&L
- **Pasivos** — Deudas con tasa de interés y vencimiento
- **Transacciones** — Ingresos/gastos con filtros por fecha y tipo
- **Configuración** — Tipos de cambio personalizados (soporte ARS blue, etc.)