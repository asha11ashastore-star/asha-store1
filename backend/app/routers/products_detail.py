from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.models import User
from app.auth import get_current_seller
from typing import Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Products Detail"])

@router.get("/products/{product_id}")
async def get_product_detail(
    product_id: int,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get product by ID using raw SQL to avoid enum issues"""
    try:
        # Use raw SQL to avoid enum validation
        product_query = text("""
            SELECT 
                p.id,
                p.seller_id,
                p.name,
                p.description,
                p.category,
                p.price,
                p.discounted_price,
                p.stock_quantity,
                p.sku,
                p.status,
                p.weight,
                p.dimensions,
                p.brand,
                p.tags,
                p.meta_title,
                p.meta_description,
                p.created_at,
                p.updated_at,
                u.first_name,
                u.last_name,
                u.email
            FROM products p
            LEFT JOIN users u ON p.seller_id = u.id
            WHERE p.id = :product_id
        """)
        
        result = db.execute(product_query, {"product_id": product_id})
        product = result.fetchone()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Get images
        images_query = text("""
            SELECT id, image_url, alt_text, sort_order, is_primary
            FROM product_images
            WHERE product_id = :product_id
            ORDER BY sort_order
        """)
        
        images_result = db.execute(images_query, {"product_id": product_id})
        images = images_result.fetchall()
        
        # Build images list
        images_list = []
        for img in images:
            images_list.append({
                "id": img[0],
                "image_url": img[1],
                "alt_text": img[2],
                "sort_order": img[3],
                "is_primary": img[4]
            })
        
        # Build seller info
        seller = {
            "id": product[1],
            "first_name": product[18],
            "last_name": product[19],
            "email": product[20]
        }
        
        # Build response
        response = {
            "id": product[0],
            "seller_id": product[1],
            "name": product[2],
            "description": product[3],
            "category": product[4] or "silk_saree",
            "price": float(product[5]) if product[5] else 0,
            "discounted_price": float(product[6]) if product[6] else None,
            "stock_quantity": product[7] or 0,
            "sku": product[8],
            "status": product[9] or "draft",
            "weight": float(product[10]) if product[10] else None,
            "dimensions": product[11],
            "brand": product[12],
            "tags": product[13],
            "meta_title": product[14],
            "meta_description": product[15],
            "created_at": product[16].isoformat() if product[16] else None,
            "updated_at": product[17].isoformat() if product[17] else None,
            "images": images_list,
            "seller": seller
        }
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching product: {str(e)}"
        )
