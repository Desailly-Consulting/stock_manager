import re
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import settings

# psycopg2 ne comprend pas ?pgbouncer=true (paramètre Supabase) — on le retire
_db_url = re.sub(r"[?&]pgbouncer=true", "", settings.database_url)

engine = create_engine(
    _db_url,
    pool_pre_ping=True,   # vérifie la connexion avant chaque utilisation
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
