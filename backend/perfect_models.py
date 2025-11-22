from sqlalchemy import Column, Integer, String, Text, Decimal, DateTime, Boolean, ForeignKey, Enum, Index, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    SELLER = "seller"
    ADMIN = "admin"

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    RETURNED = "returned"
    REFUNDED = "refunded"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"

class PaymentMethod(str, enum.Enum):
    RAZORPAY = "razorpay"
    COD = "cod"
    UPI = "upi"
    CARD = "card"
    NETBANKING = "netbanking"
    WALLET = "wallet"

class ProductStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    OUT_OF_STOCK = "out_of_stock"
    DISCONTINUED = "discontinued"

class ClothingCategory(str, enum.Enum):
    # Traditional Wear
    SAREE = "saree"
    LEHENGA = "lehenga"
    SALWAR_KAMEEZ = "salwar_kameez"
    KURTI = "kurti"
    CHURIDAR = "churidar"
    ANARKALI = "anarkali"
    
    # Western Wear
    DRESS = "dress"
    TOP = "top"
    SHIRT = "shirt"
    TSHIRT = "tshirt"
    JEANS = "jeans"
    TROUSER = "trouser"
    SKIRT = "skirt"
    JACKET = "jacket"
    
    # Men's Wear
    KURTA = "kurta"
    SHERWANI = "sherwani"
    FORMAL_SHIRT = "formal_shirt"
    CASUAL_SHIRT = "casual_shirt"
    SUIT = "suit"
    
    # Accessories
    DUPATTA = "dupatta"
    STOLE = "stole"
    SCARF = "scarf"

class FabricType(str, enum.Enum):
    SILK = "silk"
    COTTON = "cotton"
    GEORGETTE = "georgette"
    CHIFFON = "chiffon"
    CREPE = "crepe"
    SATIN = "satin"
    VELVET = "velvet"
    NET = "net"
    LINEN = "linen"
    POLYESTER = "polyester"
    RAYON = "rayon"
    WOOL = "wool"
    KHADI = "khadi"
    CHANDERI = "chanderi"
    BANARASI = "banarasi"
    KANJIVARAM = "kanjivaram"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)
    phone_verified = Column(Boolean, default=False, nullable=False)
    profile_image = Column(String(500), nullable=True)
    
    # Seller specific fields
    store_name = Column(String(100), nullable=True)
    store_description = Column(Text, nullable=True)
    gst_number = Column(String(50), nullable=True)
    pan_number = Column(String(20), nullable=True)
    bank_account_number = Column(String(50), nullable=True)
    bank_name = Column(String(100), nullable=True)
    ifsc_code = Column(String(20), nullable=True)
    commission_rate = Column(Decimal(5, 2), default=10.00, nullable=True)  # Platform commission %
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    products = relationship("Product", back_populates="seller", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="customer", foreign_keys="Order.customer_id")
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")

class Address(Base):
    __tablename__ = "addresses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address_line_1 = Column(String(255), nullable=False)
    address_line_2 = Column(String(255), nullable=True)
    landmark = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    country = Column(String(100), default="India", nullable=False)
    address_type = Column(String(20), default="home", nullable=False)  # home, office, other
    is_default = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="addresses")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Basic Info
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(ClothingCategory), nullable=False, index=True)
    subcategory = Column(String(100), nullable=True)
    
    # Pricing
    mrp = Column(Decimal(10, 2), nullable=False)  # Maximum Retail Price
    selling_price = Column(Decimal(10, 2), nullable=False)
    cost_price = Column(Decimal(10, 2), nullable=True)  # For seller's reference
    discount_percentage = Column(Decimal(5, 2), nullable=True)
    
    # Inventory
    sku = Column(String(100), unique=True, nullable=False)
    total_stock = Column(Integer, default=0, nullable=False)
    status = Column(Enum(ProductStatus), default=ProductStatus.DRAFT, nullable=False)
    
    # Clothing Specific
    fabric = Column(Enum(FabricType), nullable=True)
    pattern = Column(String(100), nullable=True)  # Printed, Embroidered, Plain, etc.
    occasion = Column(String(100), nullable=True)  # Casual, Formal, Party, Wedding, etc.
    season = Column(String(50), nullable=True)  # Summer, Winter, All Season
    brand = Column(String(100), nullable=True)
    country_of_origin = Column(String(100), default="India", nullable=False)
    
    # Saree Specific
    saree_length = Column(Decimal(5, 2), nullable=True)  # in meters
    blouse_piece = Column(Boolean, default=False, nullable=True)
    blouse_length = Column(Decimal(5, 2), nullable=True)  # in meters
    border_type = Column(String(100), nullable=True)
    work_type = Column(String(200), nullable=True)  # Zari, Embroidery, Print, etc.
    
    # Care Instructions
    care_instructions = Column(Text, nullable=True)
    
    # SEO
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(Text, nullable=True)
    
    # Shipping
    weight = Column(Decimal(8, 3), nullable=True)  # in kg
    length = Column(Decimal(8, 2), nullable=True)  # in cm
    width = Column(Decimal(8, 2), nullable=True)  # in cm
    height = Column(Decimal(8, 2), nullable=True)  # in cm
    
    # Stats
    view_count = Column(Integer, default=0, nullable=False)
    sold_count = Column(Integer, default=0, nullable=False)
    rating = Column(Decimal(3, 2), default=0, nullable=False)
    review_count = Column(Integer, default=0, nullable=False)
    
    # Flags
    is_featured = Column(Boolean, default=False, nullable=False)
    is_bestseller = Column(Boolean, default=False, nullable=False)
    is_new_arrival = Column(Boolean, default=False, nullable=False)
    is_returnable = Column(Boolean, default=True, nullable=False)
    return_period = Column(Integer, default=7, nullable=False)  # days
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    seller = relationship("User", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = "product_images"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500), nullable=True)
    alt_text = Column(String(255), nullable=True)
    is_primary = Column(Boolean, default=False, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="images")

