import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, Filter } from 'lucide-react'
import Layout from '../components/Layout'
import AlertBadge from '../components/AlertBadge'
import ProductModal from '../components/ProductModal'
import { CATEGORIES } from '../data/mockData'
import { api } from '../services/api'

function getStatus(p) {
  if (p.quantity <= 0) return 'Rupture'
  if (p.quantity < p.minThreshold) return 'Alerte'
  return 'OK'
}

export default function Products({ products, setProducts, alertCount }) {
  const [search, setSearch]           = useState('')
  const [categoryFilter, setCategory] = useState('Toutes')
  const [modal, setModal]             = useState(null) // null | 'add' | product-obj

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = categoryFilter === 'Toutes' || p.category === categoryFilter
      return matchSearch && matchCategory
    })
  }, [products, search, categoryFilter])

  const handleSave = async (data) => {
    try {
      if (data.id) {
        const updated = await api.updateProduct(data.id, data)
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
      } else {
        const created = await api.createProduct(data)
        setProducts(prev => [...prev, created])
      }
      setModal(null)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await api.deleteProduct(id)
        setProducts(prev => prev.filter(p => p.id !== id))
      } catch (err) {
        console.error('Erreur lors de la suppression :', err)
      }
    }
  }

  return (
    <Layout title="Produits" alertCount={alertCount}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategory(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Toutes">Toutes catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors ml-auto"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium text-right">Quantité</th>
                <th className="px-4 py-3 font-medium">Unité</th>
                <th className="px-4 py-3 font-medium text-right">Seuil min.</th>
                <th className="px-4 py-3 font-medium text-right">Prix unit.</th>
                <th className="px-4 py-3 font-medium text-center">Statut</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const status = getStatus(p)
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                      <td className="px-4 py-3 text-gray-500">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                          {p.category}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        status === 'OK' ? 'text-gray-800' :
                        status === 'Alerte' ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {p.quantity}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.unit}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{p.minThreshold}</td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {p.pricePerUnit.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <AlertBadge status={status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setModal(p)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          {filtered.length !== products.length && ` (sur ${products.length} au total)`}
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </Layout>
  )
}
