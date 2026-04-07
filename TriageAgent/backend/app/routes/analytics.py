"""
Analytics Routes
Statistics and insights endpoints
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.analytics_service import analytics_service
from app.utils import logger, log_info, log_error
from typing import Optional

router = APIRouter()
security = HTTPBearer()


@router.get("/analytics/stats")
async def get_analytics_stats(
    days: int = Query(7, ge=1, le=90, description="Number of days to analyze"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get triage analytics statistics
    
    Args:
        days: Number of days to analyze (1-90)
        credentials: Optional authentication
    
    Returns:
        Analytics statistics
    """
    try:
        log_info(f"Fetching analytics for {days} days")
        
        stats = await analytics_service.get_triage_stats(days=days)
        
        return stats
        
    except Exception as e:
        log_error(f"Failed to get analytics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve analytics: {str(e)}"
        )


@router.get("/analytics/dashboard")
async def get_dashboard_summary(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get complete dashboard summary
    
    Args:
        credentials: Optional authentication
    
    Returns:
        Comprehensive dashboard data
    """
    try:
        log_info("Fetching dashboard summary")
        
        summary = await analytics_service.get_dashboard_summary()
        
        return summary
        
    except Exception as e:
        log_error(f"Failed to get dashboard summary: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve dashboard summary: {str(e)}"
        )


@router.get("/analytics/urgency")
async def get_urgency_distribution(
    days: int = Query(30, ge=1, le=90, description="Number of days to analyze"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get message distribution by urgency level
    
    Args:
        days: Number of days to analyze
        credentials: Optional authentication
    
    Returns:
        Urgency distribution
    """
    try:
        distribution = await analytics_service.get_urgency_distribution(days=days)
        
        return {
            "period_days": days,
            "distribution": distribution
        }
        
    except Exception as e:
        log_error(f"Failed to get urgency distribution: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve urgency distribution: {str(e)}"
        )


@router.get("/analytics/intent")
async def get_intent_distribution(
    days: int = Query(30, ge=1, le=90, description="Number of days to analyze"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get message distribution by intent
    
    Args:
        days: Number of days to analyze
        credentials: Optional authentication
    
    Returns:
        Intent distribution
    """
    try:
        distribution = await analytics_service.get_intent_distribution(days=days)
        
        return {
            "period_days": days,
            "distribution": distribution
        }
        
    except Exception as e:
        log_error(f"Failed to get intent distribution: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve intent distribution: {str(e)}"
        )


@router.get("/analytics/performance")
async def get_performance_metrics(
    days: int = Query(7, ge=1, le=90, description="Number of days to analyze"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get performance metrics
    
    Args:
        days: Number of days to analyze
        credentials: Optional authentication
    
    Returns:
        Performance metrics including response times and approval rate
    """
    try:
        # Get response time stats
        response_times = await analytics_service.get_response_time_stats(days=days)
        
        # Get approval rate
        approval_rate = await analytics_service.get_approval_rate(days=days)
        
        return {
            "period_days": days,
            "response_times": response_times,
            "approval_rate": approval_rate
        }
        
    except Exception as e:
        log_error(f"Failed to get performance metrics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve performance metrics: {str(e)}"
        )


@router.get("/analytics/trending")
async def get_trending_intents(
    days: int = Query(7, ge=1, le=30, description="Number of days to analyze"),
    limit: int = Query(5, ge=1, le=10, description="Number of top intents"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get trending message intents
    
    Args:
        days: Number of days to analyze
        limit: Number of top intents to return
        credentials: Optional authentication
    
    Returns:
        Trending intents
    """
    try:
        trending = await analytics_service.get_trending_intents(
            days=days,
            limit=limit
        )
        
        return {
            "period_days": days,
            "trending_intents": trending
        }
        
    except Exception as e:
        log_error(f"Failed to get trending intents: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve trending intents: {str(e)}"
        )