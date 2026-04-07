"""
Pydantic Schemas for Request/Response Validation
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.enums import UrgencyLevel, IntentCategory, TriageStatus, DepartmentType


# ============================================
# REQUEST SCHEMAS
# ============================================

class MessageInput(BaseModel):
    """Input schema for incoming message"""
    text: str = Field(..., min_length=10, max_length=5000, description="Message content")
    sender_email: Optional[EmailStr] = Field(None, description="Sender's email (if available)")
    sender_name: Optional[str] = Field(None, description="Sender's name (if available)")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")


class FeedbackInput(BaseModel):
    """Feedback on triage result"""
    triage_id: str = Field(..., description="Triage result ID")
    approved: bool = Field(..., description="Was the response approved?")
    edited_response: Optional[str] = Field(None, description="Human-edited response")
    notes: Optional[str] = Field(None, description="Feedback notes")


# ============================================
# RESPONSE SCHEMAS
# ============================================

class EntityExtraction(BaseModel):
    """Extracted entities from message"""
    persons: List[str] = Field(default_factory=list, description="Person names")
    organizations: List[str] = Field(default_factory=list, description="Organization names")
    dates: List[str] = Field(default_factory=list, description="Date mentions")
    amounts: List[str] = Field(default_factory=list, description="Money amounts")
    emails: List[str] = Field(default_factory=list, description="Email addresses")
    phone_numbers: List[str] = Field(default_factory=list, description="Phone numbers")
    receipt_ids: List[str] = Field(default_factory=list, description="Receipt/Transaction IDs")
    case_numbers: List[str] = Field(default_factory=list, description="Case/Ticket numbers")


class Classification(BaseModel):
    """Message classification result"""
    urgency: UrgencyLevel = Field(..., description="Urgency level")
    intent: IntentCategory = Field(..., description="Intent category")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Classification confidence")
    reasoning: str = Field(..., description="Reasoning behind classification")


class RoutingDecision(BaseModel):
    """Department routing decision"""
    department: DepartmentType = Field(..., description="Assigned department")
    priority: int = Field(..., ge=1, le=4, description="Priority (1=highest, 4=lowest)")
    suggested_assignee: Optional[str] = Field(None, description="Suggested team member")


class TriageResult(BaseModel):
    """Complete triage result"""
    triage_id: str = Field(..., description="Unique triage ID")
    message: str = Field(..., description="Original message")
    classification: Classification = Field(..., description="Classification result")
    entities: EntityExtraction = Field(..., description="Extracted entities")
    draft_response: str = Field(..., description="AI-generated draft response")
    routing: RoutingDecision = Field(..., description="Routing decision")
    status: TriageStatus = Field(default=TriageStatus.PENDING_REVIEW, description="Current status")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class TriageStats(BaseModel):
    """Triage system statistics"""
    total_processed: int = Field(..., description="Total messages processed")
    by_urgency: Dict[str, int] = Field(..., description="Count by urgency level")
    by_intent: Dict[str, int] = Field(..., description="Count by intent category")
    by_status: Dict[str, int] = Field(..., description="Count by status")
    avg_processing_time: float = Field(..., description="Average processing time (seconds)")
    accuracy_rate: Optional[float] = Field(None, description="Human approval rate")


# ============================================
# AUTHENTICATION SCHEMAS
# ============================================

class UserCreate(BaseModel):
    """User registration"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str


class UserLogin(BaseModel):
    """User login"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Authentication token"""
    access_token: str
    token_type: str = "bearer"


class User(BaseModel):
    """User profile"""
    uid: str
    email: str
    full_name: str
    created_at: Optional[datetime] = None


# ============================================
# ANALYTICS SCHEMAS
# ============================================

class MessageSummary(BaseModel):
    """Summary of a triaged message"""
    triage_id: str
    urgency: UrgencyLevel
    intent: IntentCategory
    status: TriageStatus
    created_at: datetime
    snippet: str = Field(..., max_length=200, description="Message snippet")


class AnalyticsPeriod(BaseModel):
    """Analytics for a time period"""
    period_start: datetime
    period_end: datetime
    total_messages: int
    by_urgency: Dict[UrgencyLevel, int]
    by_intent: Dict[IntentCategory, int]
    response_time_avg: float  # in seconds
    approval_rate: float  # percentage