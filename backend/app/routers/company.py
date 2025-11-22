from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas import (
    CompanyInfoCreate, CompanyInfoUpdate, CompanyInfoResponse
)
from app.models import CompanyInfo, User, UserRole
from app.auth import get_current_user, get_current_seller
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/company", tags=["Company Info"])

@router.get("/info", response_model=CompanyInfoResponse)
async def get_company_info(db: Session = Depends(get_db)):
    """Get company information (public endpoint)"""
    try:
        company_info = db.query(CompanyInfo).first()
        
        if not company_info:
            # Create default company info if none exists
            default_features = [
                {"title": "100% Handwoven", "description": "Every product is authentically handcrafted by skilled artisans"},
                {"title": "Premium Quality", "description": "Carefully curated collection with the finest materials"},
                {"title": "Ethical Sourcing", "description": "Direct partnerships ensuring fair wages for artisans"},
                {"title": "Cultural Heritage", "description": "Preserving traditional techniques and designs"},
                {"title": "Sustainable Fashion", "description": "Eco-friendly practices supporting environmental conservation"},
                {"title": "Global Reach", "description": "Bringing authentic Indian craftsmanship worldwide"}
            ]
            
            company_info = CompanyInfo(
                artisans_supported="500+",
                villages_reached="50+",
                happy_customers="10,000+",
                years_of_excellence="5+",
                features=json.dumps(default_features)
            )
            db.add(company_info)
            db.commit()
            db.refresh(company_info)
        
        # Parse features JSON
        features = []
        if company_info.features:
            try:
                features = json.loads(company_info.features)
            except json.JSONDecodeError:
                features = []
        
        return CompanyInfoResponse(
            id=company_info.id,
            artisans_supported=company_info.artisans_supported,
            villages_reached=company_info.villages_reached,
            happy_customers=company_info.happy_customers,
            years_of_excellence=company_info.years_of_excellence,
            features=features,
            created_at=company_info.created_at,
            updated_at=company_info.updated_at
        )
        
    except Exception as e:
        logger.error(f"Error fetching company info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching company information"
        )

@router.put("/info", response_model=CompanyInfoResponse)
async def update_company_info(
    update_data: CompanyInfoUpdate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update company information (sellers only)"""
    try:
        company_info = db.query(CompanyInfo).first()
        
        if not company_info:
            # Create new company info if none exists
            company_info = CompanyInfo()
            db.add(company_info)
        
        # Update fields if provided
        update_dict = update_data.dict(exclude_unset=True)
        
        for field, value in update_dict.items():
            if field == "features" and value is not None:
                # Convert features to JSON string
                setattr(company_info, field, json.dumps(value))
            elif value is not None:
                setattr(company_info, field, value)
        
        db.commit()
        db.refresh(company_info)
        
        # Parse features for response
        features = []
        if company_info.features:
            try:
                features = json.loads(company_info.features)
            except json.JSONDecodeError:
                features = []
        
        logger.info(f"Company info updated by seller {current_seller.id}")
        
        return CompanyInfoResponse(
            id=company_info.id,
            artisans_supported=company_info.artisans_supported,
            villages_reached=company_info.villages_reached,
            happy_customers=company_info.happy_customers,
            years_of_excellence=company_info.years_of_excellence,
            features=features,
            created_at=company_info.created_at,
            updated_at=company_info.updated_at
        )
        
    except Exception as e:
        logger.error(f"Company info update failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Company info update failed"
        )
