"""
Injecte les données de démonstration en base.
Utilisation : python seed.py
"""
import sys
import os
from datetime import date, timedelta
from decimal import Decimal

# Charger les variables d'env depuis .env
from dotenv import load_dotenv
load_dotenv()

from app.database import SessionLocal, engine, Base
from app import models

Base.metadata.create_all(bind=engine)


def days_ago(n: int) -> date:
    return date.today() - timedelta(days=n)


PRODUCTS = [
    # Épicerie
    dict(name="Farine de blé T55",      category="Épicerie",           quantity=120, unit="kg",      min_threshold=50,  price_per_unit=0.85),
    dict(name="Sucre en poudre",         category="Épicerie",           quantity=80,  unit="kg",      min_threshold=30,  price_per_unit=0.95),
    dict(name="Sel fin",                 category="Épicerie",           quantity=40,  unit="kg",      min_threshold=20,  price_per_unit=0.40),
    dict(name="Huile d'olive vierge",    category="Épicerie",           quantity=18,  unit="L",       min_threshold=20,  price_per_unit=4.50),
    dict(name="Pâtes fusilli",           category="Épicerie",           quantity=200, unit="kg",      min_threshold=60,  price_per_unit=1.20),
    dict(name="Riz long grain",          category="Épicerie",           quantity=150, unit="kg",      min_threshold=50,  price_per_unit=1.10),
    dict(name="Tomates pelées en boîte", category="Épicerie",           quantity=48,  unit="boîtes",  min_threshold=30,  price_per_unit=1.30),
    dict(name="Lentilles vertes",        category="Épicerie",           quantity=60,  unit="kg",      min_threshold=25,  price_per_unit=1.60),
    dict(name="Haricots blancs",         category="Épicerie",           quantity=45,  unit="kg",      min_threshold=20,  price_per_unit=1.50),
    dict(name="Semoule fine",            category="Épicerie",           quantity=12,  unit="kg",      min_threshold=30,  price_per_unit=0.90),
    # Produits laitiers
    dict(name="Lait demi-écrémé",        category="Produits laitiers",  quantity=90,  unit="L",       min_threshold=40,  price_per_unit=1.05),
    dict(name="Beurre doux",             category="Produits laitiers",  quantity=15,  unit="kg",      min_threshold=10,  price_per_unit=7.20),
    dict(name="Crème fraîche",           category="Produits laitiers",  quantity=8,   unit="L",       min_threshold=10,  price_per_unit=3.50),
    dict(name="Fromage râpé",            category="Produits laitiers",  quantity=22,  unit="kg",      min_threshold=15,  price_per_unit=8.90),
    dict(name="Yaourts nature",          category="Produits laitiers",  quantity=60,  unit="pots",    min_threshold=24,  price_per_unit=0.45),
    # Viandes & Poissons
    dict(name="Poulet (escalopes)",      category="Viandes & Poissons", quantity=30,  unit="kg",      min_threshold=20,  price_per_unit=9.50),
    dict(name="Bœuf haché 5%MG",         category="Viandes & Poissons", quantity=25,  unit="kg",      min_threshold=15,  price_per_unit=12.00),
    dict(name="Saumon (pavés)",          category="Viandes & Poissons", quantity=10,  unit="kg",      min_threshold=8,   price_per_unit=18.00),
    dict(name="Thon en boîte",           category="Viandes & Poissons", quantity=36,  unit="boîtes",  min_threshold=24,  price_per_unit=2.40),
    # Fruits & Légumes
    dict(name="Carottes",                category="Fruits & Légumes",   quantity=50,  unit="kg",      min_threshold=20,  price_per_unit=0.80),
    dict(name="Pommes de terre",         category="Fruits & Légumes",   quantity=100, unit="kg",      min_threshold=40,  price_per_unit=0.70),
    dict(name="Courgettes",              category="Fruits & Légumes",   quantity=6,   unit="kg",      min_threshold=15,  price_per_unit=1.20),
    dict(name="Pommes Gala",             category="Fruits & Légumes",   quantity=40,  unit="kg",      min_threshold=20,  price_per_unit=1.80),
    # Hygiène
    dict(name="Savon liquide mains",     category="Hygiène",            quantity=20,  unit="L",       min_threshold=10,  price_per_unit=3.20),
    dict(name="Papier absorbant",        category="Hygiène",            quantity=5,   unit="rouleaux",min_threshold=12,  price_per_unit=4.50),
    dict(name="Gel hydroalcoolique",     category="Hygiène",            quantity=8,   unit="L",       min_threshold=5,   price_per_unit=6.00),
    # Matériel
    dict(name="Gants jetables (boîte)",  category="Matériel",           quantity=10,  unit="boîtes",  min_threshold=5,   price_per_unit=8.00),
    dict(name="Film alimentaire",        category="Matériel",           quantity=3,   unit="rouleaux",min_threshold=4,   price_per_unit=5.50),
    dict(name="Sacs poubelle 100L",      category="Matériel",           quantity=60,  unit="sacs",    min_threshold=20,  price_per_unit=0.25),
    dict(name="Barquettes alu",          category="Matériel",           quantity=200, unit="unités",  min_threshold=50,  price_per_unit=0.15),
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(models.Product).count()
        if existing > 0:
            print(f"Base déjà peuplée ({existing} produits). Seed ignoré.")
            print("Pour réinitialiser : python seed.py --reset")
            return

        print("Insertion des produits…")
        products = []
        for p in PRODUCTS:
            obj = models.Product(**{k: Decimal(str(v)) if isinstance(v, (int, float)) and k in ('quantity', 'min_threshold', 'price_per_unit') else v for k, v in p.items()})
            db.add(obj)
            products.append(obj)
        db.flush()  # obtenir les IDs

        # Indexer par nom pour les mouvements
        by_name = {p.name: p for p in products}

        print("Insertion des mouvements…")
        MOVEMENTS = [
            dict(product=by_name["Farine de blé T55"],      type="Entrée",  quantity=50,  date=days_ago(13), comment="Livraison fournisseur Moulin du Nord"),
            dict(product=by_name["Pâtes fusilli"],           type="Sortie",  quantity=20,  date=days_ago(13), comment="Repas lundi — 180 couverts"),
            dict(product=by_name["Lait demi-écrémé"],        type="Entrée",  quantity=40,  date=days_ago(12), comment="Livraison hebdomadaire"),
            dict(product=by_name["Poulet (escalopes)"],      type="Entrée",  quantity=15,  date=days_ago(12), comment="Commande urgente"),
            dict(product=by_name["Riz long grain"],          type="Sortie",  quantity=25,  date=days_ago(11), comment="Préparation riz cantonais"),
            dict(product=by_name["Pommes de terre"],         type="Sortie",  quantity=30,  date=days_ago(11), comment="Purée — repas mercredi"),
            dict(product=by_name["Sucre en poudre"],         type="Sortie",  quantity=10,  date=days_ago(10), comment="Desserts semaine 48"),
            dict(product=by_name["Tomates pelées en boîte"], type="Sortie",  quantity=12,  date=days_ago(10), comment="Sauce tomate bolognaise"),
            dict(product=by_name["Bœuf haché 5%MG"],         type="Entrée",  quantity=20,  date=days_ago(9),  comment="Livraison boucherie Dupont"),
            dict(product=by_name["Huile d'olive vierge"],    type="Sortie",  quantity=4,   date=days_ago(9),  comment="Cuisson semaine"),
            dict(product=by_name["Carottes"],                type="Entrée",  quantity=30,  date=days_ago(8),  comment="Marché local"),
            dict(product=by_name["Pommes Gala"],             type="Entrée",  quantity=25,  date=days_ago(8),  comment="Fruits de saison"),
            dict(product=by_name["Yaourts nature"],          type="Sortie",  quantity=30,  date=days_ago(7),  comment="Desserts lundi mardi"),
            dict(product=by_name["Savon liquide mains"],     type="Entrée",  quantity=10,  date=days_ago(7),  comment="Stock hygiène mensuel"),
            dict(product=by_name["Lentilles vertes"],        type="Sortie",  quantity=15,  date=days_ago(6),  comment="Plat végétarien jeudi"),
            dict(product=by_name["Pâtes fusilli"],           type="Sortie",  quantity=25,  date=days_ago(6),  comment="Pâtes bolognaise vendredi"),
            dict(product=by_name["Fromage râpé"],            type="Sortie",  quantity=5,   date=days_ago(5),  comment="Gratins semaine"),
            dict(product=by_name["Sacs poubelle 100L"],      type="Entrée",  quantity=40,  date=days_ago(5),  comment="Réappro matériel"),
            dict(product=by_name["Sel fin"],                 type="Sortie",  quantity=5,   date=days_ago(4),  comment="Usage cuisine quotidien"),
            dict(product=by_name["Thon en boîte"],           type="Sortie",  quantity=12,  date=days_ago(4),  comment="Salades composées"),
            dict(product=by_name["Farine de blé T55"],      type="Sortie",  quantity=15,  date=days_ago(3),  comment="Pâtisserie mercredi"),
            dict(product=by_name["Beurre doux"],             type="Sortie",  quantity=3,   date=days_ago(3),  comment="Pâtisserie et sauces"),
            dict(product=by_name["Courgettes"],              type="Entrée",  quantity=8,   date=days_ago(2),  comment="Légumes frais livraison"),
            dict(product=by_name["Poulet (escalopes)"],      type="Sortie",  quantity=12,  date=days_ago(2),  comment="Poulet rôti mardi"),
            dict(product=by_name["Riz long grain"],          type="Sortie",  quantity=20,  date=days_ago(1),  comment="Accompagnement quotidien"),
            dict(product=by_name["Lait demi-écrémé"],        type="Sortie",  quantity=15,  date=days_ago(1),  comment="Desserts lacés"),
            dict(product=by_name["Gants jetables (boîte)"],  type="Sortie",  quantity=2,   date=days_ago(1),  comment="Cuisine du jour"),
            dict(product=by_name["Pommes de terre"],         type="Entrée",  quantity=50,  date=days_ago(0),  comment="Livraison hebdomadaire"),
            dict(product=by_name["Saumon (pavés)"],          type="Sortie",  quantity=4,   date=days_ago(0),  comment="Poisson vendredi"),
            dict(product=by_name["Crème fraîche"],           type="Sortie",  quantity=3,   date=days_ago(0),  comment="Sauce crème du jour"),
        ]

        for m in MOVEMENTS:
            product = m.pop("product")
            obj = models.Movement(product_id=product.id, quantity=Decimal(str(m["quantity"])), **{k: v for k, v in m.items() if k != "quantity"})
            db.add(obj)

        db.commit()
        print(f"✓ {len(PRODUCTS)} produits et {len(MOVEMENTS)} mouvements insérés.")

    except Exception as e:
        db.rollback()
        print(f"Erreur : {e}")
        sys.exit(1)
    finally:
        db.close()


def reset():
    db = SessionLocal()
    try:
        db.query(models.Movement).delete()
        db.query(models.Product).delete()
        db.commit()
        print("Base réinitialisée.")
    finally:
        db.close()


if __name__ == "__main__":
    if "--reset" in sys.argv:
        reset()
        seed()
    else:
        seed()
