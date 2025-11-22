from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.clothing_models import UserRole, OrderStatus, PaymentStatus, ProductStatus, ClothingSize, ClothingCategory

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseSchema):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    phone: Optional[str] = Field(None, max_length=20)
    role: UserRole = UserRole.BUYER

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

class UserLogin(BaseSchema):
    email: EmailStr
    password: str

class TokenResponse(BaseSchema):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Address schemas
class AddressBase(BaseSchema):
    title: str = Field(..., max_length=50)
    full_name: str = Field(..., max_length=100)
    phone: str = Field(..., max_length=20)
    address_line_1: str = Field(..., max_length=255)
    address_line_2: Optional[str] = Field(None, max_length=255)
    city: str = Field(..., max_length=100)
    state: str = Field(..., max_length=100)
    postal_code: str = Field(..., max_length=20)
    country: str = Field(default="India", max_length=100)
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: int
    user_id: int
    created_at: datetime

# Product Image schemas
class ProductImageBase(BaseSchema):
    image_url: str = Field(..., max_length=500)
    alt_text: Optional[str] = Field(None, max_length=255)
    sort_order: int = 0
    is_primary: bool = False

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int
    created_at: datetime

# Clothing Product schemas
class ClothingProductBase(BaseSchema):
    name: str = Field(..., max_length=255)
    description: str
    category: ClothingCategory
    price: Decimal = Field(..., gt=0, decimal_places=2)
    discounted_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    stock_quantity: int = Field(..., ge=0)
    brand: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=50)
    material: Optional[str] = Field(None, max_length=100)
    sizes_available: Optional[str] = None  # JSON string
    gender: Optional[str] = Field(None, max_length=20)

class ClothingProductCreate(ClothingProductBase):
    images: List[ProductImageCreate] = []

class ClothingProductUpdate(BaseSchema):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    category: Optional[ClothingCategory] = None
    price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    discounted_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    stock_quantity: Optional[int] = Field(None, ge=0)
    brand: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=50)
    material: Optional[str] = Field(None, max_length=100)
    sizes_available: Optional[str] = None
    gender: Optional[str] = Field(None, max_length=20)
    status: Optional[ProductStatus] = None

class ClothingProductResponse(ClothingProductBase):
    id: int
    seller_id: int
    sku: str
    status: ProductStatus
    created_at: datetime
    updated_at: Optional[datetime]
    images: List[ProductImageResponse] = []
    seller: UserResponse

class ClothingProductListResponse(BaseSchema):
    id: int
    name: str
    category: ClothingCategory
    price: Decimal
    discounted_price: Optional[Decimal]
    brand: Optional[str]
    color: Optional[str]
    primary_image: Optional[str]
    created_at: datetime

# Cart schemas
class CartItemBase(BaseSchema):
    product_id: int
    quantity: int = Field(..., gt=0)
    size: ClothingSize

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseSchema):
    quantity: Optional[int] = Field(None, gt=0)
    size: Optional[ClothingSize] = None

class CartItemResponse(BaseSchema):
    id: int
    user_id: int
    product_id: int
    quantity: int
    size: ClothingSize
    created_at: datetime
    product: ClothingProductListResponse

# Order schemas
class OrderItemBase(BaseSchema):
    product_id: int
    quantity: int = Field(..., gt=0)
    size: ClothingSize

class OrderItemResponse(BaseSchema):
    id: int
    product_id: int
    quantity: int
    size: ClothingSize
    unit_price: Decimal
    total_price: Decimal
    status: OrderStatus
    product: ClothingProductListResponse

class OrderBase(BaseSchema):
    delivery_address_id: int
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

class OrderResponse(BaseSchema):
    id: int
    order_number: str
    buyer_id: int
    delivery_address_id: int
    subtotal: Decimal
    shipping_amount: Decimal
    total_amount: Decimal
    status: OrderStatus
    payment_status: PaymentStatus
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    delivery_address: AddressResponse
    order_items: List[OrderItemResponse]

# Generic responses
class MessageResponse(BaseSchema):
    message: str

class PaginatedResponse(BaseSchema):
    items: List
    total: int
    page: int
    per_page: int
    pages: int
