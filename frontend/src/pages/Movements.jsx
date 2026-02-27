import { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import Layout from '../components/Layout'
import { api } from '../services/api'

const today = () => new Date().toISOString().split('T')[0]

export default function Movements({ products, movements, setMovements, setProducts, alertCount }) {
  const [form, setForm] = useState({
    productId: products[0]?.id ?? '',
    type: 'Entrée',
    quantity: '',
    date: today(),
    comment: '',
  })
  const [errors, setErrors]   = useState({})
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.productId)                                       e.productId = 'Sélectionnez un produit'
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0) e.quantity = 'Quantité invalide (> 0)'
    if (!form.date)                                            e.date      = 'Date requise'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    try {
      const newMov = await api.createMovement({
        productId: Number(form.productId),
        type:      form.type,
        quantity:  Number(form.quantity),
        date:      form.date,
        comment:   form.comment.trim(),
      })
      setMovements(prev => [newMov, ...prev])

      // Rechargement des produits pour refléter la mise à jour du stock côté serveur
      const updatedProducts = await api.getProducts()
      setProducts(updatedProducts)

      setErrors({})
      setSuccess(true)
      setForm(f => ({ ...f, quantity: '', comment: '', date: today() }))
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement :', err)
    }
  }

  const recent = movements.slice(0, 10)

  return (
    <Layout title="Mouvements" alertCount={alertCount}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-5">Enregistrer un mouvement</h2>

            {success && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                Mouvement enregistré avec succès !
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <select
                  value={form.productId}
                  onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.productId ? 'border-red-400' : 'border-gray-300'}`}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.quantity} {p.unit}
                    </option>
                  ))}
                </select>
                {errors.productId && <p className="text-xs text-red-500 mt-1">{errors.productId}</p>}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de mouvement</label>
                <div className="flex gap-4">
                  {[
                    { val: 'Entrée', color: 'green' },
                    { val: 'Sortie', color: 'red' },
                  ].map(({ val, color }) => (
                    <label key={val} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 cursor-pointer transition-colors ${
                      form.type === val
                        ? color === 'green' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value={val}
                        checked={form.type === val}
                        onChange={() => setForm(f => ({ ...f, type: val }))}
                        className="hidden"
                      />
                      {val === 'Entrée' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      <span className="text-sm font-medium">{val}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="0"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.quantity ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.date ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Fournisseur, bon de livraison, motif…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={16} />
                Enregistrer le mouvement
              </button>
            </form>
          </div>
        </div>

        {/* Recent movements */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Mouvements récents</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="pb-2 font-medium">Produit</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium text-right">Qté</th>
                    <th className="pb-2 font-medium text-right">Date</th>
                    <th className="pb-2 font-medium hidden sm:table-cell">Commentaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 font-medium text-gray-800">{m.productName}</td>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          m.type === 'Entrée' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {m.type === 'Entrée' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                          {m.type}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-gray-600">{m.quantity}</td>
                      <td className="py-2.5 text-right text-gray-400 text-xs whitespace-nowrap">{m.date}</td>
                      <td className="py-2.5 text-gray-400 text-xs hidden sm:table-cell max-w-[180px] truncate">
                        {m.comment || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
