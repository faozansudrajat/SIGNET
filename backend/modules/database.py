from sqlalchemy import create_engine, Column, Integer, String, Text, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
import os
from dotenv import load_dotenv

load_dotenv()

# Gunakan DATABASE_URL dari .env, default ke postgresql://localhost/signet_db jika tidak ada
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/signet_db")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    ip_id = Column(String, unique=True, index=True)
    phash = Column(String, index=True)
    owner = Column(String, index=True)
    filename = Column(String)
    
    # Store Transaction Hashes
    tx_hash_mint = Column(String, nullable=True)
    tx_hash_register = Column(String, nullable=True)
    
    # Store complex data as JSON
    license_data = Column(JSON, default={})
    
    ipfs_metadata = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
