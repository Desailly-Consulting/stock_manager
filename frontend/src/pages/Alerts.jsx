import { useMemo } from 'react'
import { AlertTriangle, ShoppingCart } from 'lucide-react'
import Layout from '../components/Layout'

function getStatus(p) {
  if (p.quantity <= 0) return 'Rupture'
  const pct = p.minThreshold > 0 ? (p.quantity / p.minThreshold) * 100 : 100
  if (pct < 25) return 'Critique'
  return 'Alerte'
}

function getPct(p) {
  if (p.minThreshold <= 0) return 100
  return Math.min(100, Math.round((p.quantity / p.minThreshold) * 100))
}

export default function Alerts({ products, alertCount }) {
  const alertProducts = useMemo(
    () =>
      products
        .filter(p => p.quantity < p.minThreshold)
        .sort((a, b) => getPct(a) - getPct(b)), // most critical first
    [products]
  )

  const ruptures  = alertProducts.filter(p => p.quantity <= 0)
  const critiques = alertProducts.filter(p => p.quantity > 0 && getPct(p) < 25)
  const bas       = alertProducts.filter(p => getPct(p) >= 25)

  return (
    <Layout title="Alertes stock" alertCount={alertCount}>
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{ruptures.length}</p>
            <p className="text-xs text-gray-500">Rupture totale</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-500">{critiques.length}</p>
            <p className="text-xs text-gray-500">Stock critique (&lt; 25%)</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{bas.length}</p>
            <p className="text-xs text-gray-500">Stock bas (25–100%)</p>
          </div>
        </div>
      </div>

      {alertProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center gap-3 text-gray-400">
          <ShoppingCart size={40} strokeWidth={1.5} />
          <p className="text-lg font-medium">Tous les stocks sont suffisants</p>
          <p className="text-sm">Aucun produit n&apos;est sous son seuil minimum.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Produit</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium text-right">Stock actuel</th>
                  <th className="px-4 py-3 font-medium text-right">Seuil min.</th>
                  <th className="px-4 py-3 font-medium">Criticité</th>
                  <th className="px-4 py-3 font-medium text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alertProducts.map(p => {
                  const pct    = getPct(p)
                  const status = getStatus(p)
                  const barColor =
                    status === 'Rupture' ? 'bg-gray-400'
                    : pct < 25           ? 'bg-red-500'
                    :                      'bg-orange-400'
                  const badge =
                    status === 'Rupture' ? 'bg-gray-100 text-gray-600'
                    : pct < 25           ? 'bg-red-100 text-red-700'
                    :                      'bg-orange-100 text-orange-700'

                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-red-600">
                        {p.quantity} {p.unit}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {p.minThreshold} {p.unit}
                      </td>
                      <td className="px-4 py-3 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${barColor}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-9 text-right">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badge}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            {alertProducts.length} produit{alertProducts.length > 1 ? 's' : ''} sous le seuil minimum
          </div>
        </div>
      )}
    </Layout>
  )
}
