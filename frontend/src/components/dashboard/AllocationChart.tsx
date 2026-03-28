import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '../../utils/formatters'
import { useCurrencyStore } from '../../store/currencyStore'
import { CHART_COLORS, CATEGORY_LABELS } from '../../utils/constants'
import Card from '../ui/Card'

interface AllocationItem {
  category: string
  value: number
  percentage: number
}

interface Props {
  data: AllocationItem[]
}

export default function AllocationChart({ data }: Props) {
  const { displayCurrency } = useCurrencyStore()

  const chartData = data.map((d) => ({
    ...d,
    name: CATEGORY_LABELS[d.category] ?? d.category,
  }))

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-zinc-700 mb-4">Distribución de Activos</h2>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-zinc-400 text-sm">Sin datos</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatCurrency(value, displayCurrency), '']}
              labelFormatter={(label) => label}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '12px' }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span style={{ fontSize: 12, color: '#71717a' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      {/* Table */}
      <div className="mt-2 space-y-1.5">
        {data.map((d, i) => (
          <div key={d.category} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-zinc-600">{CATEGORY_LABELS[d.category] ?? d.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400">{d.percentage}%</span>
              <span className="tabular-num font-medium text-zinc-800">
                {formatCurrency(d.value, displayCurrency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