class ProductVariant(Base):
    __tablename__ = "product_variants"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Variant Details
    size = Column(String(20), nullable=True)  # S, M, L, XL, XXL, Free Size, etc.
    color = Column(String(50), nullable=True)
    color_code = Column(String(7), nullable=True)  # Hex color code
    
    # Pricing for this variant
    mrp = Column(Decimal(10, 2), nullable=True)
    selling_price = Column(Decimal(10, 2), nullable=True)
    
    # Stock for this variant
    stock_quantity = Column(Integer, default=0, nullable=False)
    sku_variant = Column(String(100), unique=True, nullable=False)
    
    # Additional variant images
    variant_images = Column(JSON, nullable=True)  # JSON array of image URLs
    
    is_available = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="variants")

class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="cart_items")
    product = relationship("Product")
    variant = relationship("ProductVariant")

class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Address
    shipping_address = Column(JSON, nullable=False)  # Store address as JSON
    billing_address = Column(JSON, nullable=False)
    
    # Amounts
    subtotal = Column(Decimal(10, 2), nullable=False)
    discount_amount = Column(Decimal(10, 2), default=0, nullable=False)
    coupon_code = Column(String(50), nullable=True)
    tax_amount = Column(Decimal(10, 2), default=0, nullable=False)
    shipping_charge = Column(Decimal(10, 2), default=0, nullable=False)
    total_amount = Column(Decimal(10, 2), nullable=False)
    
    # Payment
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    
    # Razorpay
    razorpay_order_id = Column(String(100), nullable=True)
    razorpay_payment_id = Column(String(100), nullable=True)
    razorpay_signature = Column(String(255), nullable=True)
    
    # Status
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    
    # Tracking
    tracking_number = Column(String(100), nullable=True)
    courier_partner = Column(String(100), nullable=True)
    expected_delivery = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    
    # Notes
    customer_notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    customer = relationship("User", back_populates="orders", foreign_keys=[customer_id])
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Product snapshot at time of order
    product_name = Column(String(255), nullable=False)
    product_image = Column(String(500), nullable=True)
    size = Column(String(20), nullable=True)
    color = Column(String(50), nullable=True)
    
    # Pricing
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Decimal(10, 2), nullable=False)
    total_price = Column(Decimal(10, 2), nullable=False)
    
    # Commission
    platform_fee = Column(Decimal(10, 2), nullable=False)
    seller_amount = Column(Decimal(10, 2), nullable=False)
    
    # Status
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product")
    variant = relationship("ProductVariant")
    seller = relationship("User", foreign_keys=[seller_id])

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True, nullable=False)
    
    # Payment Details
    amount = Column(Decimal(10, 2), nullable=False)
    currency = Column(String(3), default="INR", nullable=False)
    method = Column(Enum(PaymentMethod), nullable=False)
    status = Column(Enum(PaymentStatus), nullable=False)
    
    # Gateway Response
    gateway = Column(String(50), nullable=True)  # razorpay, stripe, etc.
    gateway_order_id = Column(String(100), nullable=True)
    gateway_payment_id = Column(String(100), nullable=True)
    gateway_signature = Column(String(255), nullable=True)
    gateway_response = Column(JSON, nullable=True)  # Full response from gateway
    
    # Refund
    refund_amount = Column(Decimal(10, 2), default=0, nullable=False)
    refund_id = Column(String(100), nullable=True)
    refund_status = Column(String(50), nullable=True)
    refunded_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="payment")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_item_id = Column(Integer, ForeignKey("order_items.id"), nullable=True)
    
    rating = Column(Integer, nullable=False)  # 1-5
    title = Column(String(255), nullable=True)
    comment = Column(Text, nullable=True)
    
    # Review images
    images = Column(JSON, nullable=True)  # JSON array of image URLs
    
    is_verified_purchase = Column(Boolean, default=False, nullable=False)
    is_approved = Column(Boolean, default=False, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class Coupon(Base):
    __tablename__ = "coupons"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Discount
    discount_type = Column(String(20), nullable=False)  # percentage, fixed
    discount_value = Column(Decimal(10, 2), nullable=False)
    minimum_amount = Column(Decimal(10, 2), default=0, nullable=False)
    maximum_discount = Column(Decimal(10, 2), nullable=True)
    
    # Validity
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_until = Column(DateTime(timezone=True), nullable=False)
    usage_limit = Column(Integer, nullable=True)
    used_count = Column(Integer, default=0, nullable=False)
    
    # Restrictions
    applicable_categories = Column(JSON, nullable=True)  # JSON array of categories
    applicable_products = Column(JSON, nullable=True)  # JSON array of product IDs
    
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
