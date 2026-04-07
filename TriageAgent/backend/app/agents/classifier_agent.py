"""
Classifier Agent
Classifies message urgency and intent using LLM
"""

from app.services.llm_service import llm_service
from app.models.enums import UrgencyLevel, IntentCategory, URGENCY_PRIORITY
from app.models.schemas import Classification
from app.utils import logger, log_info, log_error
from typing import Dict, Any


class ClassifierAgent:
    """Agent for message classification"""
    
    def __init__(self):
        """Initialize classifier agent"""
        self.llm = llm_service
        log_info("✓ Classifier Agent initialized")
    
    async def classify(self, message: str) -> Classification:
        """
        Classify message urgency and intent
        
        Args:
            message: Message text to classify
        
        Returns:
            Classification object
        """
        try:
            log_info("Classifying message", length=len(message))
            
            # Use LLM to classify
            result = await self.llm.classify_message(message)
            
            # Parse and validate
            classification = Classification(
                urgency=UrgencyLevel(result["urgency"]),
                intent=IntentCategory(result["intent"]),
                confidence=result["confidence"],
                reasoning=result["reasoning"]
            )
            
            log_info("Classification complete",
                    urgency=classification.urgency.value,
                    intent=classification.intent.value,
                    confidence=classification.confidence)
            
            return classification
            
        except Exception as e:
            log_error(f"Classification failed: {str(e)}")
            
            # Return fallback classification
            return Classification(
                urgency=UrgencyLevel.NORMAL,
                intent=IntentCategory.QUESTION,
                confidence=0.5,
                reasoning=f"Classification failed: {str(e)}, using default values"
            )
    
    def get_priority(self, urgency: UrgencyLevel) -> int:
        """
        Get priority number from urgency level
        
        Args:
            urgency: Urgency level
        
        Returns:
            Priority (1=highest, 4=lowest)
        """
        return URGENCY_PRIORITY.get(urgency, 3)


# Create singleton instance
classifier_agent = ClassifierAgent()