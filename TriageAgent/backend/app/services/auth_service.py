"""
Authentication Service
Handles user authentication and authorization
"""

from firebase_admin import auth as firebase_auth
from datetime import datetime, timedelta
from jose import jwt, JWTError
from typing import Optional, Dict, Any
from app.config import settings
from app.services.firebase_service import firebase_service
from app.utils import logger, log_info, log_error


class AuthService:
    """Authentication and authorization service"""
    
    def __init__(self):
        """Initialize auth service"""
        log_info("✓ Auth Service initialized")
    
    # ============================================
    # FIREBASE AUTHENTICATION
    # ============================================
    
    def verify_firebase_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """
        Verify Firebase ID token
        
        Args:
            id_token: Firebase ID token
        
        Returns:
            Decoded token data or None
        """
        try:
            # Verify token with 5 second clock skew tolerance
            decoded_token = firebase_auth.verify_id_token(
                id_token,
                clock_skew_seconds=5
            )
            
            log_info("Firebase token verified", uid=decoded_token.get("uid"))
            return decoded_token
            
        except firebase_auth.InvalidIdTokenError:
            log_error("Invalid Firebase token")
            return None
        except firebase_auth.ExpiredIdTokenError:
            log_error("Expired Firebase token")
            return None
        except Exception as e:
            log_error(f"Token verification failed: {str(e)}")
            return None
    
    async def create_firebase_user(
        self,
        email: str,
        password: str,
        full_name: str
    ) -> Optional[Dict[str, Any]]:
        """
        Create new Firebase user
        
        Args:
            email: User email
            password: User password
            full_name: User's full name
        
        Returns:
            User data or None
        """
        try:
            # Create Firebase user
            user = firebase_auth.create_user(
                email=email,
                password=password,
                display_name=full_name
            )
            
            log_info("Firebase user created", uid=user.uid, email=email)
            
            # Create user profile in Firestore
            user_data = {
                "uid": user.uid,
                "email": email,
                "full_name": full_name,
                "created_at": datetime.utcnow(),
            }
            
            await firebase_service.save_user_profile(user_data)
            
            return user_data
            
        except firebase_auth.EmailAlreadyExistsError:
            log_error(f"Email already exists: {email}")
            return None
        except Exception as e:
            log_error(f"User creation failed: {str(e)}")
            return None
    
    def get_firebase_user_by_email(self, email: str) -> Optional[Any]:
        """
        Get Firebase user by email
        
        Args:
            email: User email
        
        Returns:
            Firebase user or None
        """
        try:
            user = firebase_auth.get_user_by_email(email)
            return user
        except firebase_auth.UserNotFoundError:
            return None
        except Exception as e:
            log_error(f"Failed to get user: {str(e)}")
            return None
    
    # ============================================
    # JWT TOKEN MANAGEMENT
    # ============================================
    
    def create_access_token(
        self,
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create JWT access token
        
        Args:
            data: Data to encode in token
            expires_delta: Token expiration time
        
        Returns:
            JWT token string
        """
        try:
            to_encode = data.copy()
            
            # Set expiration
            if expires_delta:
                expire = datetime.utcnow() + expires_delta
            else:
                expire = datetime.utcnow() + timedelta(
                    minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
                )
            
            to_encode.update({"exp": expire})
            
            # Create JWT token
            encoded_jwt = jwt.encode(
                to_encode,
                settings.SECRET_KEY,
                algorithm=settings.ALGORITHM
            )
            
            return encoded_jwt
            
        except Exception as e:
            log_error(f"Token creation failed: {str(e)}")
            raise
    
    def verify_access_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verify JWT access token
        
        Args:
            token: JWT token
        
        Returns:
            Decoded token data or None
        """
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            
            return payload
            
        except JWTError as e:
            log_error(f"Token verification failed: {str(e)}")
            return None
    
    # ============================================
    # USER PROFILE MANAGEMENT
    # ============================================
    
    async def get_user_profile(self, uid: str) -> Optional[Dict[str, Any]]:
        """
        Get user profile from Firestore
        
        Args:
            uid: User ID
        
        Returns:
            User profile data or None
        """
        try:
            profile = await firebase_service.get_user_profile(uid)
            return profile
        except Exception as e:
            log_error(f"Failed to get user profile: {str(e)}")
            return None
    
    async def create_user_profile(
        self,
        uid: str,
        email: str,
        full_name: str
    ) -> Dict[str, Any]:
        """
        Create user profile in Firestore
        
        Args:
            uid: User ID
            email: User email
            full_name: User's full name
        
        Returns:
            Created user profile
        """
        try:
            user_data = {
                "uid": uid,
                "email": email,
                "full_name": full_name,
                "created_at": datetime.utcnow(),
                "role": "user",
            }
            
            await firebase_service.save_user_profile(user_data)
            
            log_info("User profile created", uid=uid, email=email)
            
            return user_data
            
        except Exception as e:
            log_error(f"Failed to create user profile: {str(e)}")
            raise
    
    async def update_user_profile(
        self,
        uid: str,
        updates: Dict[str, Any]
    ) -> bool:
        """
        Update user profile
        
        Args:
            uid: User ID
            updates: Fields to update
        
        Returns:
            Success boolean
        """
        try:
            # Add updated_at timestamp
            updates["updated_at"] = datetime.utcnow()
            
            # Get existing profile
            profile = await self.get_user_profile(uid)
            if not profile:
                return False
            
            # Merge updates
            profile.update(updates)
            
            # Save
            await firebase_service.save_user_profile(profile)
            
            log_info("User profile updated", uid=uid)
            return True
            
        except Exception as e:
            log_error(f"Failed to update user profile: {str(e)}")
            return False


# Create singleton instance
auth_service = AuthService()