from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, desc, asc, text
from typing import Optional, List
from app.database import get_db
from app.schemas import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
    PaginatedResponse, ProductFilter, ImageUploadResponse
)
from app.models import Product, ProductImage, User, UserRole, ProductStatus, Category
from app.auth import get_current_user, get_current_seller, get_optional_user
from app.services.storage import storage_service
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/dashboard", response_model=PaginatedResponse)
async def get_dashboard_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get ALL products for dashboard (seller only)"""
    try:
        # Get ALL products for dashboard - no status filter
        # Use text query to avoid enum validation issues
        from sqlalchemy import text
        
        query = db.query(Product).options(
            joinedload(Product.images),
            joinedload(Product.seller)
        )
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * limit
        products = query.order_by(desc(Product.created_at)).offset(offset).limit(limit).all()
        
        # Transform to list response format
        items = []
        for product in products:
            primary_image = None
            for img in product.images:
                if img.is_primary:
                    primary_image = img.image_url
                    break
            if not primary_image and product.images:
                primary_image = product.images[0].image_url
            
            items.append(ProductListResponse(
                id=product.id,
                seller_id=product.seller_id,
                name=product.name,
                category=product.category.value if product.category else "silk_saree",
                price=product.price,
                discounted_price=product.discounted_price,
                stock_quantity=product.stock_quantity,
                status=product.status.value if product.status else "active",
                primary_image=primary_image,
                seller_name=f"{product.seller.first_name} {product.seller.last_name}" if product.seller else "Asha Store",
                created_at=product.created_at
            ))
        
        pages = (total + limit - 1) // limit
        
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
        logger.error(f"Error fetching dashboard products: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching products"
        )

@router.get("/", response_model=PaginatedResponse)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,  # Changed from Category enum to str
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    seller_id: Optional[int] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(name|price|created_at)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    in_stock: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get paginated list of products with filters"""
    try:
        # Build base query with ORM
        query = db.query(Product).options(
            joinedload(Product.images),
            joinedload(Product.seller)
        )
        
        # Filter only active products
        from sqlalchemy import text
        query = query.filter(text("status = 'active'"))
        
        # Apply filters
        if category:
            query = query.filter(text(f"category = '{category}'"))
        
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        if seller_id:
            query = query.filter(Product.seller_id == seller_id)
        
        if brand:
            query = query.filter(Product.brand.ilike(f"%{brand}%"))
        
        if in_stock:
            query = query.filter(Product.stock_quantity > 0)
        
        if search:
            search_filter = or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
                Product.brand.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        # Apply sorting
        sort_column = getattr(Product, sort_by)
        if sort_order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * limit
        products = query.offset(offset).limit(limit).all()
        
        # Transform to list response format
        items = []
        for product in products:
            primary_image = None
            for img in product.images:
                if img.is_primary:
                    primary_image = img.image_url
                    break
            if not primary_image and product.images:
                primary_image = product.images[0].image_url
            
            items.append(ProductListResponse(
                id=product.id,
                seller_id=product.seller_id,
                name=product.name,
                category=product.category.value if product.category else "silk_saree",
                price=product.price,
                discounted_price=product.discounted_price,
                stock_quantity=product.stock_quantity,
                status=product.status.value if product.status else "active",
                primary_image=primary_image,
                seller_name=f"{product.seller.first_name} {product.seller.last_name}" if product.seller else "Asha Store",
                created_at=product.created_at
            ))
        
        pages = (total + limit - 1) // limit
        
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching products"
        )

# IMPORTANT: Specific routes must come BEFORE generic /{product_id} route
@router.get("/categories/", response_model=List[str])
async def get_categories():
    """Get all available product categories"""
    return [category.value for category in Category]

