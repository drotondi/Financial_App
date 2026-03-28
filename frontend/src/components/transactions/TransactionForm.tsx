import { useState, FormEvent } from 'react'
import type { Transaction } from '../../api/transactions'
import { TRANSACTION_TYPES, CURRENCIES } from '../../utils/constants'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

interface Props {
  initial?: Partial<Transaction>
  onSubmit: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  onCancel: () => void
}

const TRANSACTION_CATEGORIES = [
  { value: 'salary', label: 'Salario' },
  { value: 'dividend', label: 'Dividendo' },
  { value: 'interest', label: 'Interés' },
  { value: 'purchase', label: 'Compra' },
  { value: 'payment', label: 'Pago' },
  { value: 'fee', label: 'Comisión' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'other', label: 'Otro' },
]

export default function TransactionForm({ initial, onSubmit, onCancel }: Props) {
  const [type, setType] = useState(initial?.type ?? 'income')
  const [amount, setAmount] = useState(String(initial?.amount ?? ''))
  const [currency, setCurrency] = useState(initial?.currency ?? 'USD')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'other')
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onSubmit({
        type,
        amount: parseFloat(amount),
        currency,
        description,
        category: category || null,
        date,
        asset_id: initial?.asset_id ?? null,
        liability_id: initial?.liability_id ?? null,
      })
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo" value={type} onChange={(e) => setType(e.target.value)} options={TRANSACTION_TYPES} />
        <Select label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} options={TRANSACTION_CATEGORIES} />
      </div>
      <Input label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Ej: Salario enero" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Monto" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" />
        <Select label="Moneda" value={currency} onChange={(e) => setCurrency(e.target.value)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
      </div>
      <Input label="Fecha" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

      {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-2 pt-1">
        <Button type="submit" loading={loading} className="flex-1">
          {initial?.id ? 'Guardar cambios' : 'Agregar transacción'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
