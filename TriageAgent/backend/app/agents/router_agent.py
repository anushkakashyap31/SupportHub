"""
Router Agent
Routes messages to appropriate departments
"""

from app.models.enums import (
    IntentCategory,
    DepartmentType,
    UrgencyLevel,
    INTENT_TO_DEPARTMENT,
    URGENCY_PRIORITY
)
from app.models.schemas import RoutingDecision, Classification
from app.utils import logger, log_info, log_error


class RouterAgent:
    """Agent for routing messages to departments"""
    
    def __init__(self):
        """Initialize router agent"""
        log_info("✓ Router Agent initialized")
    
    def route(self, classification: Classification) -> RoutingDecision:
        """
        Route message to appropriate department
        
        Args:
            classification: Message classification
        
        Returns:
            RoutingDecision object
        """
        try:
            # Determine department based on intent
            department = INTENT_TO_DEPARTMENT.get(
                classification.intent,
                DepartmentType.GENERAL
            )
            
            # Get priority from urgency
            priority = URGENCY_PRIORITY.get(
                classification.urgency,
                3
            )
            
            # Create routing decision
            routing = RoutingDecision(
                department=department,
                priority=priority,
                suggested_assignee=self._suggest_assignee(
                    department,
                    classification.urgency
                )
            )
            
            log_info("Message routed",
                    department=routing.department.value,
                    priority=routing.priority)
            
            return routing
            
        except Exception as e:
            log_error(f"Routing failed: {str(e)}")
            
            # Return default routing
            return RoutingDecision(
                department=DepartmentType.GENERAL,
                priority=3,
                suggested_assignee=None
            )
    
    def _suggest_assignee(
        self,
        department: DepartmentType,
        urgency: UrgencyLevel
    ) -> str:
        """
        Suggest team member for assignment
        
        Args:
            department: Target department
            urgency: Message urgency
        
        Returns:
            Suggested assignee (team/role)
        """
        # In a real system, this would query a database
        # For now, return role-based suggestions
        
        if urgency == UrgencyLevel.CRITICAL:
            return f"{department.value}_senior_team"
        elif urgency == UrgencyLevel.HIGH:
            return f"{department.value}_team_lead"
        else:
            return f"{department.value}_team"


# Create singleton instance
router_agent = RouterAgent()