@router.get("/seller", response_model=PaginatedResponse)
async def get_current_seller_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get products for currently logged-in seller"""
    try:
        # Use current seller's ID from JWT token
        query = db.query(Product).options(
            joinedload(Product.images),
            joinedload(Product.seller)
        ).filter(Product.seller_id == current_seller.id)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * limit
        products = query.order_by(desc(Product.created_at)).offset(offset).limit(limit).all()
        
        # Transform to list response format
        items = []
        for product in products:
            primary_image = None
            for img in product.images:
                if img.is_primary:
                    primary_image = img.image_url
                    break
            if not primary_image and product.images:
                primary_image = product.images[0].image_url
            
            items.append(ProductListResponse(
                id=product.id,
                seller_id=product.seller_id,
                name=product.name,
                category=product.category.value if product.category else "silk_saree",
                price=product.price,
                discounted_price=product.discounted_price,
                stock_quantity=product.stock_quantity,
                status=product.status.value if product.status else "active",
                primary_image=primary_image,
                seller_name=f"{product.seller.first_name} {product.seller.last_name}" if product.seller else "Asha Store",
                created_at=product.created_at
            ))
        
        pages = (total + limit - 1) // limit
        
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
        logger.error(f"Error fetching current seller products: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching products: {str(e)}"
        )

@router.get("/seller/{seller_id}", response_model=PaginatedResponse)
async def get_seller_products(
    seller_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[ProductStatus] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get products by seller ID"""
    try:
        # Build base query
        query = db.query(Product).options(
            joinedload(Product.images),
            joinedload(Product.seller)
        ).filter(Product.seller_id == seller_id)
        
        # Apply status filter if provided
        if status_filter:
            query = query.filter(Product.status == status_filter)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * limit
        products = query.order_by(desc(Product.created_at)).offset(offset).limit(limit).all()
        
        # Transform to list response format
        items = []
        for product in products:
            primary_image = None
            for img in product.images:
                if img.is_primary:
                    primary_image = img.image_url
                    break
            if not primary_image and product.images:
                primary_image = product.images[0].image_url
            
            items.append(ProductListResponse(
                id=product.id,
                seller_id=product.seller_id,
                name=product.name,
                category=product.category.value if product.category else "silk_saree",
                price=product.price,
                discounted_price=product.discounted_price,
                stock_quantity=product.stock_quantity,
                status=product.status.value if product.status else "active",
                primary_image=primary_image,
                seller_name=f"{product.seller.first_name} {product.seller.last_name}" if product.seller else "Asha Store",
                created_at=product.created_at
            ))
        
        pages = (total + limit - 1) // limit
        
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
        logger.error(f"Error fetching seller products: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching seller products"
        )

@router.get("/{product_id}")
async def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get product by ID using raw SQL to avoid enum issues"""
    try:
        # Use raw SQL to avoid enum validation
        product_query = text("""
            SELECT 
                p.id, p.seller_id, p.name, p.description, p.category,
                p.price, p.discounted_price, p.stock_quantity, p.sku,
                p.status, p.weight, p.dimensions, p.brand, p.tags,
                p.meta_title, p.meta_description, p.created_at, p.updated_at,
                u.first_name, u.last_name, u.email
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
            "first_name": product[18] or "Asha",
            "last_name": product[19] or "Dhaundiyal",
            "email": product[20] or "asha@ashastore.com",
            "role": "seller"
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
            "created_at": str(product[16]) if product[16] else None,
            "updated_at": str(product[17]) if product[17] else None,
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

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Create a new product (sellers only)"""
    try:
        # Generate unique SKU if not provided or duplicate
        if not product_data.sku or db.query(Product).filter(Product.sku == product_data.sku).first():
            product_data.sku = f"SKU-{uuid.uuid4().hex[:8].upper()}"
        
        # Create product
        db_product = Product(
            seller_id=current_seller.id,
            **product_data.dict(exclude={"images"})
        )
        
        db.add(db_product)
        db.flush()  # Get the product ID
        
        # Add images
        for idx, image_data in enumerate(product_data.images or []):
            db_image = ProductImage(
                product_id=db_product.id,
                **image_data.dict()
            )
            if idx == 0:  # First image is primary by default
                db_image.is_primary = True
            db.add(db_image)
        
        db.commit()
        db.refresh(db_product)
        
        logger.info(f"Product created successfully: {db_product.id} by seller {current_seller.id}")
        return db_product
        
    except Exception as e:
        logger.error(f"Product creation failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Product creation failed"
        )

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update product (seller or admin only)"""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Single owner system - Asha can update any product
        # No permission check needed since there's only one owner
        logger.info(f"Updating product {product_id} by owner {current_seller.email}")
        logger.info(f"Update data: {product_data.dict(exclude_unset=True)}")
        
        # Update product fields
        update_data = product_data.dict(exclude_unset=True)
        logger.info(f"Update data dict: {update_data}")
        
        for field, value in update_data.items():
            # Allow None for discounted_price to remove sale
            if field == 'discounted_price' or value is not None:
                logger.info(f"Setting field: {field}, value: {value}, type: {type(value)}")
                # The value from Pydantic should already be the correct type
                # Just set it directly
                setattr(product, field, value)
                logger.info(f"Successfully set {field}")
        
        db.commit()
        db.refresh(product)
        
        logger.info(f"Product updated successfully: {product_id}")
        return product
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f"Product update failed: {e}")
        logger.error(f"Error details: {error_details}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Product update failed: {str(e)}"
        )

