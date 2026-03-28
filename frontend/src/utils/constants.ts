export const CURRENCIES = ['USD', 'EUR', 'ARS', 'GBP', 'BRL', 'MXN', 'CLP', 'COP', 'PEN', 'UYU', 'CAD', 'CHF', 'JPY', 'CNY']

export const ASSET_CATEGORIES = [
  { value: 'cash', label: 'Efectivo / Cuentas' },
  { value: 'stock', label: 'Acciones' },
  { value: 'crypto', label: 'Criptomonedas' },
  { value: 'real_estate', label: 'Inmuebles' },
  { value: 'fixed_income', label: 'Renta Fija' },
  { value: 'other', label: 'Otros' },
]

export const LIABILITY_CATEGORIES = [
  { value: 'mortgage', label: 'Hipoteca' },
  { value: 'car_loan', label: 'Préstamo Auto' },
  { value: 'credit_card', label: 'Tarjeta de Crédito' },
  { value: 'personal_loan', label: 'Préstamo Personal' },
  { value: 'student_loan', label: 'Préstamo Estudiantil' },
  { value: 'other', label: 'Otros' },
]

export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Ingreso' },
  { value: 'expense', label: 'Gasto' },
  { value: 'buy', label: 'Compra' },
  { value: 'sell', label: 'Venta' },
  { value: 'payment', label: 'Pago' },
  { value: 'transfer', label: 'Transferencia' },
]

export const CHART_COLORS = [
  '#6366f1', // indigo-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#f43f5e', // rose-500
  '#0ea5e9', // sky-500
  '#8b5cf6', // violet-500
]

export const CATEGORY_LABELS: Record<string, string> = {
  cash: 'Efectivo',
  stock: 'Acciones',
  crypto: 'Crypto',
  real_estate: 'Inmuebles',
  fixed_income: 'Renta Fija',
  other: 'Otros',
  mortgage: 'Hipoteca',
  car_loan: 'Auto',
  credit_card: 'Tarjeta',
  personal_loan: 'Préstamo Personal',
  student_loan: 'Educación',
}
