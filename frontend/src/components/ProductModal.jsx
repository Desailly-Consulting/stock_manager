import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../data/mockData'

const EMPTY = {
  name: '',
  category: CATEGORIES[0],
  quantity: '',
  unit: '',
  minThreshold: '',
  pricePerUnit: '',
}

export default function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product) {
      setForm({
        name:         product.name,
        category:     product.category,
        quantity:     String(product.quantity),
        unit:         product.unit,
        minThreshold: String(product.minThreshold),
        pricePerUnit: String(product.pricePerUnit),
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [product])

  const validate = () => {
    const e = {}
    if (!form.name.trim())          e.name         = 'Nom requis'
    if (!form.unit.trim())          e.unit         = 'Unité requise'
    if (isNaN(form.quantity) || form.quantity === '') e.quantity = 'Quantité invalide'
    if (isNaN(form.minThreshold) || form.minThreshold === '') e.minThreshold = 'Seuil invalide'
    if (isNaN(form.pricePerUnit) || form.pricePerUnit === '') e.pricePerUnit = 'Prix invalide'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onSave({
      ...(product ?? {}),
      name:         form.name.trim(),
      category:     form.category,
      quantity:     Number(form.quantity),
      unit:         form.unit.trim(),
      minThreshold: Number(form.minThreshold),
      pricePerUnit: Number(form.pricePerUnit),
    })
  }

  const field = (label, key, type = 'text', opts = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`}
        {...opts}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {field('Nom du produit', 'name', 'text', { placeholder: 'ex. Farine de blé T55' })}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={form.category}
              onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field('Quantité initiale', 'quantity', 'number', { min: 0, step: 0.1 })}
            {field('Unité', 'unit', 'text', { placeholder: 'ex. kg, L, boîtes' })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field('Seuil minimum', 'minThreshold', 'number', { min: 0, step: 0.1 })}
            {field('Prix unitaire (€)', 'pricePerUnit', 'number', { min: 0, step: 0.01 })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {product ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
