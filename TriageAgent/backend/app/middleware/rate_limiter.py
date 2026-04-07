"""
Rate Limiting Middleware
Simple in-memory rate limiter for API protection
"""

from fastapi import Request, HTTPException
from datetime import datetime, timedelta
from typing import Dict, Tuple
from app.utils import log_warning
import time


class RateLimiter:
    """
    Simple in-memory rate limiter
    
    Tracks requests per IP address
    """
    
    def __init__(self):
        # Store: {ip_address: [(timestamp, count)]}
        self.requests: Dict[str, list] = {}
        
        # Rate limits
        self.limits = {
            "per_minute": 60,
            "per_hour": 1000,
        }
    
    def _clean_old_requests(self, ip: str, window_seconds: int):
        """Remove requests older than window"""
        if ip not in self.requests:
            return
        
        cutoff = datetime.utcnow() - timedelta(seconds=window_seconds)
        self.requests[ip] = [
            req for req in self.requests[ip]
            if req[0] > cutoff
        ]
    
    def check_rate_limit(
        self,
        ip: str,
        limit: int = 60,
        window_seconds: int = 60
    ) -> Tuple[bool, int]:
        """
        Check if request is within rate limit
        
        Args:
            ip: Client IP address
            limit: Maximum requests allowed
            window_seconds: Time window in seconds
        
        Returns:
            Tuple of (allowed: bool, remaining: int)
        """
        # Clean old requests
        self._clean_old_requests(ip, window_seconds)
        
        # Initialize if new IP
        if ip not in self.requests:
            self.requests[ip] = []
        
        # Count requests in window
        request_count = len(self.requests[ip])
        
        # Check limit
        if request_count >= limit:
            return False, 0
        
        # Add current request
        self.requests[ip].append((datetime.utcnow(), 1))
        
        remaining = limit - request_count - 1
        return True, remaining
    
    async def __call__(self, request: Request):
        """
        Middleware function to check rate limits
        
        Args:
            request: FastAPI request
        
        Raises:
            HTTPException: If rate limit exceeded
        """
        # Get client IP
        client_ip = request.client.host
        
        # Check per-minute limit
        allowed, remaining = self.check_rate_limit(
            ip=client_ip,
            limit=self.limits["per_minute"],
            window_seconds=60
        )
        
        if not allowed:
            log_warning(f"Rate limit exceeded for IP: {client_ip}")
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later.",
                headers={"Retry-After": "60"}
            )
        
        # Add rate limit headers to response
        request.state.rate_limit_remaining = remaining


# Create singleton instance
rate_limiter = RateLimiter()


# Simple decorator for rate limiting specific endpoints
def rate_limit(max_requests: int = 10, window: int = 60):
    """
    Decorator for rate limiting specific endpoints
    
    Args:
        max_requests: Maximum requests allowed
        window: Time window in seconds
    
    Usage:
        @router.post("/endpoint")
        @rate_limit(max_requests=5, window=60)
        async def my_endpoint():
            ...
    """
    def decorator(func):
        async def wrapper(request: Request, *args, **kwargs):
            client_ip = request.client.host
            
            allowed, remaining = rate_limiter.check_rate_limit(
                ip=client_ip,
                limit=max_requests,
                window_seconds=window
            )
            
            if not allowed:
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Max {max_requests} requests per {window} seconds.",
                    headers={"Retry-After": str(window)}
                )
            
            return await func(request, *args, **kwargs)
        
        return wrapper
    return decorator