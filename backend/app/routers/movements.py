from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/movements", tags=["movements"])


@router.get("", response_model=list[schemas.MovementOut])
def list_movements(
    product_id: Optional[int] = None,
    type:       Optional[str] = None,
    date_from:  Optional[date] = None,
    date_to:    Optional[date] = None,
    limit:      Optional[int] = None,
    db: Session = Depends(get_db),
):
    movements = crud.get_movements(
        db,
        product_id=product_id,
        type=type,
        date_from=date_from,
        date_to=date_to,
        limit=limit,
    )
    # Inject product_name for the response schema
    result = []
    for m in movements:
        out = schemas.MovementOut(
            id=m.id,
            product_id=m.product_id,
            product_name=m.product.name,
            type=m.type,
            quantity=m.quantity,
            date=m.date,
            comment=m.comment,
            created_at=m.created_at,
        )
        result.append(out)
    return result


@router.post("", response_model=schemas.MovementOut, status_code=status.HTTP_201_CREATED)
def create_movement(data: schemas.MovementCreate, db: Session = Depends(get_db)):
    movement = crud.create_movement(db, data)
    if not movement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable")
    return schemas.MovementOut(
        id=movement.id,
        product_id=movement.product_id,
        product_name=movement.product.name,
        type=movement.type,
        quantity=movement.quantity,
        date=movement.date,
        comment=movement.comment,
        created_at=movement.created_at,
    )
