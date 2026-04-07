"""
Enumerations for Triage System
Defines urgency levels, intent categories, and status types
"""

from enum import Enum


class UrgencyLevel(str, Enum):
    """Message urgency classification"""
    CRITICAL = "critical"  # Legal issues, fraud, emergencies
    HIGH = "high"          # Donation issues, complaints
    NORMAL = "normal"      # General inquiries
    LOW = "low"            # Newsletters, updates


class IntentCategory(str, Enum):
    """Message intent classification"""
    DONATION = "donation"              # Donation-related queries
    VOLUNTEER = "volunteer"            # Volunteer inquiries
    QUESTION = "question"              # General questions
    COMPLAINT = "complaint"            # Issues or complaints
    FEEDBACK = "feedback"              # Positive feedback
    PARTNERSHIP = "partnership"        # Partnership requests
    EVENT = "event"                    # Event-related
    OTHER = "other"                    # Uncategorized


class TriageStatus(str, Enum):
    """Triage result status"""
    PENDING_REVIEW = "pending_review"  # Awaiting human review
    APPROVED = "approved"              # Response approved
    REJECTED = "rejected"              # Response rejected
    SENT = "sent"                      # Response sent
    ARCHIVED = "archived"              # Archived


class DepartmentType(str, Enum):
    """Department routing"""
    DONATIONS = "donations"
    VOLUNTEERS = "volunteers"
    SUPPORT = "support"
    PARTNERSHIPS = "partnerships"
    EVENTS = "events"
    GENERAL = "general"


# Urgency to priority mapping
URGENCY_PRIORITY = {
    UrgencyLevel.CRITICAL: 1,
    UrgencyLevel.HIGH: 2,
    UrgencyLevel.NORMAL: 3,
    UrgencyLevel.LOW: 4,
}

# Intent to department mapping
INTENT_TO_DEPARTMENT = {
    IntentCategory.DONATION: DepartmentType.DONATIONS,
    IntentCategory.VOLUNTEER: DepartmentType.VOLUNTEERS,
    IntentCategory.COMPLAINT: DepartmentType.SUPPORT,
    IntentCategory.PARTNERSHIP: DepartmentType.PARTNERSHIPS,
    IntentCategory.EVENT: DepartmentType.EVENTS,
    IntentCategory.QUESTION: DepartmentType.GENERAL,
    IntentCategory.FEEDBACK: DepartmentType.GENERAL,
    IntentCategory.OTHER: DepartmentType.GENERAL,
}