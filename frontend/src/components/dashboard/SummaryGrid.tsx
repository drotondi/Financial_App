import { useCurrencyStore } from '../../store/currencyStore'
import { formatCurrency } from '../../utils/formatters'

interface SummaryData {
  total_assets: number
  total_liabilities: number
  net_worth: number
  base_currency: string
  asset_count: number
  liability_count: number
}

interface Props {
  data: SummaryData
}

export default function SummaryGrid({ data }: Props) {
  const { displayCurrency } = useCurrencyStore()
  const cur = displayCurrency

  const cards = [
    {
      label: 'Patrimonio Neto',
      value: formatCurrency(data.net_worth, cur),
      sub: `${data.asset_count} activos · ${data.liability_count} pasivos`,
      gradient: true,
    },
    {
      label: 'Total Activos',
      value: formatCurrency(data.total_assets, cur),
      sub: `${data.asset_count} registros`,
      positive: true,
    },
    {
      label: 'Total Pasivos',
      value: formatCurrency(data.total_liabilities, cur),
      sub: `${data.liability_count} registros`,
      negative: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-xl p-5 ${
            c.gradient
              ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white'
              : 'bg-white border border-zinc-200 shadow-sm'
          }`}
        >
          <p className={`text-xs font-medium mb-1 ${c.gradient ? 'text-indigo-200' : 'text-zinc-500'}`}>
            {c.label}
          </p>
          <p className={`text-2xl font-bold tabular-num ${
            c.gradient ? 'text-white' : c.positive ? 'text-emerald-600' : c.negative ? 'text-rose-600' : 'text-zinc-900'
          }`}>
            {c.value}
          </p>
          <p className={`text-xs mt-1 ${c.gradient ? 'text-indigo-200' : 'text-zinc-400'}`}>{c.sub}</p>
        </div>
      ))}
    </div>
  )
}
