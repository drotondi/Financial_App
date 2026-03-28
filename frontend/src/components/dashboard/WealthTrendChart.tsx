import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatCurrency } from '../../utils/formatters'
import { useCurrencyStore } from '../../store/currencyStore'
import Card from '../ui/Card'

interface TrendPoint {
  month: string
  assets: number
  liabilities: number
  net_worth: number
}

interface Props {
  data: TrendPoint[]
}

export default function WealthTrendChart({ data }: Props) {
  const { displayCurrency } = useCurrencyStore()

  const formatted = data.map((d) => ({
    ...d,
    label: d.month.slice(0, 7),
  }))

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-zinc-700 mb-4">Evolución del Patrimonio</h2>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-zinc-400 text-sm">Sin datos</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gAssets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gLiab" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              width={40}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value, displayCurrency),
                name === 'assets' ? 'Activos' : name === 'liabilities' ? 'Pasivos' : 'Patrimonio Neto',
              ]}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="assets" stroke="#6366f1" strokeWidth={2} fill="url(#gAssets)" />
            <Area type="monotone" dataKey="liabilities" stroke="#f43f5e" strokeWidth={2} fill="url(#gLiab)" />
            <Area type="monotone" dataKey="net_worth" stroke="#10b981" strokeWidth={2} fill="none" strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
