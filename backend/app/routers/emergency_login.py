"""
EMERGENCY LOGIN BYPASS - DELETE AFTER USE
Creates a valid JWT token without password verification
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import TokenResponse
from app.auth import auth_manager
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/emergency", tags=["Emergency"])

@router.post("/login/{email}", response_model=TokenResponse)
def emergency_login(email: str, db: Session = Depends(get_db)):
    """
    EMERGENCY LOGIN - Bypasses password verification
    USE ONLY FOR: owner@ashastore.com or seller@ashastore.com
    DELETE THIS ENDPOINT AFTER FIXING THE MAIN LOGIN!
    """
    try:
        # Find user
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            raise HTTPException(status_code=404, detail=f"User {email} not found")
        
        if user.role.value != 'seller':
            raise HTTPException(status_code=403, detail="Only seller accounts allowed")
        
        # Create tokens WITHOUT password verification
        access_token = auth_manager.create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(minutes=auth_manager.access_token_expire_minutes)
        )
        
        refresh_token = auth_manager.create_refresh_token(
            data={"sub": str(user.id)}
        )
        
        logger.info(f"🚨 EMERGENCY LOGIN: {user.email} - Bypassed password verification!")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": auth_manager.access_token_expire_minutes * 60,
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": user.phone,
                "role": user.role.value,
                "is_active": user.is_active,
                "is_verified": user.is_verified,
                "avatar_url": user.avatar_url,
                "created_at": user.created_at,
                "updated_at": user.updated_at
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Emergency login failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
