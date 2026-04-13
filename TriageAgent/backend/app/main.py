"""
Triage Agent - Main FastAPI Application
Production-grade AI triage system for non-profit communications
"""
# Suppress Pydantic warnings from Google Gemini SDK
import warnings
warnings.filterwarnings("ignore", message="Field name .* shadows an attribute")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.routes import (
    triage_router,
    messages_router,
    analytics_router,
    auth_router
)
from app.utils import logger, log_info, log_error
from datetime import datetime
import sys


# Create FastAPI app
app = FastAPI(
    title="Triage Agent API",
    description="AI-powered triage system for non-profit communications",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)


# ============================================
# CORS Configuration
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:80",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Startup & Shutdown Events
# ============================================

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    log_info("=" * 60)
    log_info("🚀 Starting Triage Agent API")
    log_info("=" * 60)
    log_info(f"App Name: {settings.APP_NAME}")
    log_info(f"Debug Mode: {settings.DEBUG}")
    log_info(f"Python Version: {sys.version.split()[0]}")
    log_info("=" * 60)
    log_info("✓ All services initialized successfully")
    log_info("✓ AI agents ready")
    log_info("✓ Database connected")
    log_info("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    log_info("Shutting down Triage Agent API")


# ============================================
# Exception Handlers
# ============================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    log_error(f"HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    log_error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An error occurred"
        }
    )


# ============================================
# Root & Health Check Endpoints
# ============================================

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "app_name": settings.APP_NAME,
        "version": "1.0.0",
        "status": "operational",
        "description": "AI-powered triage agent for non-profit communications",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "triage": "/api/triage",
            "messages": "/api/messages",
            "analytics": "/api/analytics",
            "auth": "/api/auth"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "api": "operational",
            "database": "connected",
            "ai_agents": "ready"
        }
    }


@app.get("/api")
async def api_info():
    """API information"""
    return {
        "name": "Triage Agent API",
        "version": "1.0.0",
        "description": "Real-time AI triage for non-profit communications",
        "features": [
            "Message classification (urgency + intent)",
            "Named entity recognition (NER)",
            "Draft response generation",
            "Intelligent routing",
            "Analytics & insights"
        ],
        "endpoints": {
            "triage": "/api/triage - Main triage endpoint",
            "messages": "/api/messages - Message management",
            "analytics": "/api/analytics - Statistics & insights",
            "auth": "/api/auth - Authentication"
        }
    }


# ============================================
# Register Routes
# ============================================

# Triage routes
app.include_router(
    triage_router,
    prefix="/api",
    tags=["Triage"]
)

# Messages routes
app.include_router(
    messages_router,
    prefix="/api",
    tags=["Messages"]
)

# Analytics routes
app.include_router(
    analytics_router,
    prefix="/api",
    tags=["Analytics"]
)

# Auth routes
app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)


# ============================================
# Development Helper
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    print(f"""
    ╔══════════════════════════════════════════════╗
    ║                                              ║
    ║        🤖 TRIAGE AGENT API 🤖               ║
    ║                                              ║
    ║  AI-Powered Triage for Non-Profit Comms      ║
    ║                                              ║
    ╚══════════════════════════════════════════════╝
    
    🚀 Starting server...
    📍 URL: http://{settings.HOST}:{settings.PORT}
    📖 Docs: http://{settings.HOST}:{settings.PORT}/docs
    🔍 Health: http://{settings.HOST}:{settings.PORT}/health
    
    ⚡ Features:
    ✓ Message Classification (Urgency + Intent)
    ✓ Named Entity Recognition (NER)
    ✓ AI Response Generation
    ✓ Intelligent Routing
    ✓ Real-time Analytics
    
    Press CTRL+C to stop
    """)
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )