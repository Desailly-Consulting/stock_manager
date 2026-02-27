import { useState, useMemo, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { api } from './services/api'

import Dashboard from './pages/Dashboard'
import Products  from './pages/Products'
import Movements from './pages/Movements'
import History   from './pages/History'
import Alerts    from './pages/Alerts'
import DevTools  from './pages/DevTools'

export default function App() {
  const [products,  setProducts]  = useState([])
  const [movements, setMovements] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    Promise.all([api.getProducts(), api.getMovements()])
      .then(([prods, movs]) => {
        setProducts(prods)
        setMovements(movs)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const alertCount = useMemo(
    () => products.filter(p => p.quantity < p.minThreshold).length,
    [products]
  )

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-400 text-sm animate-pulse">Chargement des données…</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-red-500 font-medium mb-2">Impossible de contacter le serveur</p>
        <p className="text-gray-400 text-xs mt-1">{error}</p>
      </div>
    </div>
  )

  const sharedProps = { products, movements, alertCount }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard {...sharedProps} />}
        />
        <Route
          path="/products"
          element={<Products {...sharedProps} setProducts={setProducts} />}
        />
        <Route
          path="/movements"
          element={
            <Movements
              {...sharedProps}
              setMovements={setMovements}
              setProducts={setProducts}
            />
          }
        />
        <Route
          path="/history"
          element={<History {...sharedProps} />}
        />
        <Route
          path="/alerts"
          element={<Alerts {...sharedProps} />}
        />
        <Route path="/dev" element={<DevTools />} />
      </Routes>
    </BrowserRouter>
  )
}
