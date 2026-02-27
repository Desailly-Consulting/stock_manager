from datetime import date, datetime
from decimal import Decimal
from sqlalchemy import (
    Column, Integer, String, Numeric, Date, Text,
    ForeignKey, DateTime, CheckConstraint, func,
)
from sqlalchemy.orm import relationship
from .database import Base


class Product(Base):
    __tablename__ = "products"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(255), nullable=False)
    category      = Column(String(100), nullable=False)
    quantity      = Column(Numeric(10, 2), nullable=False, default=0)
    unit          = Column(String(50), nullable=False)
    min_threshold = Column(Numeric(10, 2), nullable=False, default=0)
    price_per_unit= Column(Numeric(10, 2), nullable=False, default=0)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    movements = relationship("Movement", back_populates="product", cascade="all, delete-orphan")


class Movement(Base):
    __tablename__ = "movements"
    __table_args__ = (
        CheckConstraint("type IN ('Entrée', 'Sortie')", name="movement_type_check"),
    )

    id         = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    type       = Column(String(10), nullable=False)
    quantity   = Column(Numeric(10, 2), nullable=False)
    date       = Column(Date, nullable=False)
    comment    = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="movements")
