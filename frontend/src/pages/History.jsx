import { useState, useMemo } from 'react'
import { Download, ArrowUpRight, ArrowDownRight, Filter, X } from 'lucide-react'
import Layout from '../components/Layout'
import { exportMovementsToExcel } from '../utils/exportExcel'

export default function History({ products, movements, alertCount }) {
  const [dateFrom,    setDateFrom]    = useState('')
  const [dateTo,      setDateTo]      = useState('')
  const [typeFilter,  setTypeFilter]  = useState('Tous')
  const [productFilter, setProductFilter] = useState('')

  const productNames = useMemo(
    () => [...new Set(movements.map(m => m.productName))].sort(),
    [movements]
  )

  const filtered = useMemo(() => {
    return [...movements]
      .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : b.id - a.id))
      .filter(m => {
        if (dateFrom    && m.date < dateFrom)                          return false
        if (dateTo      && m.date > dateTo)                            return false
        if (typeFilter  !== 'Tous' && m.type !== typeFilter)           return false
        if (productFilter && m.productName !== productFilter)          return false
        return true
      })
  }, [movements, dateFrom, dateTo, typeFilter, productFilter])

  const clearFilters = () => {
    setDateFrom('')
    setDateTo('')
    setTypeFilter('Tous')
    setProductFilter('')
  }

  const hasFilters = dateFrom || dateTo || typeFilter !== 'Tous' || productFilter

  return (
    <Layout title="Historique" alertCount={alertCount}>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Du</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Au</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Tous">Tous</option>
              <option value="Entrée">Entrées</option>
              <option value="Sortie">Sorties</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Produit</label>
            <select
              value={productFilter}
              onChange={e => setProductFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les produits</option>
              {productNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X size={14} /> Réinitialiser
            </button>
          )}

          <div className="ml-auto">
            <button
              onClick={() => exportMovementsToExcel(filtered)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Download size={15} />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Produit</th>
                <th className="px-4 py-3 font-medium text-center">Type</th>
                <th className="px-4 py-3 font-medium text-right">Quantité</th>
                <th className="px-4 py-3 font-medium">Commentaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Aucun mouvement trouvé pour ces filtres
                  </td>
                </tr>
              ) : (
                filtered.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">{m.date}</td>
                    <td className="px-4 py-2.5 font-medium text-gray-800">{m.productName}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        m.type === 'Entrée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {m.type === 'Entrée' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {m.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700 font-medium">{m.quantity}</td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs max-w-[240px] truncate">{m.comment || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          {filtered.length} mouvement{filtered.length > 1 ? 's' : ''}
          {hasFilters && ` filtré${filtered.length > 1 ? 's' : ''} (sur ${movements.length} au total)`}
        </div>
      </div>
    </Layout>
  )
}
