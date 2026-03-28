import type { Asset } from '../../api/assets'
import { useCurrencyStore } from '../../store/currencyStore'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { CATEGORY_LABELS } from '../../utils/constants'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'

interface Props {
  assets: Asset[]
  onEdit: (asset: Asset) => void
  onDelete: (id: number) => void
  onAdd: () => void
}

export default function AssetTable({ assets, onEdit, onDelete, onAdd }: Props) {
  const { convert, displayCurrency } = useCurrencyStore()

  if (assets.length === 0) {
    return (
      <EmptyState
        title="Sin activos registrados"
        description="Agregá tu primer activo para comenzar"
        action={<Button onClick={onAdd}>Agregar activo</Button>}
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100">
            {['Nombre', 'Categoría', 'Valor', 'Costo base', 'P&L', '%', 'Moneda orig.', ''].map((h) => (
              <th key={h} className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wide py-2.5 px-3 first:pl-0 last:pr-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {assets.map((a) => {
            const converted = convert(a.current_value, a.currency)
            const costConverted = a.cost_basis ? convert(a.cost_basis, a.currency) : null
            const pnl = converted !== null && costConverted !== null ? converted - costConverted : null
            const pnlPct = pnl !== null && costConverted ? (pnl / costConverted) * 100 : null

            return (
              <tr key={a.id} className="hover:bg-zinc-50 transition-colors">
                <td className="py-3 px-3 pl-0">
                  <div className="font-medium text-zinc-900">{a.name}</div>
                  {a.institution && <div className="text-xs text-zinc-400">{a.institution}</div>}
                </td>
                <td className="py-3 px-3">
                  <Badge value={a.category} label={CATEGORY_LABELS[a.category]} />
                </td>
                <td className="py-3 px-3 tabular-num font-medium text-zinc-900">
                  {converted !== null ? formatCurrency(converted, displayCurrency) : '—'}
                </td>
                <td className="py-3 px-3 tabular-num text-zinc-500">
                  {costConverted !== null ? formatCurrency(costConverted, displayCurrency) : '—'}
                </td>
                <td className={`py-3 px-3 tabular-num font-medium ${pnl === null ? '' : pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {pnl !== null ? (pnl >= 0 ? '▲ ' : '▼ ') + formatCurrency(Math.abs(pnl), displayCurrency) : '—'}
                </td>
                <td className={`py-3 px-3 tabular-num text-xs ${pnlPct === null ? '' : pnlPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {pnlPct !== null ? formatPercent(pnlPct) : '—'}
                </td>
                <td className="py-3 px-3 text-zinc-400 text-xs">
                  {formatCurrency(a.current_value, a.currency)}
                </td>
                <td className="py-3 px-3 pr-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(a)}>Editar</Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(a.id)}>
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
