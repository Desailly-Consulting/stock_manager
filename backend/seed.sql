-- ─── Stock Manager — Seed SQL ────────────────────────────────────────────────
-- Coller dans Supabase > SQL Editor > New query > Run

-- Tables
CREATE TABLE IF NOT EXISTS products (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(255)   NOT NULL,
    category       VARCHAR(100)   NOT NULL,
    quantity       NUMERIC(10,2)  NOT NULL DEFAULT 0,
    unit           VARCHAR(50)    NOT NULL,
    min_threshold  NUMERIC(10,2)  NOT NULL DEFAULT 0,
    price_per_unit NUMERIC(10,2)  NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ    DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movements (
    id         SERIAL PRIMARY KEY,
    product_id INTEGER        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type       VARCHAR(10)    NOT NULL CHECK (type IN ('Entrée', 'Sortie')),
    quantity   NUMERIC(10,2)  NOT NULL,
    date       DATE           NOT NULL,
    comment    TEXT,
    created_at TIMESTAMPTZ    DEFAULT NOW()
);

-- Produits
INSERT INTO products (name, category, quantity, unit, min_threshold, price_per_unit) VALUES
('Farine de blé T55',      'Épicerie',           120, 'kg',       50,  0.85),
('Sucre en poudre',         'Épicerie',            80, 'kg',       30,  0.95),
('Sel fin',                 'Épicerie',            40, 'kg',       20,  0.40),
('Huile d''olive vierge',   'Épicerie',            18, 'L',        20,  4.50),
('Pâtes fusilli',           'Épicerie',           200, 'kg',       60,  1.20),
('Riz long grain',          'Épicerie',           150, 'kg',       50,  1.10),
('Tomates pelées en boîte', 'Épicerie',            48, 'boîtes',   30,  1.30),
('Lentilles vertes',        'Épicerie',            60, 'kg',       25,  1.60),
('Haricots blancs',         'Épicerie',            45, 'kg',       20,  1.50),
('Semoule fine',            'Épicerie',            12, 'kg',       30,  0.90),
('Lait demi-écrémé',        'Produits laitiers',   90, 'L',        40,  1.05),
('Beurre doux',             'Produits laitiers',   15, 'kg',       10,  7.20),
('Crème fraîche',           'Produits laitiers',    8, 'L',        10,  3.50),
('Fromage râpé',            'Produits laitiers',   22, 'kg',       15,  8.90),
('Yaourts nature',          'Produits laitiers',   60, 'pots',     24,  0.45),
('Poulet (escalopes)',      'Viandes & Poissons',  30, 'kg',       20,  9.50),
('Bœuf haché 5%MG',         'Viandes & Poissons',  25, 'kg',       15, 12.00),
('Saumon (pavés)',          'Viandes & Poissons',  10, 'kg',        8, 18.00),
('Thon en boîte',           'Viandes & Poissons',  36, 'boîtes',   24,  2.40),
('Carottes',                'Fruits & Légumes',    50, 'kg',       20,  0.80),
('Pommes de terre',         'Fruits & Légumes',   100, 'kg',       40,  0.70),
('Courgettes',              'Fruits & Légumes',     6, 'kg',       15,  1.20),
('Pommes Gala',             'Fruits & Légumes',    40, 'kg',       20,  1.80),
('Savon liquide mains',     'Hygiène',             20, 'L',        10,  3.20),
('Papier absorbant',        'Hygiène',              5, 'rouleaux', 12,  4.50),
('Gel hydroalcoolique',     'Hygiène',              8, 'L',         5,  6.00),
('Gants jetables (boîte)',  'Matériel',            10, 'boîtes',    5,  8.00),
('Film alimentaire',        'Matériel',             3, 'rouleaux',  4,  5.50),
('Sacs poubelle 100L',      'Matériel',            60, 'sacs',     20,  0.25),
('Barquettes alu',          'Matériel',           200, 'unités',   50,  0.15);

-- Mouvements (les dates sont relatives à aujourd'hui)
INSERT INTO movements (product_id, type, quantity, date, comment) VALUES
(1,  'Entrée', 50, CURRENT_DATE - 13, 'Livraison fournisseur Moulin du Nord'),
(5,  'Sortie', 20, CURRENT_DATE - 13, 'Repas lundi — 180 couverts'),
(11, 'Entrée', 40, CURRENT_DATE - 12, 'Livraison hebdomadaire'),
(16, 'Entrée', 15, CURRENT_DATE - 12, 'Commande urgente'),
(6,  'Sortie', 25, CURRENT_DATE - 11, 'Préparation riz cantonais'),
(21, 'Sortie', 30, CURRENT_DATE - 11, 'Purée — repas mercredi'),
(2,  'Sortie', 10, CURRENT_DATE - 10, 'Desserts semaine 48'),
(7,  'Sortie', 12, CURRENT_DATE - 10, 'Sauce tomate bolognaise'),
(17, 'Entrée', 20, CURRENT_DATE -  9, 'Livraison boucherie Dupont'),
(4,  'Sortie',  4, CURRENT_DATE -  9, 'Cuisson semaine'),
(20, 'Entrée', 30, CURRENT_DATE -  8, 'Marché local'),
(23, 'Entrée', 25, CURRENT_DATE -  8, 'Fruits de saison'),
(15, 'Sortie', 30, CURRENT_DATE -  7, 'Desserts lundi mardi'),
(24, 'Entrée', 10, CURRENT_DATE -  7, 'Stock hygiène mensuel'),
(8,  'Sortie', 15, CURRENT_DATE -  6, 'Plat végétarien jeudi'),
(5,  'Sortie', 25, CURRENT_DATE -  6, 'Pâtes bolognaise vendredi'),
(14, 'Sortie',  5, CURRENT_DATE -  5, 'Gratins semaine'),
(29, 'Entrée', 40, CURRENT_DATE -  5, 'Réappro matériel'),
(3,  'Sortie',  5, CURRENT_DATE -  4, 'Usage cuisine quotidien'),
(19, 'Sortie', 12, CURRENT_DATE -  4, 'Salades composées'),
(1,  'Sortie', 15, CURRENT_DATE -  3, 'Pâtisserie mercredi'),
(12, 'Sortie',  3, CURRENT_DATE -  3, 'Pâtisserie et sauces'),
(22, 'Entrée',  8, CURRENT_DATE -  2, 'Légumes frais livraison'),
(16, 'Sortie', 12, CURRENT_DATE -  2, 'Poulet rôti mardi'),
(6,  'Sortie', 20, CURRENT_DATE -  1, 'Accompagnement quotidien'),
(11, 'Sortie', 15, CURRENT_DATE -  1, 'Desserts lacés'),
(27, 'Sortie',  2, CURRENT_DATE -  1, 'Cuisine du jour'),
(21, 'Entrée', 50, CURRENT_DATE,      'Livraison hebdomadaire'),
(18, 'Sortie',  4, CURRENT_DATE,      'Poisson vendredi'),
(13, 'Sortie',  3, CURRENT_DATE,      'Sauce crème du jour');
