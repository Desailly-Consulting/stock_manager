from datetime import date
from decimal import Decimal
from typing import Optional
from sqlalchemy import func, cast, Numeric
from sqlalchemy.orm import Session

from . import models, schemas


# ─── Products ────────────────────────────────────────────────────────────────

def get_products(db: Session, category: Optional[str] = None) -> list[models.Product]:
    q = db.query(models.Product)
    if category:
        q = q.filter(models.Product.category == category)
    return q.order_by(models.Product.name).all()


def get_product(db: Session, product_id: int) -> Optional[models.Product]:
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def create_product(db: Session, data: schemas.ProductCreate) -> models.Product:
    product = models.Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: int, data: schemas.ProductUpdate) -> Optional[models.Product]:
    product = get_product(db, product_id)
    if not product:
        return None
    for field, value in data.model_dump().items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> bool:
    product = get_product(db, product_id)
    if not product:
        return False
    db.delete(product)
    db.commit()
    return True


def get_alert_products(db: Session) -> list[models.Product]:
    return (
        db.query(models.Product)
        .filter(models.Product.quantity < models.Product.min_threshold)
        .order_by(
            (models.Product.quantity / func.nullif(models.Product.min_threshold, 0))
        )
        .all()
    )


# ─── Movements ────────────────────────────────────────────────────────────────

def get_movements(
    db: Session,
    product_id: Optional[int] = None,
    type: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    limit: Optional[int] = None,
) -> list[models.Movement]:
    q = db.query(models.Movement).join(models.Product)
    if product_id:
        q = q.filter(models.Movement.product_id == product_id)
    if type:
        q = q.filter(models.Movement.type == type)
    if date_from:
        q = q.filter(models.Movement.date >= date_from)
    if date_to:
        q = q.filter(models.Movement.date <= date_to)
    q = q.order_by(models.Movement.date.desc(), models.Movement.id.desc())
    if limit:
        q = q.limit(limit)
    return q.all()


def create_movement(db: Session, data: schemas.MovementCreate) -> Optional[models.Movement]:
    product = get_product(db, data.product_id)
    if not product:
        return None

    # Update stock quantity
    delta = data.quantity if data.type == "Entrée" else -data.quantity
    new_qty = max(Decimal("0"), Decimal(str(product.quantity)) + delta)
    product.quantity = new_qty

    movement = models.Movement(**data.model_dump())
    db.add(movement)
    db.commit()
    db.refresh(movement)
    return movement


# ─── Dashboard ────────────────────────────────────────────────────────────────

def get_dashboard_stats(db: Session) -> schemas.DashboardStats:
    total_products = db.query(func.count(models.Product.id)).scalar()

    low_stock_count = (
        db.query(func.count(models.Product.id))
        .filter(models.Product.quantity < models.Product.min_threshold)
        .scalar()
    )

    today = date.today()
    today_movements = (
        db.query(func.count(models.Movement.id))
        .filter(models.Movement.date == today)
        .scalar()
    )

    total_value = (
        db.query(
            func.sum(
                cast(models.Product.quantity, Numeric) *
                cast(models.Product.price_per_unit, Numeric)
            )
        ).scalar()
        or Decimal("0")
    )

    return schemas.DashboardStats(
        total_products=total_products or 0,
        low_stock_count=low_stock_count or 0,
        today_movements=today_movements or 0,
        total_stock_value=Decimal(str(total_value)),
    )
