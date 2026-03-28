import { useState, FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { exchangeRatesApi } from '../api/exchangeRates'
import type { ExchangeRate } from '../store/currencyStore'
import { CURRENCIES } from '../utils/constants'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import EmptyState from '../components/ui/EmptyState'

function AddRateForm({ onAdd }: { onAdd: () => void }) {
  const qc = useQueryClient()
  const [from, setFrom] = useState('ARS')
  const [to, setTo] = useState('USD')
  const [rate, setRate] = useState('')
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)

  const mut = useMutation({
    mutationFn: exchangeRatesApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['exchange-rates'] }); setRate(''); setLabel(''); onAdd() },
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await mut.mutateAsync({ from_currency: from, to_currency: to, rate: parseFloat(rate), label: label || undefined })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
      <Select label="De" value={from} onChange={(e) => setFrom(e.target.value)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
      <Select label="A" value={to} onChange={(e) => setTo(e.target.value)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
      <Input label="Tasa (1 De = ? A)" type="number" step="any" value={rate} onChange={(e) => setRate(e.target.value)} required placeholder="0.001" />
      <Input label="Etiqueta (opcional)" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Oficial, Blue..." />
      <Button type="submit" loading={loading}>Agregar</Button>
    </form>
  )
}

function RateRow({ rate }: { rate: ExchangeRate }) {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(rate.rate))

  const updateMut = useMutation({
    mutationFn: (r: number) => exchangeRatesApi.update(rate.id, { rate: r, label: rate.label ?? undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['exchange-rates'] }); setEditing(false) },
  })

  const deleteMut = useMutation({
    mutationFn: () => exchangeRatesApi.delete(rate.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exchange-rates'] }),
  })

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="py-3 px-3 pl-0 font-medium text-zinc-900">{rate.from_currency}</td>
      <td className="py-3 px-3 text-zinc-500">→</td>
      <td className="py-3 px-3 font-medium text-zinc-900">{rate.to_currency}</td>
      <td className="py-3 px-3">
        {editing ? (
          <input
            type="number"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-28 border border-indigo-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        ) : (
          <span className="tabular-num text-zinc-700">{rate.rate}</span>
        )}
      </td>
      <td className="py-3 px-3 text-zinc-400 text-xs">{rate.label ?? '—'}</td>
      <td className="py-3 px-3 pr-0">
        <div className="flex items-center gap-1 justify-end">
          {editing ? (
            <>
              <Button size="sm" onClick={() => updateMut.mutate(parseFloat(value))}>Guardar</Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Editar</Button>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm('¿Eliminar esta tasa?')) deleteMut.mutate() }}>
                <span className="text-rose-500">Eliminar</span>
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function SettingsPage() {
  const { data: rates = [], isLoading } = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: exchangeRatesApi.list,
  })

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-zinc-700 mb-4">Tipos de Cambio</h2>
        <p className="text-xs text-zinc-500 mb-4">
          Definí las tasas para convertir entre monedas. <strong>1 moneda origen = tasa × moneda destino.</strong>
          <br />Ejemplo: ARS → USD, tasa = 0.001 (1 ARS = 0.001 USD)
        </p>

        {isLoading ? (
          <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="animate-pulse h-8 bg-zinc-100 rounded" />)}</div>
        ) : rates.length === 0 ? (
          <EmptyState title="Sin tasas configuradas" description="Agregá tasas para convertir tus activos a una moneda común" />
        ) : (
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  {['De', '', 'A', 'Tasa', 'Etiqueta', ''].map((h, i) => (
                    <th key={i} className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wide py-2 px-3 first:pl-0 last:pr-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {rates.map((r) => <RateRow key={r.id} rate={r} />)}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-zinc-100 pt-4">
          <h3 className="text-xs font-semibold text-zinc-600 mb-3">Nueva tasa</h3>
          <AddRateForm onAdd={() => {}} />
        </div>
      </Card>
    </div>
  )
}
