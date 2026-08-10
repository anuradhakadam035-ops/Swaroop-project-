"""
=========================================
AI Career Guidance System
Database Connection
=========================================
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

from config import DATABASE_URL

# ==========================
# Create Database Engine
# ==========================

engine = create_engine(
    DATABASE_URL,
    echo=True,          # Shows SQL queries in terminal
    pool_pre_ping=True  # Checks connection before use
)

# ==========================
# Create Session
# ==========================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ==========================
# Base Class for Models
# ==========================

Base = declarative_base()

# ==========================
# Dependency
# ==========================

def get_db():
    """
    Returns a database session
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()