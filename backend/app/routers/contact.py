"""
Contact Form API - Handles contact form submissions
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.services.email import email_service
from app.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/contact", tags=["Contact"])


class ContactFormRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactFormResponse(BaseModel):
    success: bool
    message: str


@router.post("/submit", response_model=ContactFormResponse)
async def submit_contact_form(request: ContactFormRequest):
    """
    Submit contact form and send email notification
    """
    try:
        logger.info(f"Contact form submission from: {request.name} ({request.email})")
        
        # Prepare email content
        subject = f"New Contact Form Submission from {request.name}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #B83C3A; color: white; padding: 20px; text-align: center; }}
                .content {{ background-color: #f9f9f9; padding: 20px; margin: 20px 0; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #B83C3A; }}
                .value {{ margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #B83C3A; }}
                .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>अशा</h1>
                    <p>New Contact Form Submission</p>
                </div>
                
                <div class="content">
                    <div class="field">
                        <div class="label">From:</div>
                        <div class="value">{request.name}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">{request.email}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Message:</div>
                        <div class="value">{request.message}</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This message was sent from the contact form on basheera.in</p>
                    <p>Reply directly to: {request.email}</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        plain_text = f"""
        New Contact Form Submission
        
        From: {request.name}
        Email: {request.email}
        
        Message:
        {request.message}
        
        ---
        This message was sent from the contact form on basheera.in
        Reply to: {request.email}
        """
        
        # Send email to store owner
        email_sent = email_service.send_email(
            to_email=settings.from_email,  # Send to store owner
            subject=subject,
            html_content=html_content,
            plain_text_content=plain_text
        )
        
        if email_sent:
            logger.info(f"Contact form email sent successfully to {settings.from_email}")
            return ContactFormResponse(
                success=True,
                message="Thank you for contacting us! We'll get back to you soon."
            )
        else:
            # Email service not configured or failed
            logger.warning(f"Contact form submission received but email not sent: {request.name}")
            return ContactFormResponse(
                success=True,
                message="Your message has been received. We'll contact you soon!"
            )
            
    except Exception as e:
        logger.error(f"Contact form submission failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact form. Please try again or email us directly."
        )
