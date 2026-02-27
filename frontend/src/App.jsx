import { useState, useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { initialProducts, initialMovements } from './data/mockData'

import Dashboard from './pages/Dashboard'
import Products  from './pages/Products'
import Movements from './pages/Movements'
import History   from './pages/History'
import Alerts    from './pages/Alerts'

export default function App() {
  const [products,  setProducts]  = useState(initialProducts)
  const [movements, setMovements] = useState(initialMovements)

  const alertCount = useMemo(
    () => products.filter(p => p.quantity < p.minThreshold).length,
    [products]
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
      </Routes>
    </BrowserRouter>
  )
}
