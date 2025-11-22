from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import (
    UserCreate, UserLogin, UserResponse, TokenResponse, 
    RefreshTokenRequest, UserUpdate
)
from app.models import User, UserRole
from app.auth import auth_manager, get_current_user
from app.services.email import email_service
from app.utils.rate_limiter import rate_limiter
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/reset-rate-limit")
async def reset_rate_limit():
    """Reset all rate limits (development only)"""
    await rate_limiter.reset_all()
    return {"message": "All rate limits reset successfully"}

security = HTTPBearer()

@router.post("/register", response_model=UserResponse)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = auth_manager.get_user_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username is taken
        existing_username = db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user
        # Truncate password if too long for bcrypt
        password_to_hash = user_data.password[:72] if len(user_data.password) > 72 else user_data.password
        hashed_password = auth_manager.get_password_hash(password_to_hash)
        
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone=user_data.phone if user_data.phone else None,
            hashed_password=hashed_password,
            role=UserRole(user_data.role),
            is_active=True,
            is_verified=True
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"User registered successfully: {db_user.email}, role: {db_user.role}")
        return db_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User registration failed: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
def login_user(
    user_credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """Authenticate user and return tokens"""
    try:
        # Authenticate user
        user = auth_manager.authenticate_user(db, user_credentials.email, user_credentials.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is disabled"
            )
        
        # Create tokens
        access_token = auth_manager.create_access_token(data={"sub": str(user.id)})
        refresh_token = auth_manager.create_refresh_token(data={"sub": str(user.id)})
        
        logger.info(f"User logged in successfully: {user.email}")
        
        # Convert user to UserResponse
        from app.schemas import UserResponse
        user_response = UserResponse.from_orm(user)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=auth_manager.access_token_expire_minutes * 60,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    refresh_request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token
        payload = auth_manager.verify_token(refresh_request.refresh_token, "refresh")
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        user_id = payload.get("sub")
        user = auth_manager.get_user_by_id(db, int(user_id))
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new tokens
        access_token = auth_manager.create_access_token(data={"sub": str(user.id)})
        new_refresh_token = auth_manager.create_refresh_token(data={"sub": str(user.id)})
        
        # Convert user to UserResponse
        from app.schemas import UserResponse
        user_response = UserResponse.from_orm(user)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            expires_in=auth_manager.access_token_expire_minutes * 60,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user information"""
    try:
        # Update user fields
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(current_user, field, value)
        
        db.commit()
        db.refresh(current_user)
        
        logger.info(f"User updated successfully: {current_user.email}")
        return current_user
        
    except Exception as e:
        logger.error(f"User update failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User update failed"
        )

@router.post("/verify-email")
async def verify_email(
    token: str,
    db: Session = Depends(get_db)
):
    """Verify user email address"""
    try:
        # Verify token
        payload = auth_manager.verify_token(token, "access")
        if not payload or payload.get("type") != "email_verification":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification token"
            )
        
        user_id = payload.get("sub")
        user = auth_manager.get_user_by_id(db, int(user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Mark user as verified
        user.is_verified = True
        db.commit()
        
        logger.info(f"Email verified successfully: {user.email}")
        return {"message": "Email verified successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Email verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email verification failed"
        )

@router.post("/logout")
async def logout_user(
    current_user: User = Depends(get_current_user)
):
    """Logout user (client should remove tokens)"""
    logger.info(f"User logged out: {current_user.email}")
    return {"message": "Logged out successfully"}
