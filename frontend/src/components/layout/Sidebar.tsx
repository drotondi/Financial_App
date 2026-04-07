import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/assets', label: 'Activos', icon: '↑' },
  { to: '/liabilities', label: 'Pasivos', icon: '↓' },
  { to: '/transactions', label: 'Transacciones', icon: '⇄' },
  { to: '/hoshin', label: 'Hoshin Kanri', icon: '◎' },
  { to: '/settings', label: 'Configuración', icon: '⚙' },
]

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-zinc-900 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <span className="text-white font-semibold text-base tracking-tight">
          Wealth Tracker
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`
            }
          >
            <span className="text-base w-5 text-center leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom version */}
      <div className="px-6 py-4 text-zinc-600 text-xs">v1.0.0</div>
    </aside>
  )
}
