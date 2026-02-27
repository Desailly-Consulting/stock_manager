// ─── API client — Stock Manager ──────────────────────────────────────────────
// En dev  : les appels /api/... sont proxifiés par Vite vers localhost:8000
// En prod : VITE_API_URL pointe vers le backend Render
const BASE = import.meta.env.VITE_API_URL ?? ''

async function request(method, path, body) {
  const opts = { method, headers: {} }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText)
    throw new Error(`${method} ${path} → ${res.status}: ${detail}`)
  }
  return res.status === 204 ? null : res.json()
}

// ─── Normalisation snake_case (API) → camelCase (frontend) ───────────────────

function normalizeProduct(p) {
  return {
    id:           p.id,
    name:         p.name,
    category:     p.category,
    quantity:     Number(p.quantity),
    unit:         p.unit,
    minThreshold: Number(p.min_threshold),
    pricePerUnit: Number(p.price_per_unit),
  }
}

function normalizeMovement(m) {
  return {
    id:          m.id,
    productId:   m.product_id,
    productName: m.product_name,
    type:        m.type,
    quantity:    Number(m.quantity),
    date:        String(m.date),
    comment:     m.comment ?? '',
  }
}

// ─── Méthodes exposées ────────────────────────────────────────────────────────

export const api = {
  // Produits
  async getProducts() {
    const data = await request('GET', '/api/products')
    return data.map(normalizeProduct)
  },

  async createProduct(product) {
    const data = await request('POST', '/api/products', {
      name:           product.name,
      category:       product.category,
      quantity:       Number(product.quantity),
      unit:           product.unit,
      min_threshold:  Number(product.minThreshold),
      price_per_unit: Number(product.pricePerUnit),
    })
    return normalizeProduct(data)
  },

  async updateProduct(id, product) {
    const data = await request('PUT', `/api/products/${id}`, {
      name:           product.name,
      category:       product.category,
      quantity:       Number(product.quantity),
      unit:           product.unit,
      min_threshold:  Number(product.minThreshold),
      price_per_unit: Number(product.pricePerUnit),
    })
    return normalizeProduct(data)
  },

  async deleteProduct(id) {
    return request('DELETE', `/api/products/${id}`)
  },

  // Mouvements
  async getMovements(params = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
    ).toString()
    const data = await request('GET', `/api/movements${qs ? '?' + qs : ''}`)
    return data.map(normalizeMovement)
  },

  async createMovement(movement) {
    const data = await request('POST', '/api/movements', {
      product_id: Number(movement.productId),
      type:       movement.type,
      quantity:   Number(movement.quantity),
      date:       movement.date,
      comment:    movement.comment || null,
    })
    return normalizeMovement(data)
  },
}
