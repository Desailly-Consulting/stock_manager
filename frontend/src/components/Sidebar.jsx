import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  History,
  BellRing,
  ChevronRight,
  BookOpen,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',          label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/products',  label: 'Produits',        icon: Package },
  { to: '/movements', label: 'Mouvements',      icon: ArrowLeftRight },
  { to: '/history',   label: 'Historique',      icon: History },
  { to: '/alerts',    label: 'Alertes',         icon: BellRing },
]

export default function Sidebar({ alertCount = 0, onNavClick }) {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-primary-900 text-white shadow-xl">
      {/* Logo / brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-700">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-500">
          <Package size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-base leading-tight">StockManager</p>
          <p className="text-primary-300 text-xs">Gestion des stocks</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {label === 'Alertes' && alertCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-red-500 text-white">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-primary-700 space-y-2">
        <Link
          to="/dev"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-primary-300 hover:bg-primary-800 hover:text-white text-xs font-medium transition-colors"
        >
          <BookOpen size={14} />
          Documentation API
        </Link>
        <p className="text-primary-500 text-xs px-3">Version 1.0 — Démo</p>
      </div>
    </aside>
  )
}
