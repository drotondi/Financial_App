import { useQuery } from '@tanstack/react-query'
import { hoshinApi } from '../../api/hoshin'
import HoshinDashboardWidgets from '../../components/hoshin/HoshinDashboardWidgets'

export default function HoshinDashboardPage() {
  const { data: dashboard, isLoading: loadingDash } = useQuery({
    queryKey: ['hoshin-dashboard'],
    queryFn: hoshinApi.getDashboard,
  })

  const { data: kpis = [], isLoading: loadingKPIs } = useQuery({
    queryKey: ['hoshin-kpis'],
    queryFn: hoshinApi.listKPIs,
  })

  if (loadingDash || loadingKPIs) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500">
        No se pudo cargar el dashboard.
      </div>
    )
  }

  const hasData =
    Object.keys(dashboard.program_status_counts).length > 0 || kpis.length > 0

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-3">
        <p className="text-lg font-medium">Sin datos aún</p>
        <p className="text-sm text-zinc-400 text-center max-w-sm">
          Creá Programas y KPIs en la Matriz y el Dashboard se completará automáticamente.
        </p>
      </div>
    )
  }

  return <HoshinDashboardWidgets data={dashboard} kpis={kpis} />
}
