import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, ArrowLeft } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout({ children, alertCount = 0, title = '' }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate    = useNavigate()
  const location    = useLocation()
  const isHome      = location.pathname === '/'
  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar alertCount={alertCount} onNavClick={closeMobile} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closeMobile}
          />
          <div className="relative z-50">
            <Sidebar alertCount={alertCount} onNavClick={closeMobile} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
          {/* Back button — all pages except home */}
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-sm font-medium"
              title="Page précédente"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Retour</span>
            </button>
          )}
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800 truncate">{title}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
