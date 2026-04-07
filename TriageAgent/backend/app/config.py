"""
Application Configuration
Loads environment variables and provides settings
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App Configuration
    APP_NAME: str = "TriageAgent"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Gemini API
    GEMINI_API_KEY: str
    
    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = "./firebase-credentials.json"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()


# Validate critical settings
def validate_settings():
    """Validate that all required settings are present"""
    
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        raise ValueError(
            "❌ GEMINI_API_KEY not set! "
            "Please add your Gemini API key to .env file"
        )
    
    if not settings.SECRET_KEY or settings.SECRET_KEY == "your-super-secret-key-change-this-in-production":
        raise ValueError(
            "❌ SECRET_KEY not set! "
            "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
        )
    
    if not os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
        print(f"⚠️  WARNING: Firebase credentials file not found at {settings.FIREBASE_CREDENTIALS_PATH}")
        print("   You'll need this file for Firebase functionality")
    
    print("✓ Configuration loaded successfully")
    print(f"  - App: {settings.APP_NAME}")
    print(f"  - Debug: {settings.DEBUG}")
    print(f"  - Gemini API: Configured")
    print(f"  - Firebase: {settings.FIREBASE_CREDENTIALS_PATH}")


# Run validation when module is imported
try:
    validate_settings()
except ValueError as e:
    print(f"\n{e}\n")
    if not settings.DEBUG:
        raise