import { NavLink, Outlet } from 'react-router-dom'

const TABS = [
  { to: '/hoshin/matrix', label: 'Matriz X' },
  { to: '/hoshin/programs', label: 'Programas' },
  { to: '/hoshin/dashboard', label: 'Dashboard' },
]

export default function HoshinPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Hoshin Kanri</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Plan estratégico · Objetivos · Programas · KPIs
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-zinc-200">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Child route */}
      <Outlet />
    </div>
  )
}
