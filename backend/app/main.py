from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import products, movements
from . import crud, schemas
from .database import SessionLocal

# Créer les tables au démarrage si elles n'existent pas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stock Manager API",
    description="API de gestion des stocks — cantines, mairies, bibliothèques",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(movements.router)


@app.get("/api/dashboard", response_model=schemas.DashboardStats, tags=["dashboard"])
def dashboard_stats():
    db = SessionLocal()
    try:
        return crud.get_dashboard_stats(db)
    finally:
        db.close()


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
