"""
Triage Routes
Main endpoints for message triage operations
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.schemas import MessageInput, TriageResult, FeedbackInput
from app.agents.orchestrator import triage_orchestrator
from app.services.firebase_service import firebase_service
from app.utils import logger, log_info, log_error
from typing import Optional

router = APIRouter()
security = HTTPBearer()


@router.post("/triage", response_model=TriageResult)
async def triage_message(
    message: MessageInput,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Triage a message through AI agents
    
    Process flow:
    1. Classify urgency and intent
    2. Extract entities
    3. Generate draft response
    4. Route to department
    5. Save to database
    
    Args:
        message: Input message to triage
        credentials: Optional authentication
    
    Returns:
        Complete triage result
    """
    try:
        log_info("Triage request received",
                message_length=len(message.text))
        
        # Process through orchestrator
        result = await triage_orchestrator.process(message)
        
        return result
        
    except Exception as e:
        log_error(f"Triage failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Triage processing failed: {str(e)}"
        )


@router.get("/triage/{triage_id}", response_model=TriageResult)
async def get_triage_result(
    triage_id: str,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get triage result by ID
    
    Args:
        triage_id: Triage result ID
        credentials: Optional authentication
    
    Returns:
        Triage result
    """
    try:
        # Get from database
        result = await firebase_service.get_triage_result(triage_id)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Triage result {triage_id} not found"
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        log_error(f"Failed to get triage result: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve triage result: {str(e)}"
        )


@router.post("/triage/{triage_id}/feedback")
async def submit_feedback(
    triage_id: str,
    feedback: FeedbackInput,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Submit feedback on triage result
    
    Args:
        triage_id: Triage result ID
        feedback: Feedback data
        credentials: Optional authentication
    
    Returns:
        Success message
    """
    try:
        # Determine new status
        new_status = "approved" if feedback.approved else "rejected"
        
        # Update in database
        success = await firebase_service.update_triage_status(
            triage_id=triage_id,
            status=new_status,
            edited_response=feedback.edited_response,
            notes=feedback.notes
        )
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail=f"Triage result {triage_id} not found"
            )
        
        log_info("Feedback submitted",
                triage_id=triage_id,
                approved=feedback.approved)
        
        return {
            "message": "Feedback submitted successfully",
            "triage_id": triage_id,
            "status": new_status
        }
        
    except HTTPException:
        raise
    except Exception as e:
        log_error(f"Failed to submit feedback: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit feedback: {str(e)}"
        )


@router.get("/triage/stats/overview")
async def get_triage_stats(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    """
    Get triage system statistics
    
    Args:
        credentials: Optional authentication
    
    Returns:
        System statistics
    """
    try:
        # Get orchestrator stats
        orchestrator_stats = triage_orchestrator.get_stats()
        
        return {
            "system": orchestrator_stats,
            "status": "operational"
        }
        
    except Exception as e:
        log_error(f"Failed to get stats: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve statistics: {str(e)}"
        )