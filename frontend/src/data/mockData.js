// ─── Mock data — Stock Manager (thème cantines scolaires) ───────────────────

export const CATEGORIES = [
  'Épicerie',
  'Produits laitiers',
  'Viandes & Poissons',
  'Fruits & Légumes',
  'Hygiène',
  'Matériel',
]

let nextProductId = 100
let nextMovementId = 1000

export const initialProducts = [
  // Épicerie
  { id: 1,  name: 'Farine de blé T55',      category: 'Épicerie',           quantity: 120, unit: 'kg',    minThreshold: 50,  pricePerUnit: 0.85 },
  { id: 2,  name: 'Sucre en poudre',         category: 'Épicerie',           quantity: 80,  unit: 'kg',    minThreshold: 30,  pricePerUnit: 0.95 },
  { id: 3,  name: 'Sel fin',                 category: 'Épicerie',           quantity: 40,  unit: 'kg',    minThreshold: 20,  pricePerUnit: 0.40 },
  { id: 4,  name: 'Huile d\'olive vierge',   category: 'Épicerie',           quantity: 18,  unit: 'L',     minThreshold: 20,  pricePerUnit: 4.50 },
  { id: 5,  name: 'Pâtes fusilli',           category: 'Épicerie',           quantity: 200, unit: 'kg',    minThreshold: 60,  pricePerUnit: 1.20 },
  { id: 6,  name: 'Riz long grain',          category: 'Épicerie',           quantity: 150, unit: 'kg',    minThreshold: 50,  pricePerUnit: 1.10 },
  { id: 7,  name: 'Tomates pelées en boîte', category: 'Épicerie',           quantity: 48,  unit: 'boîtes',minThreshold: 30,  pricePerUnit: 1.30 },
  { id: 8,  name: 'Lentilles vertes',        category: 'Épicerie',           quantity: 60,  unit: 'kg',    minThreshold: 25,  pricePerUnit: 1.60 },
  { id: 9,  name: 'Haricots blancs',         category: 'Épicerie',           quantity: 45,  unit: 'kg',    minThreshold: 20,  pricePerUnit: 1.50 },
  { id: 10, name: 'Semoule fine',            category: 'Épicerie',           quantity: 12,  unit: 'kg',    minThreshold: 30,  pricePerUnit: 0.90 },
  // Produits laitiers
  { id: 11, name: 'Lait demi-écrémé',        category: 'Produits laitiers',  quantity: 90,  unit: 'L',     minThreshold: 40,  pricePerUnit: 1.05 },
  { id: 12, name: 'Beurre doux',             category: 'Produits laitiers',  quantity: 15,  unit: 'kg',    minThreshold: 10,  pricePerUnit: 7.20 },
  { id: 13, name: 'Crème fraîche',           category: 'Produits laitiers',  quantity: 8,   unit: 'L',     minThreshold: 10,  pricePerUnit: 3.50 },
  { id: 14, name: 'Fromage râpé',            category: 'Produits laitiers',  quantity: 22,  unit: 'kg',    minThreshold: 15,  pricePerUnit: 8.90 },
  { id: 15, name: 'Yaourts nature',          category: 'Produits laitiers',  quantity: 60,  unit: 'pots',  minThreshold: 24,  pricePerUnit: 0.45 },
  // Viandes & Poissons
  { id: 16, name: 'Poulet (escalopes)',      category: 'Viandes & Poissons', quantity: 30,  unit: 'kg',    minThreshold: 20,  pricePerUnit: 9.50 },
  { id: 17, name: 'Bœuf haché 5%MG',        category: 'Viandes & Poissons', quantity: 25,  unit: 'kg',    minThreshold: 15,  pricePerUnit: 12.00 },
  { id: 18, name: 'Saumon (pavés)',          category: 'Viandes & Poissons', quantity: 10,  unit: 'kg',    minThreshold: 8,   pricePerUnit: 18.00 },
  { id: 19, name: 'Thon en boîte',           category: 'Viandes & Poissons', quantity: 36,  unit: 'boîtes',minThreshold: 24,  pricePerUnit: 2.40 },
  // Fruits & Légumes
  { id: 20, name: 'Carottes',               category: 'Fruits & Légumes',   quantity: 50,  unit: 'kg',    minThreshold: 20,  pricePerUnit: 0.80 },
  { id: 21, name: 'Pommes de terre',        category: 'Fruits & Légumes',   quantity: 100, unit: 'kg',    minThreshold: 40,  pricePerUnit: 0.70 },
  { id: 22, name: 'Courgettes',             category: 'Fruits & Légumes',   quantity: 6,   unit: 'kg',    minThreshold: 15,  pricePerUnit: 1.20 },
  { id: 23, name: 'Pommes Gala',            category: 'Fruits & Légumes',   quantity: 40,  unit: 'kg',    minThreshold: 20,  pricePerUnit: 1.80 },
  // Hygiène
  { id: 24, name: 'Savon liquide mains',    category: 'Hygiène',            quantity: 20,  unit: 'L',     minThreshold: 10,  pricePerUnit: 3.20 },
  { id: 25, name: 'Papier absorbant',       category: 'Hygiène',            quantity: 5,   unit: 'rouleaux',minThreshold:12, pricePerUnit: 4.50 },
  { id: 26, name: 'Gel hydroalcoolique',    category: 'Hygiène',            quantity: 8,   unit: 'L',     minThreshold: 5,   pricePerUnit: 6.00 },
  // Matériel
  { id: 27, name: 'Gants jetables (boîte)', category: 'Matériel',           quantity: 10,  unit: 'boîtes',minThreshold: 5,   pricePerUnit: 8.00 },
  { id: 28, name: 'Film alimentaire',       category: 'Matériel',           quantity: 3,   unit: 'rouleaux',minThreshold: 4, pricePerUnit: 5.50 },
  { id: 29, name: 'Sacs poubelle 100L',     category: 'Matériel',           quantity: 60,  unit: 'sacs',  minThreshold: 20,  pricePerUnit: 0.25 },
  { id: 30, name: 'Barquettes alu',         category: 'Matériel',           quantity: 200, unit: 'unités',minThreshold: 50,  pricePerUnit: 0.15 },
]

