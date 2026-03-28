import { useState, FormEvent } from 'react'
import type { Asset } from '../../api/assets'
import { ASSET_CATEGORIES, CURRENCIES } from '../../utils/constants'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

interface Props {
  initial?: Partial<Asset>
  onSubmit: (data: Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}

export default function AssetForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'cash')
  const [currency, setCurrency] = useState(initial?.currency ?? 'USD')
  const [currentValue, setCurrentValue] = useState(String(initial?.current_value ?? ''))
  const [costBasis, setCostBasis] = useState(String(initial?.cost_basis ?? ''))
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? ''))
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
        current_value: parseFloat(currentValue),
        cost_basis: costBasis ? parseFloat(costBasis) : null,
        quantity: quantity ? parseFloat(quantity) : null,
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
      <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ej: Cuenta Santander" />
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={ASSET_CATEGORIES}
        />
        <Select
          label="Moneda"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          options={CURRENCIES.map((c) => ({ value: c, label: c }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Valor actual" type="number" step="0.01" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} required placeholder="0.00" />
        <Input label="Costo base (opcional)" type="number" step="0.01" value={costBasis} onChange={(e) => setCostBasis(e.target.value)} placeholder="0.00" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Cantidad (opcional)" type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Ej: 10.5" />
        <Input label="Institución (opcional)" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Ej: Banco Galicia" />
      </div>
      <Input label="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="..." />

      {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex gap-2 pt-1">
        <Button type="submit" loading={loading} className="flex-1">
          {initial?.id ? 'Guardar cambios' : 'Agregar activo'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
