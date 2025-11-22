import pytest
from fastapi.testclient import TestClient
from app.models import User, UserRole
from app.auth import auth_manager

def test_register_user(client: TestClient):
    """Test user registration"""
    user_data = {
        "email": "newuser@example.com",
        "username": "newuser",
        "first_name": "New",
        "last_name": "User",
        "password": "testpassword123",
        "role": "buyer"
    }
    
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["username"] == user_data["username"]
    assert data["role"] == "buyer"
    assert "password" not in data

def test_register_duplicate_email(client: TestClient, test_user: User):
    """Test registration with duplicate email"""
    user_data = {
        "email": test_user.email,
        "username": "newuser",
        "first_name": "New",
        "last_name": "User",
        "password": "testpassword123"
    }
    
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_valid_credentials(client: TestClient, test_user: User):
    """Test login with valid credentials"""
    login_data = {
        "email": test_user.email,
        "password": "testpassword"
    }
    
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == test_user.email

def test_login_invalid_credentials(client: TestClient, test_user: User):
    """Test login with invalid credentials"""
    login_data = {
        "email": test_user.email,
        "password": "wrongpassword"
    }
    
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_login_nonexistent_user(client: TestClient):
    """Test login with nonexistent user"""
    login_data = {
        "email": "nonexistent@example.com",
        "password": "testpassword"
    }
    
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 401

def test_get_current_user(client: TestClient, auth_headers: dict):
    """Test getting current user info"""
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    
    data = response.json()
    assert "email" in data
    assert "username" in data
    assert "role" in data

def test_get_current_user_no_token(client: TestClient):
    """Test getting current user without token"""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401

def test_refresh_token(client: TestClient, test_user: User):
    """Test token refresh"""
    # First login to get tokens
    login_data = {
        "email": test_user.email,
        "password": "testpassword"
    }
    
    login_response = client.post("/api/v1/auth/login", json=login_data)
    tokens = login_response.json()
    
    # Use refresh token to get new access token
    refresh_data = {
        "refresh_token": tokens["refresh_token"]
    }
    
    response = client.post("/api/v1/auth/refresh", json=refresh_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["access_token"] != tokens["access_token"]

def test_refresh_token_invalid(client: TestClient):
    """Test refresh with invalid token"""
    refresh_data = {
        "refresh_token": "invalid_token"
    }
    
    response = client.post("/api/v1/auth/refresh", json=refresh_data)
    assert response.status_code == 401

def test_update_profile(client: TestClient, auth_headers: dict):
    """Test updating user profile"""
    update_data = {
        "first_name": "Updated",
        "last_name": "Name",
        "phone": "+1234567890"
    }
    
    response = client.put("/api/v1/auth/me", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    
    data = response.json()
    assert data["first_name"] == "Updated"
    assert data["last_name"] == "Name"
    assert data["phone"] == "+1234567890"

def test_logout(client: TestClient, auth_headers: dict):
    """Test user logout"""
    response = client.post("/api/v1/auth/logout", headers=auth_headers)
    assert response.status_code == 200
    assert "Logged out successfully" in response.json()["message"]
