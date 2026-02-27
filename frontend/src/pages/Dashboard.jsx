import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Package, AlertTriangle, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react'
import Layout from '../components/Layout'
import KpiCard from '../components/KpiCard'
import AlertBadge from '../components/AlertBadge'

function getStatus(product) {
  if (product.quantity <= 0) return 'Rupture'
  if (product.quantity < product.minThreshold) return 'Alerte'
  return 'OK'
}

export default function Dashboard({ products, movements, alertCount }) {
  const todayStr = new Date().toISOString().split('T')[0]

  const totalValue = useMemo(
    () => products.reduce((sum, p) => sum + p.quantity * p.pricePerUnit, 0),
    [products]
  )
  const lowStock = useMemo(
    () => products.filter(p => p.quantity < p.minThreshold).length,
    [products]
  )
  const todayMovements = useMemo(
    () => movements.filter(m => m.date === todayStr).length,
    [movements, todayStr]
  )

  const recentMovements = useMemo(
    () => [...movements].sort((a, b) => (b.date > a.date ? 1 : b.id - a.id)).slice(0, 5),
    [movements]
  )

  const alertProducts = useMemo(
    () => products.filter(p => p.quantity < p.minThreshold).slice(0, 5),
    [products]
  )

  const top10 = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10)
        .map(p => ({ name: p.name.length > 18 ? p.name.slice(0, 17) + '…' : p.name, qty: p.quantity })),
    [products]
  )

  return (
    <Layout title="Tableau de bord" alertCount={alertCount}>
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total produits"
          value={products.length}
          subtitle="références en catalogue"
          icon={Package}
          color="blue"
        />
        <KpiCard
          title="Stock faible"
          value={lowStock}
          subtitle="produits sous le seuil"
          icon={AlertTriangle}
          color={lowStock > 0 ? 'red' : 'green'}
        />
        <KpiCard
          title="Mouvements aujourd'hui"
          value={todayMovements}
          subtitle="entrées + sorties du jour"
          icon={TrendingUp}
          color="purple"
        />
        <KpiCard
          title="Valeur du stock"
          value={`${totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`}
          subtitle="valeur totale estimée"
          icon={DollarSign}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar chart — top 10 */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Top 10 produits — stock actuel</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top10} margin={{ top: 0, right: 10, left: -20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                angle={-40}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                formatter={(v) => [v, 'Quantité']}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="qty" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Alertes actives</h2>
            <Link
              to="/alerts"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
            >
              Voir tout <ChevronRight size={13} />
            </Link>
          </div>
          {alertProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aucune alerte</p>
          ) : (
            <ul className="space-y-3">
              {alertProducts.map(p => {
                const pct = p.minThreshold > 0 ? Math.round((p.quantity / p.minThreshold) * 100) : 100
                const status = getStatus(p)
                return (
                  <li key={p.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">
                        {p.quantity} / {p.minThreshold} {p.unit}
                      </p>
                    </div>
                    <AlertBadge status={status} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Recent movements */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Derniers mouvements</h2>
          <Link
            to="/history"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            Historique complet <ChevronRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-2 font-medium">Produit</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium text-right">Quantité</th>
                <th className="pb-2 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentMovements.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 font-medium text-gray-800">{m.productName}</td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      m.type === 'Entrée'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {m.type === 'Entrée' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {m.type}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-gray-600">{m.quantity}</td>
                  <td className="py-2.5 text-right text-gray-400 text-xs">{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
