from typing import Dict, Optional
from datetime import datetime, timedelta
from fastapi import HTTPException, status
import asyncio
import logging

logger = logging.getLogger(__name__)

class InMemoryRateLimiter:
    """Simple in-memory rate limiter for development"""
    def __init__(self):
        self.attempts: Dict[str, Dict[str, any]] = {}
        self.cleanup_interval = 3600  # 1 hour
        self.max_attempts = {
            "login": 100,  # 100 login attempts per hour (development)
            "register": 50,  # 50 registration attempts per hour (development)
            "api": 1000,  # 1000 API calls per hour (development)
        }
        self.window_duration = {
            "login": 3600,  # 1 hour
            "register": 3600,  # 1 hour  
            "api": 3600,  # 1 hour
        }
    
    def _get_key(self, operation: str, identifier: str) -> str:
        """Generate rate limit key"""
        return f"{operation}:{identifier}"
    
    def _cleanup_expired(self):
        """Remove expired entries"""
        now = datetime.utcnow()
        expired_keys = []
        
        for key, data in self.attempts.items():
            if now - data["first_attempt"] > timedelta(seconds=self.cleanup_interval):
                expired_keys.append(key)
        
        for key in expired_keys:
            del self.attempts[key]
    
    async def check_rate_limit(self, operation: str, identifier: str):
        """Check if request is within rate limit"""
        self._cleanup_expired()
        
        key = self._get_key(operation, identifier)
        now = datetime.utcnow()
        
        max_attempts = self.max_attempts.get(operation, 100)
        window_duration = self.window_duration.get(operation, 3600)
        
        if key not in self.attempts:
            return  # First attempt, allow
        
        data = self.attempts[key]
        time_window = timedelta(seconds=window_duration)
        
        # Reset counter if window has passed
        if now - data["first_attempt"] > time_window:
            del self.attempts[key]
            return
        
        # Check if limit exceeded
        if data["count"] >= max_attempts:
            remaining_time = int((data["first_attempt"] + time_window - now).total_seconds())
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Try again in {remaining_time} seconds."
            )
    
    async def increment(self, operation: str, identifier: str):
        """Increment attempt counter"""
        key = self._get_key(operation, identifier)
        now = datetime.utcnow()
        
        if key not in self.attempts:
            self.attempts[key] = {
                "count": 1,
                "first_attempt": now,
                "last_attempt": now
            }
        else:
            self.attempts[key]["count"] += 1
            self.attempts[key]["last_attempt"] = now
    
    async def reset(self, operation: str, identifier: str):
        """Reset rate limit for identifier"""
        key = self._get_key(operation, identifier)
        if key in self.attempts:
            del self.attempts[key]
    
    async def reset_all(self):
        """Reset all rate limits (for development)"""
        self.attempts.clear()
        logger.info("All rate limits reset")

# Create rate limiter instance
rate_limiter = InMemoryRateLimiter()
