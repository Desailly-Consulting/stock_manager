import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, ChevronRight, Copy, Check } from 'lucide-react'

// ─── JSON syntax highlighter ─────────────────────────────────────────────────

function highlight(json) {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"([^"]+)"(\s*:)/g, '<span class="text-sky-400">"$1"</span>$2')
    .replace(/:\s*"([^"]*)"/g, ': <span class="text-emerald-400">"$1"</span>')
    .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="text-amber-400">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>')
}

function JsonBlock({ data }) {
  const [copied, setCopied] = useState(false)
  const raw = JSON.stringify(data, null, 2)
  const copy = () => {
    navigator.clipboard.writeText(raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
      <button
        onClick={copy}
        className="absolute top-2.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
        title="Copier"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      </button>
      <pre
        className="text-xs leading-relaxed p-4 overflow-x-auto text-slate-300 font-mono"
        dangerouslySetInnerHTML={{ __html: highlight(raw) }}
      />
    </div>
  )
}

// ─── Method badge ─────────────────────────────────────────────────────────────

const METHOD_STYLE = {
  GET:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  POST:   'bg-blue-500/15   text-blue-400   border border-blue-500/30',
  PUT:    'bg-amber-500/15  text-amber-400  border border-amber-500/30',
  DELETE: 'bg-red-500/15    text-red-400    border border-red-500/30',
}

function MethodBadge({ method }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wider ${METHOD_STYLE[method]}`}>
      {method}
    </span>
  )
}

// ─── Endpoint card ────────────────────────────────────────────────────────────

function Endpoint({ method, path, description, params = [], body = null, response, statusCodes = [] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden mb-3">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-750 text-left transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <MethodBadge method={method} />
        <code className="text-slate-200 text-sm font-mono flex-1">{path}</code>
        <span className="text-slate-400 text-xs hidden sm:block">{description}</span>
        <ChevronRight size={15} className={`text-slate-500 transition-transform flex-shrink-0 ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="px-4 py-4 bg-slate-900 border-t border-slate-700 space-y-4">
          <p className="text-slate-300 text-sm">{description}</p>

          {/* Query params */}
          {params.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Paramètres</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700">
                    <th className="text-left pb-1.5 font-medium w-1/4">Nom</th>
                    <th className="text-left pb-1.5 font-medium w-1/5">Type</th>
                    <th className="text-left pb-1.5 font-medium w-16">Requis</th>
                    <th className="text-left pb-1.5 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {params.map(p => (
                    <tr key={p.name} className="text-slate-300">
                      <td className="py-1.5 font-mono text-sky-400">{p.name}</td>
                      <td className="py-1.5 font-mono text-amber-400">{p.type}</td>
                      <td className="py-1.5">
                        {p.required
                          ? <span className="text-red-400">oui</span>
                          : <span className="text-slate-500">non</span>}
                      </td>
                      <td className="py-1.5 text-slate-400">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Body */}
          {body && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Corps de la requête (JSON)</p>
              <JsonBlock data={body} />
            </div>
          )}

          {/* Response */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Réponse</p>
            <JsonBlock data={response} />
          </div>

          {/* Status codes */}
          {statusCodes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {statusCodes.map(s => (
                <span key={s.code} className={`text-xs px-2 py-0.5 rounded font-mono border ${
                  s.code < 300 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : s.code < 400 ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {s.code} — {s.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-24 mb-14">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

// ─── Shared examples ─────────────────────────────────────────────────────────

const PRODUCT_OUT = {
  id: 1,
  name: "Farine de blé T55",
  category: "Épicerie",
  quantity: "120.00",
  unit: "kg",
  min_threshold: "50.00",
  price_per_unit: "0.85",
  created_at: "2026-02-15T10:00:00Z",
  updated_at: "2026-02-27T08:32:11Z"
}

const MOVEMENT_OUT = {
  id: 28,
  product_id: 21,
  product_name: "Pommes de terre",
  type: "Entrée",
  quantity: "50.00",
  date: "2026-02-27",
  comment: "Livraison hebdomadaire",
  created_at: "2026-02-27T09:15:00Z"
}

const SECTIONS = [
  { id: 'intro',     label: 'Introduction' },
  { id: 'products',  label: 'Produits' },
  { id: 'movements', label: 'Mouvements' },
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'errors',    label: 'Erreurs' },
  { id: 'health',    label: 'Health' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevTools() {
  const [active, setActive] = useState('intro')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} /> Retour à l'application
          </Link>
          <span className="text-slate-700">|</span>
          <span className="font-semibold text-white">StockManager</span>
          <span className="text-slate-500 text-sm">— Documentation API</span>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            v1.0
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-10">
        {/* Left nav */}
        <nav className="hidden lg:block w-52 flex-shrink-0 sticky top-24 self-start">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Sections
          </p>
          <ul className="space-y-0.5">
            {SECTIONS.map(s => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    active === s.id
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {active === s.id && <span className="w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />}
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Méthodes HTTP
            </p>
            <div className="space-y-1.5">
              {Object.entries(METHOD_STYLE).map(([m, cls]) => (
                <div key={m} className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${cls}`}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* ── Introduction ── */}
          <Section id="intro" title="Documentation API" subtitle="Référence complète des endpoints REST de StockManager.">
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Base URL (dev)</p>
                <code className="text-emerald-400 text-sm font-mono">http://localhost:8000</code>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Base URL (prod)</p>
                <code className="text-emerald-400 text-sm font-mono">https://votre-app.railway.app</code>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="text-sky-400 font-semibold w-24 flex-shrink-0">Format</span>
                <span>Toutes les requêtes et réponses utilisent <code className="text-amber-400 bg-slate-900 px-1 rounded text-xs">JSON</code>. Ajouter l'en-tête <code className="text-amber-400 bg-slate-900 px-1 rounded text-xs">Content-Type: application/json</code> pour les POST/PUT.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sky-400 font-semibold w-24 flex-shrink-0">Auth</span>
                <span>Aucune authentification requise sur cette version (démo publique).</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sky-400 font-semibold w-24 flex-shrink-0">CORS</span>
                <span>Autorisé depuis <code className="text-amber-400 bg-slate-900 px-1 rounded text-xs">localhost:5173</code> (dev) et l'URL de production configurée.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sky-400 font-semibold w-24 flex-shrink-0">Docs auto</span>
                <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
                  /docs <ExternalLink size={12} />
                </a>
                <span className="text-slate-500">— interface Swagger UI interactive</span>
              </div>
            </div>
          </Section>

          {/* ── Products ── */}
          <Section id="products" title="Produits" subtitle="CRUD complet sur le catalogue de produits.">

            <Endpoint
              method="GET"
              path="/api/products"
              description="Retourne la liste de tous les produits, triée par nom. Filtrable par catégorie."
              params={[
                { name: 'category', type: 'string', required: false, desc: 'Filtrer par catégorie (ex. Épicerie, Hygiène…)' },
              ]}
              response={[PRODUCT_OUT, { ...PRODUCT_OUT, id: 2, name: "Sucre en poudre", quantity: "80.00", min_threshold: "30.00", price_per_unit: "0.95" }]}
              statusCodes={[{ code: 200, label: 'OK' }]}
            />

            <Endpoint
              method="GET"
              path="/api/products/alerts"
              description="Retourne uniquement les produits dont la quantité est inférieure au seuil minimum, triés par criticité (les plus critiques en premier)."
              response={[
                { ...PRODUCT_OUT, id: 4, name: "Huile d'olive vierge", quantity: "18.00", min_threshold: "20.00", price_per_unit: "4.50" },
                { ...PRODUCT_OUT, id: 13, name: "Crème fraîche", quantity: "8.00", min_threshold: "10.00", price_per_unit: "3.50" },
              ]}
              statusCodes={[{ code: 200, label: 'OK' }]}
            />

            <Endpoint
              method="GET"
              path="/api/products/{id}"
              description="Retourne un produit par son identifiant."
              params={[
                { name: 'id', type: 'integer', required: true, desc: 'Identifiant du produit' },
              ]}
              response={PRODUCT_OUT}
              statusCodes={[{ code: 200, label: 'OK' }, { code: 404, label: 'Produit introuvable' }]}
            />

            <Endpoint
              method="POST"
              path="/api/products"
              description="Crée un nouveau produit dans le catalogue."
              body={{
                name: "Huile de tournesol",
                category: "Épicerie",
                quantity: 24,
                unit: "L",
                min_threshold: 10,
                price_per_unit: 2.30
              }}
              response={{ ...PRODUCT_OUT, id: 31, name: "Huile de tournesol", quantity: "24.00", unit: "L", min_threshold: "10.00", price_per_unit: "2.30" }}
              statusCodes={[{ code: 201, label: 'Créé' }, { code: 422, label: 'Validation échouée' }]}
            />

            <Endpoint
              method="PUT"
              path="/api/products/{id}"
              description="Met à jour tous les champs d'un produit existant (remplacement complet)."
              params={[
                { name: 'id', type: 'integer', required: true, desc: 'Identifiant du produit' },
              ]}
              body={{
                name: "Farine de blé T55",
                category: "Épicerie",
                quantity: 120,
                unit: "kg",
                min_threshold: 60,
                price_per_unit: 0.90
              }}
              response={PRODUCT_OUT}
              statusCodes={[{ code: 200, label: 'OK' }, { code: 404, label: 'Produit introuvable' }, { code: 422, label: 'Validation échouée' }]}
            />

            <Endpoint
              method="DELETE"
              path="/api/products/{id}"
              description="Supprime un produit et tous ses mouvements associés (cascade)."
              params={[
                { name: 'id', type: 'integer', required: true, desc: 'Identifiant du produit' },
              ]}
              response={{ detail: "No content" }}
              statusCodes={[{ code: 204, label: 'Supprimé' }, { code: 404, label: 'Produit introuvable' }]}
            />
          </Section>

          {/* ── Movements ── */}
          <Section id="movements" title="Mouvements" subtitle="Enregistrement des entrées et sorties de stock. Chaque mouvement met à jour la quantité du produit en temps réel.">

            <Endpoint
              method="GET"
              path="/api/movements"
              description="Retourne l'historique des mouvements, trié du plus récent au plus ancien. Tous les filtres sont cumulables."
              params={[
                { name: 'product_id', type: 'integer', required: false, desc: 'Filtrer par produit' },
                { name: 'type',       type: 'string',  required: false, desc: '"Entrée" ou "Sortie"' },
                { name: 'date_from',  type: 'date',    required: false, desc: 'Borne de début (YYYY-MM-DD)' },
                { name: 'date_to',    type: 'date',    required: false, desc: 'Borne de fin (YYYY-MM-DD)' },
                { name: 'limit',      type: 'integer', required: false, desc: 'Nombre maximum de résultats' },
              ]}
              response={[MOVEMENT_OUT, { ...MOVEMENT_OUT, id: 27, product_id: 27, product_name: "Gants jetables (boîte)", type: "Sortie", quantity: "2.00", date: "2026-02-26", comment: "Cuisine du jour" }]}
              statusCodes={[{ code: 200, label: 'OK' }]}
            />

            <Endpoint
              method="POST"
              path="/api/movements"
              description="Enregistre un mouvement et met à jour automatiquement la quantité du produit concerné. Une sortie ne peut pas ramener la quantité en dessous de 0."
              body={{
                product_id: 5,
                type: "Sortie",
                quantity: 20,
                date: "2026-02-27",
                comment: "Repas du midi — 200 couverts"
              }}
              response={MOVEMENT_OUT}
              statusCodes={[{ code: 201, label: 'Créé' }, { code: 404, label: 'Produit introuvable' }, { code: 422, label: 'Validation échouée' }]}
            />
          </Section>

          {/* ── Dashboard ── */}
          <Section id="dashboard" title="Tableau de bord" subtitle="Métriques agrégées pour la vue synthétique.">
            <Endpoint
              method="GET"
              path="/api/dashboard"
              description="Retourne les 4 KPIs de la page d'accueil : nombre total de produits, produits sous seuil, mouvements du jour, et valeur totale du stock."
              response={{
                total_products: 30,
                low_stock_count: 7,
                today_movements: 3,
                total_stock_value: "4821.50"
              }}
              statusCodes={[{ code: 200, label: 'OK' }]}
            />
          </Section>

          {/* ── Errors ── */}
          <Section id="errors" title="Codes d'erreur" subtitle="Format standard des réponses d'erreur.">
            <div className="space-y-4 text-sm">
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">404</span>
                  <span className="text-slate-300">Ressource introuvable</span>
                </div>
                <div className="p-4 bg-slate-900">
                  <JsonBlock data={{ detail: "Produit introuvable" }} />
                </div>
              </div>

              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">422</span>
                  <span className="text-slate-300">Erreur de validation (champ manquant ou type incorrect)</span>
                </div>
                <div className="p-4 bg-slate-900">
                  <JsonBlock data={{
                    detail: [
                      { loc: ["body", "quantity"], msg: "Field required", type: "missing" }
                    ]
                  }} />
                </div>
              </div>
            </div>
          </Section>

          {/* ── Health ── */}
          <Section id="health" title="Health check" subtitle="Utilisé par Railway pour vérifier que l'API est opérationnelle.">
            <Endpoint
              method="GET"
              path="/health"
              description="Retourne le statut de l'application. Utilisé comme healthcheck par la plateforme de déploiement."
              response={{ status: "ok" }}
              statusCodes={[{ code: 200, label: 'OK' }]}
            />
          </Section>

        </main>
      </div>
    </div>
  )
}
