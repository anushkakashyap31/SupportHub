"""
Authentication Routes
User authentication and authorization
"""

from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import auth_service
from app.models.schemas import UserCreate, UserLogin, Token, User
from app.utils import logger, log_info, log_error
from pydantic import BaseModel, EmailStr
from datetime import timedelta

router = APIRouter()
security = HTTPBearer()


class RegisterRequest(BaseModel):
    """Request model for backend registration"""
    email: EmailStr
    password: str
    full_name: str


class EmailLoginRequest(BaseModel):
    """Request model for email/password login"""
    email: EmailStr
    password: str


@router.post("/register", response_model=Token)
async def register(user_data: RegisterRequest):
    """
    Register a new user
    
    Creates Firebase user and returns access token.
    Works directly from Postman/API without frontend.
    
    Args:
        user_data: User registration data
    
    Returns:
        Access token
    """
    try:
        log_info("User registration attempt", email=user_data.email)
        
        # Create Firebase user
        user = await auth_service.create_firebase_user(
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name
        )
        
        if not user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered or registration failed"
            )
        
        # Generate access token
        access_token = auth_service.create_access_token(
            data={"sub": user["uid"], "email": user["email"]}
        )
        
        log_info("User registered successfully", uid=user["uid"])
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        log_error(f"Registration failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login-email", response_model=Token)
async def login_with_email(credentials: EmailLoginRequest):
    """
    Login with email and password
    
    Simplified login for API testing without Firebase SDK.
    
    Args:
        credentials: Email and password
    
    Returns:
        Access token
    """
    try:
        log_info("Email login attempt", email=credentials.email)
        
        # Get user by email
        firebase_user = auth_service.get_firebase_user_by_email(credentials.email)
        
        if not firebase_user:
            raise HTTPException(
                status_code=404,
                detail="User not found. Please register first."
            )
        
        # Get user profile
        user_profile = await auth_service.get_user_profile(firebase_user.uid)
        
        if not user_profile:
            # Create profile if doesn't exist
            user_profile = await auth_service.create_user_profile(
                uid=firebase_user.uid,
                email=credentials.email,
                full_name=firebase_user.display_name or "User"
            )
        
        # Generate access token
        access_token = auth_service.create_access_token(
            data={"sub": firebase_user.uid, "email": credentials.email}
        )
        
        log_info("Login successful", email=credentials.email)
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        log_error(f"Login failed: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(id_token: str = Body(..., embed=True)):
    """
    Login with Firebase ID token (for frontend)
    
    Args:
        id_token: Firebase ID token
    
    Returns:
        Access token
    """
    try:
        log_info("Firebase token login attempt")
        
        # Verify Firebase token
        decoded_token = auth_service.verify_firebase_token(id_token)
        
        if not decoded_token:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )
        
        uid = decoded_token["uid"]
        email = decoded_token.get("email", "")
        
        # Get or create user profile
        user_profile = await auth_service.get_user_profile(uid)
        
        if not user_profile:
            user_profile = await auth_service.create_user_profile(
                uid=uid,
                email=email,
                full_name=decoded_token.get("name", email.split("@")[0])
            )
        
        # Generate access token
        access_token = auth_service.create_access_token(
            data={"sub": uid, "email": email}
        )
        
        log_info("Login successful", uid=uid)
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        log_error(f"Login failed: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        )


@router.get("/me", response_model=User)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get current user profile
    
    Args:
        credentials: Bearer token
    
    Returns:
        User profile
    """
    try:
        token = credentials.credentials
        
        # Verify token
        decoded = auth_service.verify_firebase_token(token)
        
        if not decoded:
            # Try JWT token
            decoded = auth_service.verify_access_token(token)
            
        if not decoded:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )
        
        uid = decoded.get("uid") or decoded.get("sub")
        
        # Get user profile
        user_profile = await auth_service.get_user_profile(uid)
        
        if not user_profile:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        return user_profile
        
    except HTTPException:
        raise
    except Exception as e:
        log_error(f"Failed to get current user: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )