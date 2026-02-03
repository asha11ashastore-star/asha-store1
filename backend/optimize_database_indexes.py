#!/usr/bin/env python3
"""
Optimize database indexes for faster product queries
Run this script to add indexes that will speed up product loading
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_indexes():
    """Add database indexes for optimized queries"""
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # Add index on products.status for faster filtering
            logger.info("Adding index on products.status...")
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_products_status 
                ON products(status)
            """))
            
            # Add index on products.created_at for faster sorting
            logger.info("Adding index on products.created_at...")
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_products_created_at 
                ON products(created_at DESC)
            """))
            
            # Add composite index for status + created_at (most common query)
            logger.info("Adding composite index on products(status, created_at)...")
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_products_status_created 
                ON products(status, created_at DESC)
            """))
            
            # Add index on product_images.product_id for faster joins
            logger.info("Adding index on product_images.product_id...")
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_product_images_product_id 
                ON product_images(product_id)
            """))
            
            # Add index on product_images.is_primary for faster primary image lookup
            logger.info("Adding index on product_images.is_primary...")
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_product_images_primary 
                ON product_images(product_id, is_primary)
            """))
            
            conn.commit()
            logger.info("✅ All indexes created successfully!")
            logger.info("Product queries should now be much faster.")
            
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    logger.info("Starting database optimization...")
    add_indexes()
    logger.info("Database optimization complete!")
