from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
from app.database import get_db
from app.schemas import PaginatedResponse, ProductListResponse
from app.models import User
from app.auth import get_current_seller
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Products"])

@router.get("/products-dashboard", response_model=PaginatedResponse)
async def get_dashboard_products_raw(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get ALL products for dashboard using raw SQL to avoid enum issues"""
    try:
        # Use raw SQL to avoid enum validation
        offset = (page - 1) * limit
        
        # Get total count (exclude deleted products)
        count_query = text("SELECT COUNT(*) FROM products WHERE status != 'deleted'")
        total = db.execute(count_query).scalar()
        
        # Get products with raw SQL (exclude deleted products)
        products_query = text("""
            SELECT 
                p.id,
                p.seller_id,
                p.name,
                p.description,
                p.category,
                p.price,
                p.discounted_price,
                p.stock_quantity,
                p.status,
                p.created_at,
                u.first_name,
                u.last_name
            FROM products p
            LEFT JOIN users u ON p.seller_id = u.id
            WHERE p.status != 'deleted'
            ORDER BY p.created_at DESC
            LIMIT :limit OFFSET :offset
        """)
        
        result = db.execute(products_query, {"limit": limit, "offset": offset})
        products = result.fetchall()
        
        # Get images for products
        product_ids = [p[0] for p in products]
        images_query = text("""
            SELECT product_id, image_url, is_primary
            FROM product_images
            WHERE product_id IN :product_ids
        """)
        
        images_result = []
        if product_ids:
            images_result = db.execute(
                text("SELECT product_id, image_url, is_primary FROM product_images WHERE product_id IN ({})".format(
                    ','.join(str(id) for id in product_ids)
                ))
            ).fetchall()
        
        # Group images by product
        product_images = {}
        for img in images_result:
            product_id = img[0]
            if product_id not in product_images:
                product_images[product_id] = []
            product_images[product_id].append({"url": img[1], "is_primary": img[2]})
        
        # Transform to response format
        items = []
        for p in products:
            # Find primary image
            primary_image = None
            if p[0] in product_images:
                for img in product_images[p[0]]:
                    if img["is_primary"]:
                        primary_image = img["url"]
                        break
                if not primary_image and product_images[p[0]]:
                    primary_image = product_images[p[0]][0]["url"]
            
            # Build seller name
            seller_name = "Asha Store"
            if p[10] and p[11]:  # first_name and last_name
                seller_name = f"{p[10]} {p[11]}"
            
            items.append(ProductListResponse(
                id=p[0],
                seller_id=p[1] or 1,
                name=p[2],
                category=p[4] or "saree",
                price=float(p[5]) if p[5] else 0,
                discounted_price=float(p[6]) if p[6] else None,
                stock_quantity=p[7] or 0,
                status=p[8] or "active",
                primary_image=primary_image,
                seller_name=seller_name,
                created_at=p[9]
            ))
        
        pages = (total + limit - 1) // limit if limit > 0 else 1
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            has_next=page < pages,
            has_prev=page > 1
        )
        
    except Exception as e:
        logger.error(f"Error fetching dashboard products (raw): {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching products: {str(e)}"
        )
