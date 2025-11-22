from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, List
from app.database import get_db
from app.schemas import ProductListResponse, PaginatedResponse
from app.models import User
from app.auth import get_optional_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products-fixed", tags=["Products Fixed"])

@router.get("/", response_model=PaginatedResponse)
async def get_products_fixed(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get products using raw SQL to avoid enum issues"""
    try:
        # Build SQL query
        base_query = """
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
            WHERE p.status = 'active'
        """
        
        if category:
            base_query += f" AND p.category = '{category}'"
        
        base_query += " ORDER BY p.created_at DESC"
        
        # Get total count
        count_query = """
            SELECT COUNT(*) FROM products p
            WHERE p.status = 'active'
        """
        if category:
            count_query += f" AND p.category = '{category}'"
        
        total = db.execute(text(count_query)).scalar()
        
        # Apply pagination
        offset = (page - 1) * limit
        paginated_query = base_query + f" LIMIT {limit} OFFSET {offset}"
        
        # Execute query
        result = db.execute(text(paginated_query))
        products = result.fetchall()
        
        # Get images for products
        product_ids = [p[0] for p in products]
        images_result = []
        if product_ids:
            # Build query with actual values for SQLite compatibility
            ids_str = ','.join(str(pid) for pid in product_ids)
            images_query = f"""
                SELECT product_id, image_url, is_primary 
                FROM product_images 
                WHERE product_id IN ({ids_str})
            """
            images_result = db.execute(text(images_query)).fetchall()
        
        # Create image map
        image_map = {}
        for img in images_result:
            if img[0] not in image_map:
                image_map[img[0]] = []
            image_map[img[0]].append({"url": img[1], "is_primary": img[2]})
        
        # Transform to response format
        items = []
        for p in products:
            # Find primary image
            primary_image = None
            if p[0] in image_map:
                for img in image_map[p[0]]:
                    if img["is_primary"]:
                        primary_image = img["url"]
                        break
                if not primary_image and image_map[p[0]]:
                    primary_image = image_map[p[0]][0]["url"]
            
            items.append(ProductListResponse(
                id=p[0],
                seller_id=p[1],
                name=p[2],
                category=p[4] or "silk_saree",
                price=float(p[5]) if p[5] else 0,
                discounted_price=float(p[6]) if p[6] else None,
                stock_quantity=p[7] or 0,
                status=p[8] or "active",
                primary_image=primary_image,
                seller_name=f"{p[10]} {p[11]}" if p[10] and p[11] else "Asha Store",
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
        logger.error(f"Error fetching products: {e}")
        # Return empty result instead of error
        return PaginatedResponse(
            items=[],
            total=0,
            page=1,
            limit=limit,
            pages=1,
            has_next=False,
            has_prev=False
        )
