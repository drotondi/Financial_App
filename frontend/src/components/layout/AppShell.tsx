import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useCurrencyStore } from '../../store/currencyStore'
import { exchangeRatesApi } from '../../api/exchangeRates'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/assets': 'Activos',
  '/liabilities': 'Pasivos',
  '/transactions': 'Transacciones',
  '/settings': 'Configuración',
}

export default function AppShell() {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? 'Wealth Tracker'
  const setRates = useCurrencyStore((s) => s.setRates)

  const { data: rates } = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: exchangeRatesApi.list,
  })

  useEffect(() => {
    if (rates) setRates(rates)
  }, [rates, setRates])

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Topbar title={title} />
        <main className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
