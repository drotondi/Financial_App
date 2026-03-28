import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard'
import { useCurrencyStore } from '../store/currencyStore'
import SummaryGrid from '../components/dashboard/SummaryGrid'
import AllocationChart from '../components/dashboard/AllocationChart'
import WealthTrendChart from '../components/dashboard/WealthTrendChart'

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-zinc-100 rounded-xl ${className}`} />
}

export default function DashboardPage() {
  const { displayCurrency } = useCurrencyStore()

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['dashboard-summary', displayCurrency],
    queryFn: () => dashboardApi.summary(displayCurrency),
  })

  const { data: allocation, isLoading: loadingAlloc } = useQuery({
    queryKey: ['dashboard-allocation', displayCurrency],
    queryFn: () => dashboardApi.allocation(displayCurrency),
  })

  const { data: trend, isLoading: loadingTrend } = useQuery({
    queryKey: ['dashboard-trend', displayCurrency],
    queryFn: () => dashboardApi.trend(12, displayCurrency),
  })

  return (
    <div className="space-y-5">
      {loadingSummary ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : summary ? (
        <SummaryGrid data={summary} />
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loadingAlloc ? (
          <Skeleton className="h-72" />
        ) : allocation ? (
          <AllocationChart data={allocation.allocation} />
        ) : null}

        {loadingTrend ? (
          <Skeleton className="h-72" />
        ) : trend ? (
          <WealthTrendChart data={trend.trend} />
        ) : null}
      </div>
    </div>
  )
}
