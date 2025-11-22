#!/usr/bin/env python3
"""
Initialize the database with tables
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, create_tables
from app.models import Base
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database():
    """Initialize the database"""
    try:
        logger.info("Creating database tables...")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        logger.info("✅ Database initialized successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error initializing database: {e}")
        return False

if __name__ == "__main__":
    success = init_database()
    if success:
        print("\n🎊 Database is ready!")
        print("🚀 Now you can start the backend server with: python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    else:
        print("\n❌ Database initialization failed!")
        sys.exit(1)
