import os
import uuid
import shutil
from typing import Dict, Any, List
from fastapi import HTTPException, status, UploadFile
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class LocalStorageService:
    def __init__(self):
        self.base_path = Path("./uploads")
        self.base_path.mkdir(exist_ok=True)
        
        # Create subdirectories
        (self.base_path / "products").mkdir(exist_ok=True)
        
        self.allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        self.max_file_size = 10 * 1024 * 1024  # 10MB
    
    def validate_file(self, file: UploadFile) -> bool:
        """Validate uploaded file"""
        # Check file type
        if file.content_type not in self.allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(self.allowed_types)}"
            )
        
        return True
    
    def upload_image(self, file: UploadFile, folder: str = "products") -> Dict[str, Any]:
        """Upload image to local storage"""
        try:
            # Validate file
            self.validate_file(file)
            
            # Generate unique filename
            file_extension = Path(file.filename).suffix.lower()
            if not file_extension:
                # Try to get extension from content type
                content_type_map = {
                    'image/jpeg': '.jpg',
                    'image/jpg': '.jpg', 
                    'image/png': '.png',
                    'image/webp': '.webp',
                    'image/gif': '.gif'
                }
                file_extension = content_type_map.get(file.content_type, '.jpg')
            
            unique_filename = f"{uuid.uuid4().hex}{file_extension}"
            
            # Create full path
            folder_path = self.base_path / folder
            folder_path.mkdir(exist_ok=True)
            file_path = folder_path / unique_filename
            
            # Reset file position to beginning
            file.file.seek(0)
            
            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Generate URL (relative to backend server)
            file_url = f"/uploads/{folder}/{unique_filename}"
            
            logger.info(f"File uploaded successfully: {file_path}")
            
            # Get file size
            file_size = file_path.stat().st_size
            
            # Try to get image dimensions
            width, height = 100, 100  # Default values
            try:
                from PIL import Image as PILImage
                with PILImage.open(file_path) as pil_img:
                    width, height = pil_img.size
            except Exception as e:
                logger.warning(f"Could not get image dimensions: {e}")
            
            return {
                "url": file_url,
                "public_id": unique_filename,
                "secure_url": file_url,
                "original_filename": file.filename,
                "width": width,
                "height": height,
                "format": file_extension[1:],  # Remove the dot
                "bytes": file_size
            }
            
        except Exception as e:
            logger.error(f"Error uploading file: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"File upload failed: {str(e)}"
            )
    
    def upload_multiple_images(self, files: List[UploadFile], folder: str = "products") -> List[Dict[str, Any]]:
        """Upload multiple images"""
        results = []
        
        for file in files:
            try:
                result = self.upload_image(file, folder)
                results.append(result)
            except Exception as e:
                logger.error(f"Failed to upload {file.filename}: {e}")
                # Continue with other files even if one fails
                continue
        
        return results
    
    def delete_image(self, file_path: str) -> bool:
        """Delete image from local storage"""
        try:
            # Remove leading slash and construct full path
            relative_path = file_path.lstrip('/')
            full_path = Path(relative_path)
            
            if full_path.exists():
                full_path.unlink()
                logger.info(f"File deleted: {full_path}")
                return True
            else:
                logger.warning(f"File not found for deletion: {full_path}")
                return False
                
        except Exception as e:
            logger.error(f"Error deleting file {file_path}: {e}")
            return False

# Create instance
local_storage_service = LocalStorageService()