// Generate movement history (30 movements over the past 14 days)
const today = new Date()
const daysAgo = (n) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const initialMovements = [
  { id: 1,  productId: 1,  productName: 'Farine de blé T55',      type: 'Entrée',  quantity: 50,  date: daysAgo(13), comment: 'Livraison fournisseur Moulin du Nord' },
  { id: 2,  productId: 5,  productName: 'Pâtes fusilli',           type: 'Sortie',  quantity: 20,  date: daysAgo(13), comment: 'Repas lundi — 180 couverts' },
  { id: 3,  productId: 11, productName: 'Lait demi-écrémé',        type: 'Entrée',  quantity: 40,  date: daysAgo(12), comment: 'Livraison hebdomadaire' },
  { id: 4,  productId: 16, productName: 'Poulet (escalopes)',      type: 'Entrée',  quantity: 15,  date: daysAgo(12), comment: 'Commande urgente' },
  { id: 5,  productId: 6,  productName: 'Riz long grain',          type: 'Sortie',  quantity: 25,  date: daysAgo(11), comment: 'Préparation riz cantonais' },
  { id: 6,  productId: 21, productName: 'Pommes de terre',        type: 'Sortie',  quantity: 30,  date: daysAgo(11), comment: 'Purée — repas mercredi' },
  { id: 7,  productId: 2,  productName: 'Sucre en poudre',         type: 'Sortie',  quantity: 10,  date: daysAgo(10), comment: 'Desserts semaine 48' },
  { id: 8,  productId: 7,  productName: 'Tomates pelées en boîte', type: 'Sortie',  quantity: 12,  date: daysAgo(10), comment: 'Sauce tomate bolognaise' },
  { id: 9,  productId: 17, productName: 'Bœuf haché 5%MG',        type: 'Entrée',  quantity: 20,  date: daysAgo(9),  comment: 'Livraison boucherie Dupont' },
  { id: 10, productId: 4,  productName: 'Huile d\'olive vierge',   type: 'Sortie',  quantity: 4,   date: daysAgo(9),  comment: 'Cuisson semaine' },
  { id: 11, productId: 20, productName: 'Carottes',               type: 'Entrée',  quantity: 30,  date: daysAgo(8),  comment: 'Marché local' },
  { id: 12, productId: 23, productName: 'Pommes Gala',            type: 'Entrée',  quantity: 25,  date: daysAgo(8),  comment: 'Fruits de saison' },
  { id: 13, productId: 15, productName: 'Yaourts nature',          type: 'Sortie',  quantity: 30,  date: daysAgo(7),  comment: 'Desserts lundi mardi' },
  { id: 14, productId: 24, productName: 'Savon liquide mains',    type: 'Entrée',  quantity: 10,  date: daysAgo(7),  comment: 'Stock hygiène mensuel' },
  { id: 15, productId: 8,  productName: 'Lentilles vertes',        type: 'Sortie',  quantity: 15,  date: daysAgo(6),  comment: 'Plat végétarien jeudi' },
  { id: 16, productId: 5,  productName: 'Pâtes fusilli',           type: 'Sortie',  quantity: 25,  date: daysAgo(6),  comment: 'Pâtes bolognaise vendredi' },
  { id: 17, productId: 14, productName: 'Fromage râpé',            type: 'Sortie',  quantity: 5,   date: daysAgo(5),  comment: 'Gratins semaine' },
  { id: 18, productId: 29, productName: 'Sacs poubelle 100L',     type: 'Entrée',  quantity: 40,  date: daysAgo(5),  comment: 'Réappro matériel' },
  { id: 19, productId: 3,  productName: 'Sel fin',                 type: 'Sortie',  quantity: 5,   date: daysAgo(4),  comment: 'Usage cuisine quotidien' },
  { id: 20, productId: 19, productName: 'Thon en boîte',           type: 'Sortie',  quantity: 12,  date: daysAgo(4),  comment: 'Salades composées' },
  { id: 21, productId: 1,  productName: 'Farine de blé T55',      type: 'Sortie',  quantity: 15,  date: daysAgo(3),  comment: 'Pâtisserie mercredi' },
  { id: 22, productId: 12, productName: 'Beurre doux',             type: 'Sortie',  quantity: 3,   date: daysAgo(3),  comment: 'Pâtisserie et sauces' },
  { id: 23, productId: 22, productName: 'Courgettes',             type: 'Entrée',  quantity: 8,   date: daysAgo(2),  comment: 'Légumes frais livraison' },
  { id: 24, productId: 16, productName: 'Poulet (escalopes)',      type: 'Sortie',  quantity: 12,  date: daysAgo(2),  comment: 'Poulet rôti mardi' },
  { id: 25, productId: 6,  productName: 'Riz long grain',          type: 'Sortie',  quantity: 20,  date: daysAgo(1),  comment: 'Accompagnement quotidien' },
  { id: 26, productId: 11, productName: 'Lait demi-écrémé',        type: 'Sortie',  quantity: 15,  date: daysAgo(1),  comment: 'Desserts lacés' },
  { id: 27, productId: 27, productName: 'Gants jetables (boîte)', type: 'Sortie',  quantity: 2,   date: daysAgo(1),  comment: 'Cuisine du jour' },
  { id: 28, productId: 21, productName: 'Pommes de terre',        type: 'Entrée',  quantity: 50,  date: daysAgo(0),  comment: 'Livraison hebdomadaire' },
  { id: 29, productId: 18, productName: 'Saumon (pavés)',          type: 'Sortie',  quantity: 4,   date: daysAgo(0),  comment: 'Poisson vendredi' },
  { id: 30, productId: 13, productName: 'Crème fraîche',           type: 'Sortie',  quantity: 3,   date: daysAgo(0),  comment: 'Sauce crème du jour' },
]

export const getNextProductId = () => ++nextProductId
export const getNextMovementId = () => ++nextMovementId
