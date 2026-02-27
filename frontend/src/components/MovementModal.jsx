import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const today = () => new Date().toISOString().split('T')[0]

export default function MovementModal({ products, onSave, onClose }) {
  const [form, setForm] = useState({
    productId: '',
    type: 'Entrée',
    quantity: '',
    date: today(),
    comment: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (products.length > 0 && !form.productId) {
      setForm(f => ({ ...f, productId: String(products[0].id) }))
    }
  }, [products])

  const validate = () => {
    const e = {}
    if (!form.productId)                              e.productId = 'Produit requis'
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0)
                                                      e.quantity  = 'Quantité invalide (> 0)'
    if (!form.date)                                   e.date      = 'Date requise'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const product = products.find(p => p.id === Number(form.productId))
    onSave({
      productId:   Number(form.productId),
      productName: product?.name ?? '',
      type:        form.type,
      quantity:    Number(form.quantity),
      date:        form.date,
      comment:     form.comment.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Nouveau mouvement</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
            <select
              value={form.productId}
              onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.productId ? 'border-red-400' : 'border-gray-300'}`}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.quantity} {p.unit})</option>
              ))}
            </select>
            {errors.productId && <p className="text-xs text-red-500 mt-1">{errors.productId}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div className="flex gap-3">
              {['Entrée', 'Sortie'].map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={t}
                    checked={form.type === t}
                    onChange={() => setForm(f => ({ ...f, type: t }))}
                    className="accent-primary-600"
                  />
                  <span className={`text-sm font-medium ${t === 'Entrée' ? 'text-green-700' : 'text-red-700'}`}>{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire <span className="text-gray-400">(optionnel)</span></label>
            <textarea
              rows={2}
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              placeholder="Motif, fournisseur, numéro de bon..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
