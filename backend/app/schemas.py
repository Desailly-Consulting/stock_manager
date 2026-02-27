from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict


# ─── Products ────────────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name:          str
    category:      str
    quantity:      Decimal
    unit:          str
    min_threshold: Decimal
    price_per_unit: Decimal


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id:         int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ─── Movements ────────────────────────────────────────────────────────────────

class MovementBase(BaseModel):
    product_id: int
    type:       str        # 'Entrée' | 'Sortie'
    quantity:   Decimal
    date:       date
    comment:    Optional[str] = None


class MovementCreate(MovementBase):
    pass


class MovementOut(MovementBase):
    model_config = ConfigDict(from_attributes=True)

    id:           int
    product_name: str
    created_at:   Optional[datetime] = None


# ─── Dashboard ────────────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_products:    int
    low_stock_count:   int
    today_movements:   int
    total_stock_value: Decimal
