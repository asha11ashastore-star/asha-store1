import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app
from app.models import User, UserRole
from app.auth import auth_manager
import os

# Test database URL
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite:///./test.db")

# Create test engine
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in TEST_DATABASE_URL else {}
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db_engine():
    """Create test database engine"""
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(db_engine):
    """Create test database session"""
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    """Create test client"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db_session):
    """Create test user"""
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "hashed_password": auth_manager.get_password_hash("testpassword"),
        "role": UserRole.BUYER,
        "is_active": True,
        "is_verified": True
    }
    
    user = User(**user_data)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    return user

@pytest.fixture
def test_seller(db_session):
    """Create test seller"""
    seller_data = {
        "email": "seller@example.com",
        "username": "testseller",
        "first_name": "Test",
        "last_name": "Seller",
        "hashed_password": auth_manager.get_password_hash("testpassword"),
        "role": UserRole.SELLER,
        "is_active": True,
        "is_verified": True
    }
    
    seller = User(**seller_data)
    db_session.add(seller)
    db_session.commit()
    db_session.refresh(seller)
    
    return seller

@pytest.fixture
def auth_headers(test_user):
    """Generate auth headers for test user"""
    token = auth_manager.create_access_token(data={"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def seller_auth_headers(test_seller):
    """Generate auth headers for test seller"""
    token = auth_manager.create_access_token(data={"sub": str(test_seller.id)})
    return {"Authorization": f"Bearer {token}"}
