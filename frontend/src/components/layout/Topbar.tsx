import { useAuthStore } from '../../store/authStore'
import { useCurrencyStore, CURRENCIES } from '../../store/currencyStore'

interface TopbarProps {
  title: string
}

export default function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuthStore()
  const { displayCurrency, setDisplayCurrency } = useCurrencyStore()

  return (
    <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
      <h1 className="text-base font-semibold text-zinc-900">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Currency selector */}
        <select
          value={displayCurrency}
          onChange={(e) => setDisplayCurrency(e.target.value)}
          className="text-xs font-medium bg-zinc-100 border border-zinc-200 rounded-md px-2 py-1.5 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* User menu */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-700 text-xs font-semibold">
              {user?.username?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
          <span className="text-sm text-zinc-700 hidden sm:block">{user?.username}</span>
          <button
            onClick={logout}
            className="text-xs text-zinc-500 hover:text-zinc-800 ml-1"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
