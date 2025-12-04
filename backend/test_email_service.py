"""
Test email service initialization
Run this to verify SendGrid is configured correctly
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("EMAIL SERVICE CONFIGURATION TEST")
print("=" * 60)

# Check environment variables
sendgrid_key = os.getenv("SENDGRID_API_KEY")
from_email = os.getenv("FROM_EMAIL")
from_name = os.getenv("FROM_NAME")

print("\n1. ENVIRONMENT VARIABLES:")
print(f"   SENDGRID_API_KEY: {'✅ SET' if sendgrid_key else '❌ NOT SET'}")
if sendgrid_key:
    print(f"   Key starts with: {sendgrid_key[:10]}...")
print(f"   FROM_EMAIL: {from_email if from_email else '❌ NOT SET'}")
print(f"   FROM_NAME: {from_name if from_name else '❌ NOT SET'}")

if not sendgrid_key:
    print("\n❌ SENDGRID_API_KEY is not set!")
    print("   Add it to your .env file or environment variables")
    exit(1)

print("\n2. TESTING SENDGRID INITIALIZATION:")
try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail, Email
    
    sg = SendGridAPIClient(api_key=sendgrid_key)
    print("   ✅ SendGrid client initialized successfully")
    
    # Create from email
    from_email_obj = Email(from_email, from_name)
    print(f"   ✅ From email created: {from_email}")
    
except Exception as e:
    print(f"   ❌ Failed to initialize SendGrid: {e}")
    exit(1)

print("\n3. TESTING EMAIL SENDING:")
test_email = input("Enter email to send test to (press Enter to skip): ").strip()

if test_email:
    try:
        html_content = """
        <html>
        <body>
            <h1>Test Email</h1>
            <p>This is a test email from your Asha Store backend.</p>
            <p>If you received this, your email service is working correctly! ✅</p>
        </body>
        </html>
        """
        
        message = Mail(
            from_email=from_email_obj,
            to_emails=test_email,
            subject="Test Email - Asha Store",
            html_content=html_content
        )
        
        response = sg.send(message)
        print(f"\n   ✅ Email sent successfully!")
        print(f"   Status code: {response.status_code}")
        print(f"   Check your inbox: {test_email}")
        
    except Exception as e:
        print(f"\n   ❌ Failed to send email: {e}")
else:
    print("   Skipped email test")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
