import type { Liability } from '../../api/liabilities'
import { useCurrencyStore } from '../../store/currencyStore'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { CATEGORY_LABELS } from '../../utils/constants'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'

interface Props {
  liabilities: Liability[]
  onEdit: (l: Liability) => void
  onDelete: (id: number) => void
  onAdd: () => void
}

export default function LiabilityTable({ liabilities, onEdit, onDelete, onAdd }: Props) {
  const { convert, displayCurrency } = useCurrencyStore()

  if (liabilities.length === 0) {
    return (
      <EmptyState
        title="Sin pasivos registrados"
        description="Agregá tus deudas para ver el panorama completo"
        action={<Button onClick={onAdd}>Agregar pasivo</Button>}
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100">
            {['Nombre', 'Categoría', 'Saldo pendiente', 'Tasa %', 'Vencimiento', ''].map((h) => (
              <th key={h} className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wide py-2.5 px-3 first:pl-0 last:pr-0">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {liabilities.map((l) => {
            const converted = convert(l.outstanding_balance, l.currency)
            return (
              <tr key={l.id} className="hover:bg-zinc-50 transition-colors">
                <td className="py-3 px-3 pl-0">
                  <div className="font-medium text-zinc-900">{l.name}</div>
                  {l.institution && <div className="text-xs text-zinc-400">{l.institution}</div>}
                </td>
                <td className="py-3 px-3">
                  <Badge value={l.category} label={CATEGORY_LABELS[l.category]} />
                </td>
                <td className="py-3 px-3 tabular-num font-medium text-rose-600">
                  {converted !== null ? formatCurrency(converted, displayCurrency) : formatCurrency(l.outstanding_balance, l.currency)}
                </td>
                <td className="py-3 px-3 tabular-num text-zinc-500">
                  {l.interest_rate != null ? `${l.interest_rate}%` : '—'}
                </td>
                <td className="py-3 px-3 text-zinc-500 text-xs">
                  {l.due_date ? formatDate(l.due_date) : '—'}
                </td>
                <td className="py-3 px-3 pr-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(l)}>Editar</Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(l.id)}>
                      <span className="text-rose-500">Eliminar</span>
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
