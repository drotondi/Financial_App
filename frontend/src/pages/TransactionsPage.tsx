import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsApi, type Transaction } from '../api/transactions'
import TransactionForm from '../components/transactions/TransactionForm'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../utils/formatters'
import { TRANSACTION_TYPES } from '../utils/constants'

export default function TransactionsPage() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [filterType, setFilterType] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filterType, fromDate, toDate],
    queryFn: () => transactionsApi.list({
      type: filterType || undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }),
  })

  const createMut = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); setModalOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Transaction> }) => transactionsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); setModalOpen(false); setEditing(null) },
  })

  const deleteMut = useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos</option>
              {TRANSACTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Desde</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500">Hasta</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="ml-auto">
            <Button onClick={() => { setEditing(null); setModalOpen(true) }}>+ Agregar</Button>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => <div key={i} className="animate-pulse h-10 bg-zinc-100 rounded-lg" />)}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            title="Sin transacciones"
            description="Registrá tus ingresos y gastos"
            action={<Button onClick={() => setModalOpen(true)}>Agregar transacción</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  {['Fecha', 'Descripción', 'Tipo', 'Monto', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wide py-2.5 px-3 first:pl-0 last:pr-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-3 pl-0 text-xs text-zinc-500 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-zinc-900">{t.description}</div>
                      {t.category && <div className="text-xs text-zinc-400">{t.category}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <Badge value={t.type} label={TRANSACTION_TYPES.find((x) => x.value === t.type)?.label} />
                    </td>
                    <td className={`py-3 px-3 tabular-num font-medium ${['income', 'sell', 'dividend'].includes(t.type) ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {['income', 'sell', 'dividend'].includes(t.type) ? '+' : '-'}
                      {formatCurrency(t.amount, t.currency)}
                    </td>
                    <td className="py-3 px-3 pr-0">
                      <div className="flex items-center gap-1 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => { setEditing(t); setModalOpen(true) }}>Editar</Button>
                        <Button size="sm" variant="ghost" onClick={() => { if (confirm('¿Eliminar?')) deleteMut.mutate(t.id) }}>
                          <span className="text-rose-500">Eliminar</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} title={editing ? 'Editar transacción' : 'Nueva transacción'}>
        <TransactionForm
          initial={editing ?? undefined}
          onSubmit={async (data) => {
            if (editing) {
              await updateMut.mutateAsync({ id: editing.id, data })
            } else {
              await createMut.mutateAsync(data)
            }
          }}
          onCancel={() => { setModalOpen(false); setEditing(null) }}
        />
      </Modal>
    </div>
  )
}
