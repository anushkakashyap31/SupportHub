"""
API Routes
"""

from app.routes.triage import router as triage_router
from app.routes.messages import router as messages_router
from app.routes.analytics import router as analytics_router
from app.routes.auth import router as auth_router

__all__ = [
    "triage_router",
    "messages_router",
    "analytics_router",
    "auth_router",
]