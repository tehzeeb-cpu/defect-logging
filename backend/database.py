import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Primary PostgreSQL configuration
DEFAULT_PG_USER = os.getenv("USER", "postgres")
DEFAULT_PG_URL = os.getenv(
    "DATABASE_URL", 
    f"postgresql+psycopg2://{DEFAULT_PG_USER}@localhost:5432/sobha_quality_db"
)

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_PG_URL)

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        pass
    print(f"-> Connected to PostgreSQL database: {DATABASE_URL.split('@')[-1]}")
except Exception as e:
    print(f"-> PostgreSQL not detected locally ({e}).")
    print("-> Falling back to embedded SQLite database for zero-config interviewer evaluation.")
    DATABASE_URL = "sqlite:///./sobha_quality.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    print(f"-> Connected to SQLite database: {DATABASE_URL}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
