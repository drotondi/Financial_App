import type { HoshinDashboard, HoshinKPI } from '../../api/hoshin'

const STATUS_COLORS: Record<string, string> = {
  not_started: '#a1a1aa',
  in_progress: '#3b82f6',
  complete: '#10b981',
  on_hold: '#f59e0b',
}

const STATUS_LABELS: Record<string, string> = {
  not_started: 'No iniciado',
  in_progress: 'En curso',
  complete: 'Completado',
  on_hold: 'En pausa',
}

// ── Summary stat card ─────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</span>
      <span className={`text-3xl font-bold ${color ?? 'text-zinc-900'}`}>{value}</span>
      {sub && <span className="text-xs text-zinc-400">{sub}</span>}
    </div>
  )
}

// ── Radial progress ───────────────────────────────────────────────────────────

function RadialProgress({ value, size = 80 }: { value: number; size?: number }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e4e4e7" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="#6366f1"
        strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── KPI progress list ─────────────────────────────────────────────────────────

function KPIProgressBar({ kpi }: { kpi: HoshinKPI }) {
  const pct = kpi.target_value && kpi.current_value != null
    ? Math.min((kpi.current_value / kpi.target_value) * 100, 100)
    : 0
  const reached = kpi.target_value != null && kpi.current_value != null && kpi.current_value >= kpi.target_value
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-medium text-zinc-800 truncate">{kpi.title}</span>
          <span className="text-xs text-zinc-500 flex-shrink-0 ml-2">
            {kpi.current_value ?? '—'} / {kpi.target_value ?? '—'} {kpi.unit ?? ''}
          </span>
        </div>
        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${reached ? 'bg-emerald-500' : 'bg-indigo-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Program status donut ──────────────────────────────────────────────────────

function StatusBar({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((s, v) => s + v, 0)
  if (total === 0) return <p className="text-sm text-zinc-400">Sin programas</p>

  return (
    <div className="space-y-2">
      {Object.entries(counts).map(([status, count]) => (
        <div key={status} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[status] ?? '#a1a1aa' }} />
          <span className="text-sm text-zinc-700 flex-1">{STATUS_LABELS[status] ?? status}</span>
          <span className="text-sm font-semibold text-zinc-900">{count}</span>
          <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(count / total) * 100}%`, backgroundColor: STATUS_COLORS[status] ?? '#a1a1aa' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main widget group ─────────────────────────────────────────────────────────

interface HoshinDashboardWidgetsProps {
  data: HoshinDashboard
  kpis: HoshinKPI[]
}

export default function HoshinDashboardWidgets({ data, kpis }: HoshinDashboardWidgetsProps) {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col items-center gap-2">
          <RadialProgress value={data.avg_program_progress} />
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide text-center">
            Avance promedio
          </span>
          <span className="text-xl font-bold text-zinc-900">{data.avg_program_progress}%</span>
        </div>
        <StatCard
          label="KPIs alcanzados"
          value={`${data.kpi_completion_rate}%`}
          sub={`${kpis.filter(k => k.target_value != null && k.current_value != null && k.current_value >= k.target_value).length} / ${kpis.length} KPIs`}
          color="text-emerald-600"
        />
        <StatCard
          label="Tareas completadas"
          value={`${data.completed_tasks}/${data.total_tasks}`}
          sub={data.total_tasks > 0 ? `${Math.round(data.completed_tasks / data.total_tasks * 100)}% completado` : ''}
          color="text-indigo-600"
        />
        <StatCard
          label="Bloqueadas"
          value={data.blocked_task_count}
          sub="tareas bloqueadas"
          color={data.blocked_task_count > 0 ? 'text-rose-600' : 'text-zinc-900'}
        />
      </div>

      {/* Two-column detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program status breakdown */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">Estado de Programas</h3>
          <StatusBar counts={data.program_status_counts} />
        </div>

        {/* KPI progress */}
        {kpis.length > 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">KPIs</h3>
            <div className="space-y-3">
              {kpis.map((kpi) => (
                <KPIProgressBar key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
