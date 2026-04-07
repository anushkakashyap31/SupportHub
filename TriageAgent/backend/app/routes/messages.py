"""
Messages Routes
CRUD operations for triage messages
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.firebase_service import firebase_service
from app.utils import logger, log_info, log_error
from typing import Optional, List
from datetime import datetime

router = APIRouter()
security = HTTPBearer()


@router.get("/messages")
async def get_messages(
    limit: int = Query(50, ge=1, le=100, description="Maximum number of results"),
    status: Optional[str] = Query(None, description="Filter by status"),
    urgency: Optional[str] = Query(None, description="Filter by urgency"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get triage messages with optional filters
    
    Args:
        limit: Maximum number of results (1-100)
        status: Filter by status (pending_review, approved, rejected, sent)
        urgency: Filter by urgency (critical, high, normal, low)
        credentials: Optional authentication
    
    Returns:
        List of triage results
    """
    try:
        log_info("Fetching messages", limit=limit, status=status, urgency=urgency)
        
        # Get from database
        results = await firebase_service.get_triage_results(
            limit=limit,
            status=status,
            urgency=urgency
        )
        
        return {
            "count": len(results),
            "messages": results
        }
        
    except Exception as e:
        log_error(f"Failed to fetch messages: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch messages: {str(e)}"
        )


@router.get("/messages/{triage_id}")
async def get_message(
    triage_id: str,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get specific message by ID
    
    Args:
        triage_id: Triage result ID
        credentials: Optional authentication
    
    Returns:
        Triage result
    """
    try:
        result = await firebase_service.get_triage_result(triage_id)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Message {triage_id} not found"
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        log_error(f"Failed to get message: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve message: {str(e)}"
        )


@router.put("/messages/{triage_id}/status")
async def update_message_status(
    triage_id: str,
    status: str = Query(..., description="New status"),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Update message status
    
    Args:
        triage_id: Triage result ID
        status: New status value
        credentials: Optional authentication
    
    Returns:
        Success message
    """
    try:
        # Validate status
        valid_statuses = ["pending_review", "approved", "rejected", "sent", "archived"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        # Update in database
        success = await firebase_service.update_triage_status(
            triage_id=triage_id,
            status=status
        )
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail=f"Message {triage_id} not found"
            )
        
        log_info("Message status updated", triage_id=triage_id, status=status)
        
        return {
            "message": "Status updated successfully",
            "triage_id": triage_id,
            "new_status": status
        }
        
    except HTTPException:
        raise
    except Exception as e:
        log_error(f"Failed to update status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update status: {str(e)}"
        )