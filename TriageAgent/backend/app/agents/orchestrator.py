"""
Orchestrator Agent
Coordinates all agents to perform complete triage workflow
"""

from app.agents.classifier_agent import classifier_agent
from app.agents.ner_agent import ner_agent
from app.agents.response_agent import response_agent
from app.agents.router_agent import router_agent
from app.models.schemas import MessageInput, TriageResult, TriageStatus
from app.models.enums import UrgencyLevel, IntentCategory
from app.utils import logger, log_info, log_error, generate_triage_id
from app.services.firebase_service import firebase_service
from datetime import datetime
from typing import Dict, Any
import asyncio


class TriageOrchestrator:
    """
    Main orchestrator that coordinates all triage agents
    
    Workflow:
    1. Classify message (urgency + intent)
    2. Extract entities (NER)
    3. Generate draft response
    4. Route to department
    5. Save to database
    """
    
    def __init__(self):
        """Initialize orchestrator with all agents"""
        self.classifier = classifier_agent
        self.ner = ner_agent
        self.responder = response_agent
        self.router = router_agent
        
        log_info("✓ Triage Orchestrator initialized")
    
    async def process(self, message_input: MessageInput) -> TriageResult:
        """
        Process message through complete triage workflow
        
        Args:
            message_input: Input message data
        
        Returns:
            Complete triage result
        """
        try:
            triage_id = generate_triage_id()
            start_time = datetime.utcnow()
            
            log_info("Starting triage process",
                    triage_id=triage_id,
                    message_length=len(message_input.text))
            
            # Step 1: Classify message
            log_info("Step 1: Classifying message", triage_id=triage_id)
            classification = await self.classifier.classify(message_input.text)
            
            # Step 2: Extract entities (run in parallel with classification if needed)
            log_info("Step 2: Extracting entities", triage_id=triage_id)
            entities = await self.ner.extract(message_input.text)
            
            # Step 3: Generate response
            log_info("Step 3: Generating response", triage_id=triage_id)
            draft_response = await self.responder.generate(
                message=message_input.text,
                classification=classification,
                entities=entities
            )
            
            # Step 4: Route to department
            log_info("Step 4: Routing message", triage_id=triage_id)
            routing = self.router.route(classification)
            
            # Calculate processing time
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            
            # Create triage result
            result = TriageResult(
                triage_id=triage_id,
                message=message_input.text,
                classification=classification,
                entities=entities,
                draft_response=draft_response,
                routing=routing,
                status=TriageStatus.PENDING_REVIEW,
                created_at=datetime.utcnow(),
                metadata={
                    "sender_email": message_input.sender_email,
                    "sender_name": message_input.sender_name,
                    "processing_time_seconds": processing_time,
                    "user_id": (message_input.metadata or {}).get("user_id"),
                    **(message_input.metadata or {})
                }
            )
            
            # Step 5: Save to database
            log_info("Step 5: Saving to database", triage_id=triage_id)
            await self._save_result(result)
            
            log_info("Triage process complete",
                    triage_id=triage_id,
                    urgency=classification.urgency.value,
                    intent=classification.intent.value,
                    processing_time=processing_time)
            
            return result
            
        except Exception as e:
            log_error(f"Triage process failed: {str(e)}")
            raise
    
    async def _save_result(self, result: TriageResult) -> None:
        """
        Save triage result to database
        
        Args:
            result: Triage result to save
        """
        try:
            # Convert to dict for Firebase
            result_dict = {
                "triage_id": result.triage_id,
                "message": result.message,
                "classification": {
                    "urgency": result.classification.urgency.value,
                    "intent": result.classification.intent.value,
                    "confidence": result.classification.confidence,
                    "reasoning": result.classification.reasoning,
                },
                "entities": {
                    "persons": result.entities.persons,
                    "organizations": result.entities.organizations,
                    "dates": result.entities.dates,
                    "amounts": result.entities.amounts,
                    "emails": result.entities.emails,
                    "phone_numbers": result.entities.phone_numbers,
                    "receipt_ids": result.entities.receipt_ids,
                    "case_numbers": result.entities.case_numbers,
                },
                "draft_response": result.draft_response,
                "routing": {
                    "department": result.routing.department.value,
                    "priority": result.routing.priority,
                    "suggested_assignee": result.routing.suggested_assignee,
                },
                "status": result.status.value,
                "created_at": result.created_at,
                "metadata": result.metadata,
            }
            
            # Save to Firebase
            await firebase_service.save_triage_result(result_dict)
            
        except Exception as e:
            log_error(f"Failed to save triage result: {str(e)}")
            # Don't raise - we still want to return the result to the user
    
    async def process_batch(
        self,
        messages: list[MessageInput]
    ) -> list[TriageResult]:
        """
        Process multiple messages in batch
        
        Args:
            messages: List of message inputs
        
        Returns:
            List of triage results
        """
        try:
            log_info(f"Processing batch of {len(messages)} messages")
            
            # Process all messages concurrently
            tasks = [self.process(msg) for msg in messages]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Filter out exceptions
            successful_results = [
                r for r in results
                if isinstance(r, TriageResult)
            ]
            
            log_info(f"Batch processing complete: {len(successful_results)}/{len(messages)} successful")
            
            return successful_results
            
        except Exception as e:
            log_error(f"Batch processing failed: {str(e)}")
            return []
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get orchestrator statistics
        
        Returns:
            Statistics dictionary
        """
        return {
            "agents": {
                "classifier": "active",
                "ner": "active",
                "responder": "active",
                "router": "active",
            },
            "status": "operational",
        }


# Create singleton instance
triage_orchestrator = TriageOrchestrator()