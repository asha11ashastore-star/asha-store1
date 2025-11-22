from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from perfect_models import *

# User Schemas
class SellerDetails(BaseModel):
    store_name: str
    gst_number: Optional[str] = None
    pan_number: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_name: Optional[str] = None
    ifsc_code: Optional[str] = None

class UserRegister(BaseModel):
    email: EmailStr
    phone: str = Field(..., regex="^[6-9]\d{9}$")
    username: Optional[str] = None
    full_name: str
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.CUSTOMER
    seller_details: Optional[SellerDetails] = None

class UserLogin(BaseModel):
    email_or_phone: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    phone: str
    username: str
    full_name: str
    role: UserRole
    is_active: bool
    is_verified: bool
    profile_image: Optional[str]
    store_name: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Product Schemas
class ProductImageResponse(BaseModel):
    id: int
    image_url: str
    thumbnail_url: Optional[str]
    is_primary: bool
    
    class Config:
        from_attributes = True

class ProductVariantResponse(BaseModel):
    id: int
    size: Optional[str]
    color: Optional[str]
    color_code: Optional[str]
    stock_quantity: int
    mrp: Optional[Decimal]
    selling_price: Optional[Decimal]
    
    class Config:
        from_attributes = True

class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    category: ClothingCategory
    mrp: Decimal
    selling_price: Decimal
    discount_percentage: Optional[Decimal]
    total_stock: int
    fabric: Optional[FabricType]
    pattern: Optional[str]
    occasion: Optional[str]
    brand: Optional[str]
    saree_length: Optional[Decimal]
    blouse_piece: Optional[bool]
    work_type: Optional[str]
    rating: Decimal
    review_count: int
    images: List[ProductImageResponse]
    variants: List[ProductVariantResponse]
    seller: UserResponse
    
    class Config:
        from_attributes = True

class ProductListItem(BaseModel):
    id: int
    name: str
    slug: str
    category: ClothingCategory
    mrp: Decimal
    selling_price: Decimal
    discount_percentage: Optional[Decimal]
    brand: Optional[str]
    rating: Decimal
    primary_image: Optional[str]
    
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    pages: int

class ProductDetailResponse(BaseModel):
    product: ProductResponse
    related_products: List[ProductResponse]

# Cart Schemas
class CartItemCreate(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int = Field(1, gt=0)

class CartItemResponse(BaseModel):
    id: int
    product: ProductResponse
    variant: Optional[ProductVariantResponse]
    quantity: int
    
    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: Decimal
    shipping: Decimal
    total: Decimal
    item_count: int

# Order Schemas
class OrderCreate(BaseModel):
    address_id: int
    payment_method: PaymentMethod
    coupon_code: Optional[str] = None
    notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_name: str
    product_image: Optional[str]
    size: Optional[str]
    color: Optional[str]
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    status: OrderStatus
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_number: str
    subtotal: Decimal
    discount_amount: Decimal
    tax_amount: Decimal
    shipping_charge: Decimal
    total_amount: Decimal
    status: OrderStatus
    payment_status: PaymentStatus
    payment_method: PaymentMethod
    razorpay_order_id: Optional[str]
    created_at: datetime
    order_items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True

# Payment Schemas
class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

# Address Schemas
class AddressCreate(BaseModel):
    name: str
    phone: str = Field(..., regex="^[6-9]\d{9}$")
    address_line_1: str
    address_line_2: Optional[str] = None
    landmark: Optional[str] = None
    city: str
    state: str
    pincode: str = Field(..., regex="^\d{6}$")
    address_type: str = "home"
    is_default: bool = False

class AddressResponse(BaseModel):
    id: int
    name: str
    phone: str
    address_line_1: str
    address_line_2: Optional[str]
    landmark: Optional[str]
    city: str
    state: str
    pincode: str
    address_type: str
    is_default: bool
    
    class Config:
        from_attributes = True

# Review Schemas
class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = None
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    rating: int
    title: Optional[str]
    comment: Optional[str]
    user: UserResponse
    created_at: datetime
    
    class Config:
        from_attributes = True
