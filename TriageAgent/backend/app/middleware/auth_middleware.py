"""
Authentication Middleware
Validates authentication tokens for protected routes
"""

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import auth_service
from app.utils import log_error
from typing import Optional


security = HTTPBearer()


async def verify_token(credentials: HTTPAuthorizationCredentials) -> dict:
    """
    Verify authentication token
    
    Args:
        credentials: Bearer token credentials
    
    Returns:
        Decoded token data
    
    Raises:
        HTTPException: If token is invalid
    """
    try:
        token = credentials.credentials
        
        # Try Firebase token first
        decoded = auth_service.verify_firebase_token(token)
        
        # If not Firebase, try JWT
        if not decoded:
            decoded = auth_service.verify_access_token(token)
        
        if not decoded:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )
        
        return decoded
        
    except Exception as e:
        log_error(f"Token verification failed: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )


async def get_current_user_id(credentials: HTTPAuthorizationCredentials) -> str:
    """
    Get current user ID from token
    
    Args:
        credentials: Bearer token credentials
    
    Returns:
        User ID
    """
    decoded = await verify_token(credentials)
    return decoded.get("uid") or decoded.get("sub")


def optional_auth(credentials: Optional[HTTPAuthorizationCredentials] = None) -> Optional[dict]:
    """
    Optional authentication - doesn't fail if no token provided
    
    Args:
        credentials: Optional bearer token
    
    Returns:
        Decoded token data or None
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        decoded = auth_service.verify_firebase_token(token)
        
        if not decoded:
            decoded = auth_service.verify_access_token(token)
        
        return decoded
    except:
        return None