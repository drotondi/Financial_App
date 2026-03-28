import { useState, FormEvent } from 'react'
import type { Liability } from '../../api/liabilities'
import { LIABILITY_CATEGORIES, CURRENCIES } from '../../utils/constants'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

interface Props {
  initial?: Partial<Liability>
  onSubmit: (data: Omit<Liability, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}

export default function LiabilityForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'personal_loan')
  const [currency, setCurrency] = useState(initial?.currency ?? 'USD')
  const [balance, setBalance] = useState(String(initial?.outstanding_balance ?? ''))
  const [original, setOriginal] = useState(String(initial?.original_amount ?? ''))
  const [rate, setRate] = useState(String(initial?.interest_rate ?? ''))
  const [dueDate, setDueDate] = useState(initial?.due_date ?? '')
  const [institution, setInstitution] = useState(initial?.institution ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onSubmit({
        name,
        category,
        currency,
        outstanding_balance: parseFloat(balance),
        original_amount: original ? parseFloat(original) : null,
        interest_rate: rate ? parseFloat(rate) : null,
        due_date: dueDate || null,
        institution: institution || null,
        notes: notes || null,
      })
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ej: Hipoteca BNA" />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} options={LIABILITY_CATEGORIES} />
        <Select label="Moneda" value={currency} onChange={(e) => setCurrency(e.target.value)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Saldo pendiente" type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} required placeholder="0.00" />
        <Input label="Monto original (opcional)" type="number" step="0.01" value={original} onChange={(e) => setOriginal(e.target.value)} placeholder="0.00" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Tasa interés anual % (opcional)" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5.5" />
        <Input label="Vencimiento (opcional)" type="date" value={dueDate as string} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <Input label="Institución (opcional)" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Ej: Banco Nación" />
      <Input label="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

      {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-2 pt-1">
        <Button type="submit" loading={loading} className="flex-1">
          {initial?.id ? 'Guardar cambios' : 'Agregar pasivo'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
