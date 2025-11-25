import cloudinary
import cloudinary.uploader
import cloudinary.utils
from typing import Dict, Any, Optional, List
from fastapi import HTTPException, status, UploadFile
from app.config import settings
from app.services.local_storage import local_storage_service
import logging
import uuid
import mimetypes

logger = logging.getLogger(__name__)

# Check if Cloudinary is properly configured
CLOUDINARY_CONFIGURED = (
    settings.cloudinary_cloud_name and 
    settings.cloudinary_api_key and 
    settings.cloudinary_api_secret and
    settings.cloudinary_cloud_name != "demo" and 
    settings.cloudinary_api_key != "demo_key" and 
    settings.cloudinary_api_secret != "demo_secret"
)

if CLOUDINARY_CONFIGURED:
    # Configure Cloudinary
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True
    )
    logger.info("Using Cloudinary for image storage")
else:
    logger.info("Cloudinary not configured, using local file storage")

class StorageService:
    def __init__(self):
        self.allowed_types = settings.allowed_image_types
        self.max_file_size = settings.max_file_size
    
    def validate_file(self, file: UploadFile) -> bool:
        """Validate uploaded file"""
        # Check file size
        if hasattr(file, 'size') and file.size > self.max_file_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds maximum limit of {self.max_file_size / (1024*1024):.1f}MB"
            )
        
        # Check content type
        content_type = file.content_type
        if content_type not in self.allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {content_type} not allowed. Allowed types: {', '.join(self.allowed_types)}"
            )
        
        return True
    
    def upload_image(
        self, 
        file: UploadFile, 
        folder: str = "products",
        transformation: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Upload image to storage (Cloudinary or local)"""
        try:
            # Use local storage if Cloudinary not configured
            if not CLOUDINARY_CONFIGURED:
                logger.info("Using local storage for image upload")
                return local_storage_service.upload_image(file, folder)
            
            # Validate file
            self.validate_file(file)
            
            # Generate unique filename
            file_id = str(uuid.uuid4())
            public_id = f"{folder}/{file_id}"
            
            # Default transformations for optimization
            default_transformation = {
                "quality": "auto:good",
                "fetch_format": "auto",
                "flags": "progressive"
            }
            
            if transformation:
                default_transformation.update(transformation)
            
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                file.file,
                public_id=public_id,
                transformation=default_transformation,
                resource_type="image"
            )
            
            logger.info(f"Image uploaded successfully to Cloudinary: {result['public_id']}")
            
            return {
                "url": result["secure_url"],
                "public_id": result["public_id"],
                "width": result["width"],
                "height": result["height"],
                "format": result["format"],
                "bytes": result["bytes"]
            }
            
        except Exception as e:
            logger.error(f"Error uploading file: {e}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Image upload failed: {str(e)}"
            )
    
    def upload_multiple_images(
        self, 
        files: List[UploadFile], 
        folder: str = "products"
    ) -> List[Dict[str, Any]]:
        """Upload multiple images"""
        results = []
        for file in files:
            result = self.upload_image(file, folder)
            results.append(result)
        return results
    
    def delete_image(self, public_id: str) -> bool:
        """Delete image from Cloudinary"""
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            logger.error(f"Image deletion failed: {e}")
            return False
    
    def generate_transformation_url(
        self, 
        public_id: str, 
        transformation: Dict[str, Any]
    ) -> str:
        """Generate transformed image URL"""
        try:
            return cloudinary.utils.cloudinary_url(
                public_id,
                transformation=transformation,
                secure=True
            )[0]
        except Exception as e:
            logger.error(f"URL generation failed: {e}")
            return ""
    
    def get_image_variants(self, public_id: str) -> Dict[str, str]:
        """Get different sizes of an image"""
        variants = {}
        
        # Thumbnail - 150x150
        variants["thumbnail"] = self.generate_transformation_url(
            public_id,
            {"width": 150, "height": 150, "crop": "fill", "quality": "auto:good"}
        )
        
        # Small - 300x300
        variants["small"] = self.generate_transformation_url(
            public_id,
            {"width": 300, "height": 300, "crop": "fit", "quality": "auto:good"}
        )
        
        # Medium - 600x600
        variants["medium"] = self.generate_transformation_url(
            public_id,
            {"width": 600, "height": 600, "crop": "fit", "quality": "auto:good"}
        )
        
        # Large - 1200x1200
        variants["large"] = self.generate_transformation_url(
            public_id,
            {"width": 1200, "height": 1200, "crop": "fit", "quality": "auto"}
        )
        
        # Original
        variants["original"] = self.generate_transformation_url(
            public_id,
            {"quality": "auto"}
        )
        
        return variants
    
    def generate_signed_upload_params(
        self, 
        folder: str = "products"
    ) -> Dict[str, Any]:
        """Generate signed upload parameters for client-side upload"""
        try:
            timestamp = cloudinary.utils.now()
            params = {
                "timestamp": timestamp,
                "folder": folder,
                "quality": "auto:good",
                "fetch_format": "auto"
            }
            
            # Generate signature
            signature = cloudinary.utils.api_sign_request(
                params, 
                settings.cloudinary_api_secret
            )
            
            return {
                "timestamp": timestamp,
                "signature": signature,
                "api_key": settings.cloudinary_api_key,
                "cloud_name": settings.cloudinary_cloud_name,
                "folder": folder
            }
            
        except Exception as e:
            logger.error(f"Signed upload params generation failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not generate upload parameters"
            )

# Create storage service instance
storage_service = StorageService()
