"""
TEMPORARY ADMIN ENDPOINT - DELETE AFTER USE
Emergency password reset for asha@ashastore.com
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth import auth_manager
import logging
import hashlib

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/check-asha-user")
def check_asha_user(db: Session = Depends(get_db)):
    """Check asha@ashastore.com user details"""
    try:
        user = db.query(User).filter(User.email == "asha@ashastore.com").first()
        
        if not user:
            return {"found": False, "message": "User not found"}
        
        return {
            "found": True,
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
            "is_active": user.is_active,
            "hash_prefix": user.hashed_password[:20] if user.hashed_password else None,
            "hash_length": len(user.hashed_password) if user.hashed_password else 0,
            "is_sha256": user.hashed_password.startswith("sha256$") if user.hashed_password else False,
            "is_bcrypt": user.hashed_password.startswith("$2") if user.hashed_password else False
        }
    except Exception as e:
        logger.error(f"Check user failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reset-asha-password")
def reset_asha_password(db: Session = Depends(get_db)):
    """Emergency password reset for asha@ashastore.com"""
    try:
        # Find user
        user = db.query(User).filter(User.email == "asha@ashastore.com").first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Set new password with SHA256
        new_password = "AshaStore2024!"
        sha256_hash = hashlib.sha256(new_password.encode()).hexdigest()
        new_hash = f"sha256${sha256_hash}"
        
        logger.info(f"Resetting password for {user.email}")
        logger.info(f"Old hash: {user.hashed_password[:30]}...")
        logger.info(f"New hash: {new_hash[:30]}...")
        
        user.hashed_password = new_hash
        db.commit()
        
        return {
            "success": True,
            "message": "Password reset successfully",
            "email": user.email,
            "new_password": new_password,
            "hash_format": "SHA256"
        }
        
    except Exception as e:
        logger.error(f"Password reset failed: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
