from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum, Index, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum
from datetime import datetime
from decimal import Decimal

class UserRole(str, enum.Enum):
    BUYER = "buyer"
    SELLER = "seller"
    ADMIN = "admin"

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class ProductStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    OUT_OF_STOCK = "out_of_stock"
    DELETED = "deleted"

class PayoutStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Category(str, enum.Enum):
    # All Sarees
    SAREE = "saree"
    
    # Shop by Fabric
    COTTON_SAREE = "cotton_saree"
    SILK_SAREE = "silk_saree"
    LINEN_SAREE = "linen_saree"
    
    # Shop by Weave
    KANTHA_SAREE = "kantha_saree"
    JAMDANI_SAREE = "jamdani_saree"
    HANDLOOM_SAREE = "handloom_saree"
    SHIBORI_SAREE = "shibori_saree"
    HANDBLOCK_SAREE = "handblock_saree"
    BATIK_SAREE = "batik_saree"
    AJRAKH_SAREE = "ajrakh_saree"
    KHADI_SAREE = "khadi_saree"
    TISSUE_SAREE = "tissue_saree"
    JACQUARD_SAREE = "jacquard_saree"
    KOTA_SAREE = "kota_saree"
    
    # Shop by Variety
    HANDLOOM_COTTON_SAREE = "handloom_cotton_saree"
    TANGAIL_COTTON_SAREE = "tangail_cotton_saree"
    HANDLOOM_SILK_SAREE = "handloom_silk_saree"
    MATKA_SILK_SAREE = "matka_silk_saree"
    TUSSAR_SILK_SAREE = "tussar_silk_saree"
    MUSLIN_SILK_SAREE = "muslin_silk_saree"
    KATAN_SILK_SAREE = "katan_silk_saree"
    DHAKIL_SAREE = "dhakil_saree"
    MULBERRY_SILK_SAREE = "mulberry_silk_saree"
    DHONEKALI_SAREE = "dhonekali_saree"
    SATIN_SILK_SAREE = "satin_silk_saree"
    
    # Traditional Indian Wear
    LEHENGA = "lehenga"
    KURTI = "kurti"
    SALWAR_KAMEEZ = "salwar_kameez"
    ANARKALI = "anarkali"
    CHURIDAR = "churidar"
    SHARARA = "sharara"
    PALAZZO = "palazzo"
    
    # Western Wear
    DRESS = "dress"
    TOP = "top"
    SHIRT = "shirt"
    TROUSER = "trouser"
    JEANS = "jeans"
    SKIRT = "skirt"
    BLOUSE = "blouse"
    
    # Men's Wear
    KURTA = "kurta"
    SHERWANI = "sherwani"
    DHOTI = "dhoti"
    
    # Accessories
    DUPATTA = "dupatta"
    STOLE = "stole"
    SCARF = "scarf"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=True)  # Optional - allows single name users
    phone = Column(String(20), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.BUYER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    products = relationship("Product", back_populates="seller", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="buyer", cascade="all, delete-orphan")
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    payouts = relationship("Payout", back_populates="seller", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index('idx_user_email', 'email'),
        Index('idx_user_role', 'role'),
        Index('idx_user_created_at', 'created_at'),
    )

class Address(Base):
    __tablename__ = "addresses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(50), nullable=False)  # Home, Office, etc.
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address_line_1 = Column(String(255), nullable=False)
    address_line_2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    country = Column(String(100), default="India", nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="addresses")
    orders = relationship("Order", back_populates="delivery_address")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(Category, values_callable=lambda x: [e.value for e in x]), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    discounted_price = Column(Numeric(10, 2), nullable=True)
    stock_quantity = Column(Integer, default=0, nullable=False)
    sku = Column(String(100), unique=True, nullable=False)
    status = Column(Enum(ProductStatus, values_callable=lambda x: [e.value for e in x]), default=ProductStatus.DRAFT, nullable=False)
    weight = Column(Numeric(8, 2), nullable=True)  # in kg
    dimensions = Column(String(100), nullable=True)  # LxWxH in cm
    brand = Column(String(100), nullable=True)
    tags = Column(Text, nullable=True)  # JSON string
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    seller = relationship("User", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index('idx_product_seller_id', 'seller_id'),
        Index('idx_product_category', 'category'),
        Index('idx_product_status', 'status'),
        Index('idx_product_created_at', 'created_at'),
        Index('idx_product_name', 'name'),
    )

class ProductImage(Base):
    __tablename__ = "product_images"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_primary = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="images")

class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")
    
    # Indexes
    __table_args__ = (
        Index('idx_cart_user_id', 'user_id'),
        Index('idx_cart_product_id', 'product_id'),
    )

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    delivery_address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    tax_amount = Column(Numeric(10, 2), default=0, nullable=False)
    shipping_amount = Column(Numeric(10, 2), default=0, nullable=False)
    discount_amount = Column(Numeric(10, 2), default=0, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    razorpay_order_id = Column(String(100), nullable=True)
    razorpay_payment_id = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    buyer = relationship("User", back_populates="orders")
    delivery_address = relationship("Address", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index('idx_order_buyer_id', 'buyer_id'),
        Index('idx_order_status', 'status'),
        Index('idx_order_created_at', 'created_at'),
        Index('idx_order_number', 'order_number'),
    )

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    commission_amount = Column(Numeric(10, 2), nullable=False)
    seller_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")
    seller = relationship("User", foreign_keys=[seller_id])
    
    # Indexes
    __table_args__ = (
        Index('idx_order_item_order_id', 'order_id'),
        Index('idx_order_item_seller_id', 'seller_id'),
        Index('idx_order_item_product_id', 'product_id'),
    )

class Payout(Base):
    __tablename__ = "payouts"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    commission_amount = Column(Numeric(10, 2), nullable=False)
    net_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(PayoutStatus), default=PayoutStatus.PENDING, nullable=False)
    razorpay_payout_id = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    seller = relationship("User", back_populates="payouts")
    
    # Indexes
    __table_args__ = (
        Index('idx_payout_seller_id', 'seller_id'),
        Index('idx_payout_status', 'status'),
        Index('idx_payout_requested_at', 'requested_at'),
    )

class CompanyInfo(Base):
    __tablename__ = "company_info"
    
    id = Column(Integer, primary_key=True, index=True)
    # Impact Statistics
    artisans_supported = Column(String(20), default="500+", nullable=False)
    villages_reached = Column(String(20), default="50+", nullable=False)
    happy_customers = Column(String(20), default="10,000+", nullable=False)
    years_of_excellence = Column(String(20), default="5+", nullable=False)
    
    # Why Choose Us features (JSON stored as text)
    features = Column(Text, nullable=True)  # JSON string for features
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(Integer, nullable=True)
    old_values = Column(Text, nullable=True)  # JSON string
    new_values = Column(Text, nullable=True)  # JSON string
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
    
    # Indexes
    __table_args__ = (
        Index('idx_audit_log_user_id', 'user_id'),
        Index('idx_audit_log_action', 'action'),
        Index('idx_audit_log_resource', 'resource_type', 'resource_id'),
        Index('idx_audit_log_created_at', 'created_at'),
    )
