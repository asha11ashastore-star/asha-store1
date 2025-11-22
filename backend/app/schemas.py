from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List, Dict
from datetime import datetime
from decimal import Decimal
from app.models import UserRole, OrderStatus, PaymentStatus, ProductStatus, Category, PayoutStatus

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
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserUpdate(BaseSchema):
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    phone: Optional[str] = Field(None, max_length=20)
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

class UserLogin(BaseSchema):
    email: EmailStr
    password: str

class TokenResponse(BaseSchema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class RefreshTokenRequest(BaseSchema):
    refresh_token: str

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

class AddressUpdate(BaseSchema):
    title: Optional[str] = Field(None, max_length=50)
    full_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    address_line_1: Optional[str] = Field(None, max_length=255)
    address_line_2: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=100)
    is_default: Optional[bool] = None

class AddressResponse(AddressBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

# Product schemas
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

class ProductBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=10)
    category: Category
    price: Decimal = Field(..., gt=0)
    discounted_price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: int = Field(..., ge=0)
    sku: str = Field(..., max_length=100)
    weight: Optional[Decimal] = Field(None, gt=0)
    dimensions: Optional[str] = Field(None, max_length=100)
    brand: Optional[str] = Field(None, max_length=100)
    tags: Optional[str] = None
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    status: ProductStatus = ProductStatus.DRAFT
    
    @validator('discounted_price')
    def validate_discounted_price(cls, v, values):
        if v and 'price' in values and v >= values['price']:
            raise ValueError('Discounted price must be less than regular price')
        return v

class ProductCreate(ProductBase):
    images: Optional[List[ProductImageCreate]] = []

class ProductUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None  # Removed min_length requirement for updates
    category: Optional[Category] = None
    price: Optional[Decimal] = Field(None, gt=0)
    discounted_price: Optional[Decimal] = Field(None, ge=0)  # Allow 0 or None
    stock_quantity: Optional[int] = Field(None, ge=0)
    weight: Optional[Decimal] = Field(None, gt=0)
    dimensions: Optional[str] = Field(None, max_length=100)
    brand: Optional[str] = Field(None, max_length=100)
    tags: Optional[str] = None
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    status: Optional[ProductStatus] = None
    sku: Optional[str] = None  # Add sku field

class ProductResponse(ProductBase):
    id: int
    seller_id: int
    images: List[ProductImageResponse]
    seller: UserResponse
    created_at: datetime
    updated_at: Optional[datetime]

class ProductListResponse(BaseSchema):
    id: int
    seller_id: int
    name: str
    category: str  # Changed from Category enum to str
    price: Decimal
    discounted_price: Optional[Decimal]
    stock_quantity: int
    status: str  # Changed from ProductStatus enum to str
    primary_image: Optional[str]
    seller_name: str
    created_at: datetime

# Cart schemas
class CartItemBase(BaseSchema):
    product_id: int
    quantity: int = Field(..., gt=0)

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseSchema):
    quantity: int = Field(..., gt=0)

class CartItemResponse(CartItemBase):
    id: int
    user_id: int
    product: ProductResponse
    created_at: datetime
    updated_at: Optional[datetime]

class CartResponse(BaseSchema):
    items: List[CartItemResponse]
    total_items: int
    subtotal: Decimal

# Order schemas
class OrderItemBase(BaseSchema):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: Decimal = Field(..., gt=0)

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    seller_id: int
    total_price: Decimal
    commission_amount: Decimal
    seller_amount: Decimal
    status: OrderStatus
    product: ProductResponse
    created_at: datetime

class OrderBase(BaseSchema):
    delivery_address_id: int
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

# Customer order with direct address (for checkout)
class CustomerOrderCreate(BaseSchema):
    items: List[OrderItemBase]
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: Dict[str, str]
    notes: Optional[str] = None

class OrderResponse(OrderBase):
    id: int
    order_number: str
    buyer_id: int
    subtotal: Decimal
    tax_amount: Decimal
    shipping_amount: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    status: OrderStatus
    payment_status: PaymentStatus
    razorpay_order_id: Optional[str]
    razorpay_payment_id: Optional[str]
    delivery_address: AddressResponse
    order_items: List[OrderItemResponse]
    created_at: datetime
    updated_at: Optional[datetime]

class OrderListResponse(BaseSchema):
    id: int
    order_number: str
    total_amount: Decimal
    status: OrderStatus
    payment_status: PaymentStatus
    items_count: int
    created_at: datetime

# Payment schemas
class PaymentOrderCreate(BaseSchema):
    order_id: int

class PaymentOrderResponse(BaseSchema):
    razorpay_order_id: str
    amount: int  # in paise
    currency: str = "INR"
    order_id: int

class PaymentVerification(BaseSchema):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class RefundRequest(BaseSchema):
    order_id: int
    amount: Optional[Decimal] = None
    reason: Optional[str] = None

# Payout schemas
class PayoutRequest(BaseSchema):
    amount: Decimal = Field(..., gt=0)
    notes: Optional[str] = None

class PayoutResponse(BaseSchema):
    id: int
    seller_id: int
    amount: Decimal
    commission_amount: Decimal
    net_amount: Decimal
    status: PayoutStatus
    razorpay_payout_id: Optional[str]
    notes: Optional[str]
    requested_at: datetime
    processed_at: Optional[datetime]

# File upload schemas
class ImageUploadResponse(BaseSchema):
    url: str
    public_id: str
    width: int
    height: int
    format: str
    bytes: int

# Search and filter schemas
class ProductFilter(BaseSchema):
    category: Optional[Category] = None
    min_price: Optional[Decimal] = Field(None, ge=0)
    max_price: Optional[Decimal] = Field(None, ge=0)
    seller_id: Optional[int] = None
    brand: Optional[str] = None
    in_stock: Optional[bool] = None
    search: Optional[str] = None

class PaginationParams(BaseSchema):
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)

class PaginatedResponse(BaseSchema):
    items: List
    total: int
    page: int
    limit: int
    pages: int
    has_next: bool
    has_prev: bool

# Analytics schemas
class SalesAnalytics(BaseSchema):
    total_orders: int
    total_revenue: Decimal
    total_commission: Decimal
    pending_payouts: Decimal
    period_start: datetime
    period_end: datetime

class OrderAnalytics(BaseSchema):
    pending: int
    confirmed: int
    processing: int
    shipped: int
    delivered: int
    cancelled: int
    refunded: int

# Audit log schemas
class AuditLogResponse(BaseSchema):
    id: int
    user_id: Optional[int]
    action: str
    resource_type: str
    resource_id: Optional[int]
    ip_address: Optional[str]
    user_agent: Optional[str]
    created_at: datetime

# Company Info schemas
class CompanyFeature(BaseSchema):
    title: str
    description: str

class CompanyInfoBase(BaseSchema):
    artisans_supported: str = "500+"
    villages_reached: str = "50+"
    happy_customers: str = "10,000+"
    years_of_excellence: str = "5+"
    features: Optional[List[CompanyFeature]] = []

class CompanyInfoCreate(CompanyInfoBase):
    pass

class CompanyInfoUpdate(BaseSchema):
    artisans_supported: Optional[str] = None
    villages_reached: Optional[str] = None
    happy_customers: Optional[str] = None
    years_of_excellence: Optional[str] = None
    features: Optional[List[CompanyFeature]] = None

class CompanyInfoResponse(CompanyInfoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