@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Delete product (soft delete - mark as deleted)"""
    try:
        # Check if product exists using raw SQL to avoid enum validation issues
        from sqlalchemy import text
        result = db.execute(text("SELECT id FROM products WHERE id = :id"), {"id": product_id}).first()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Single owner system - Asha can delete any product
        # No permission check needed since there's only one owner
        logger.info(f"Deleting product {product_id} by owner {current_seller.email}")
        
        # Soft delete using raw SQL to avoid enum validation issues
        db.execute(
            text("UPDATE products SET status = 'deleted' WHERE id = :id"),
            {"id": product_id}
        )
        db.commit()
        
        logger.info(f"Product deleted successfully: {product_id}")
        return {"message": "Product deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Product deletion failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Product deletion failed"
        )

@router.post("/{product_id}/images", response_model=List[ImageUploadResponse])
async def upload_product_images(
    product_id: int,
    files: List[UploadFile] = File(...),
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Upload images for a product"""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Check permissions
        if current_seller.role != UserRole.ADMIN and product.seller_id != current_seller.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to upload images for this product"
            )
        
        # Upload images
        uploaded_images = []
        for file in files:
            # Upload to Cloudinary
            image_result = storage_service.upload_image(file, f"products/{product_id}")
            
            # Save to database
            db_image = ProductImage(
                product_id=product_id,
                image_url=image_result["url"],
                alt_text=product.name,
                is_primary=len(product.images) == 0  # First image is primary
            )
            db.add(db_image)
            
            uploaded_images.append(ImageUploadResponse(**image_result))
        
        db.commit()
        
        logger.info(f"Images uploaded for product {product_id}: {len(uploaded_images)} images")
        return uploaded_images
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Image upload failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image upload failed"
        )

@router.get("/{product_id}/images")
async def get_product_images(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Get all images for a product"""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        images = db.query(ProductImage).filter(ProductImage.product_id == product_id).all()
        
        return [
            {
                "id": img.id,
                "image_url": img.image_url,
                "alt_text": img.alt_text,
                "is_primary": img.is_primary
            }
            for img in images
        ]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting product images: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get product images"
        )

@router.delete("/{product_id}/images/{image_id}")
async def delete_product_image(
    product_id: int,
    image_id: int,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Delete a product image"""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Check permissions
        if current_seller.role != UserRole.ADMIN and product.seller_id != current_seller.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete images for this product"
            )
        
        image = db.query(ProductImage).filter(
            and_(ProductImage.id == image_id, ProductImage.product_id == product_id)
        ).first()
        
        if not image:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found"
            )
        
        # Delete from Cloudinary (extract public_id from URL)
        public_id = image.image_url.split('/')[-1].split('.')[0]
        storage_service.delete_image(f"products/{product_id}/{public_id}")
        
        # Delete from database
        db.delete(image)
        db.commit()
        
        logger.info(f"Image deleted for product {product_id}: {image_id}")
        return {"message": "Image deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Image deletion failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image deletion failed"
        )
