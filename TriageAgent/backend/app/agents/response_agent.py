"""
Response Agent
Generates contextually appropriate draft responses
"""

from app.services.llm_service import llm_service
from app.models.enums import UrgencyLevel, IntentCategory
from app.models.schemas import Classification, EntityExtraction
from app.utils import logger, log_info, log_error
from typing import Dict, Any


class ResponseAgent:
    """Agent for generating draft responses"""
    
    def __init__(self):
        """Initialize response agent"""
        self.llm = llm_service
        log_info("✓ Response Agent initialized")
    
    async def generate(
        self,
        message: str,
        classification: Classification,
        entities: EntityExtraction
    ) -> str:
        """
        Generate draft response
        
        Args:
            message: Original message
            classification: Classification result
            entities: Extracted entities
        
        Returns:
            Draft response text
        """
        try:
            log_info("Generating response",
                    urgency=classification.urgency.value,
                    intent=classification.intent.value)
            
            # Convert entities to dict for LLM
            entities_dict = {
                "persons": entities.persons,
                "organizations": entities.organizations,
                "dates": entities.dates,
                "amounts": entities.amounts,
                "emails": entities.emails,
                "phone_numbers": entities.phone_numbers,
                "receipt_ids": entities.receipt_ids,
                "case_numbers": entities.case_numbers,
            }
            
            # Generate response using LLM
            response = await self.llm.generate_response(
                message=message,
                urgency=classification.urgency.value,
                intent=classification.intent.value,
                entities=entities_dict
            )
            
            log_info("Response generated", length=len(response))
            
            return response
            
        except Exception as e:
            log_error(f"Response generation failed: {str(e)}")
            
            # Return fallback response
            return self._get_fallback_response(
                classification.urgency,
                classification.intent
            )
    
    def _get_fallback_response(
        self,
        urgency: UrgencyLevel,
        intent: IntentCategory
    ) -> str:
        """
        Generate simple fallback response
        
        Args:
            urgency: Urgency level
            intent: Intent category
        
        Returns:
            Fallback response text
        """
        # Intent-based templates
        templates = {
            IntentCategory.DONATION: (
                "Dear Friend,\n\n"
                "Thank you for contacting us regarding your donation. "
                "We appreciate your generosity and support. "
                "Our team is reviewing your inquiry and will respond within 24 hours.\n\n"
                "With gratitude,\n"
                "The Team"
            ),
            IntentCategory.VOLUNTEER: (
                "Dear Friend,\n\n"
                "Thank you for your interest in volunteering with us! "
                "We're excited about your willingness to help. "
                "Our volunteer coordinator will reach out within 48 hours "
                "with more information about upcoming opportunities.\n\n"
                "Best regards,\n"
                "The Team"
            ),
            IntentCategory.COMPLAINT: (
                "Dear Friend,\n\n"
                "We sincerely apologize for any inconvenience you've experienced. "
                "Your feedback is important to us, and we take your concerns seriously. "
                "Our team is investigating this matter and will respond within 24 hours "
                "with a resolution.\n\n"
                "Thank you for bringing this to our attention.\n\n"
                "Sincerely,\n"
                "The Team"
            ),
            IntentCategory.QUESTION: (
                "Dear Friend,\n\n"
                "Thank you for reaching out with your question. "
                "We've received your inquiry and are gathering the information "
                "you need. We'll respond within 24-48 hours.\n\n"
                "Best regards,\n"
                "The Team"
            ),
            IntentCategory.FEEDBACK: (
                "Dear Friend,\n\n"
                "Thank you so much for your kind words and feedback! "
                "Messages like yours inspire us to continue our important work. "
                "We're grateful for supporters like you.\n\n"
                "With appreciation,\n"
                "The Team"
            ),
            IntentCategory.PARTNERSHIP: (
                "Dear Friend,\n\n"
                "Thank you for your interest in partnering with us. "
                "We're always looking for meaningful collaborations that align "
                "with our mission. Our partnerships team will review your inquiry "
                "and respond within 3-5 business days.\n\n"
                "Best regards,\n"
                "The Team"
            ),
            IntentCategory.EVENT: (
                "Dear Friend,\n\n"
                "Thank you for your interest in our events! "
                "We'll send you more information about upcoming opportunities "
                "within 24-48 hours.\n\n"
                "We look forward to seeing you!\n\n"
                "Best regards,\n"
                "The Team"
            ),
        }
        
        # Get template or default
        response = templates.get(
            intent,
            "Dear Friend,\n\n"
            "Thank you for contacting us. We've received your message "
            "and will respond shortly.\n\n"
            "Best regards,\n"
            "The Team"
        )
        
        # Add urgency note if critical
        if urgency == UrgencyLevel.CRITICAL:
            response = response.replace(
                "We've received your message",
                "We've received your urgent message and are treating it as a priority"
            )
        
        return response


# Create singleton instance
response_agent = ResponseAgent()