"""
NER Agent
Extracts named entities from messages using hybrid approach
"""

from app.services.ner_service import ner_service
from app.models.schemas import EntityExtraction
from app.utils import logger, log_info, log_error
from typing import Dict, List, Any


class NERAgent:
    """Agent for Named Entity Recognition"""
    
    def __init__(self):
        """Initialize NER agent"""
        self.ner = ner_service
        log_info("✓ NER Agent initialized")
    
    async def extract(self, message: str) -> EntityExtraction:
        """
        Extract entities from message
        
        Args:
            message: Message text
        
        Returns:
            EntityExtraction object
        """
        try:
            log_info("Extracting entities", length=len(message))
            
            # Use hybrid NER service
            entities = await self.ner.extract_entities(message)
            
            # Create EntityExtraction object
            extraction = EntityExtraction(
                persons=entities.get("persons", []),
                organizations=entities.get("organizations", []),
                dates=entities.get("dates", []),
                amounts=entities.get("amounts", []),
                emails=entities.get("emails", []),
                phone_numbers=entities.get("phone_numbers", []),
                receipt_ids=entities.get("receipt_ids", []),
                case_numbers=entities.get("case_numbers", []),
            )
            
            # Log summary
            total_entities = sum([
                len(extraction.persons),
                len(extraction.organizations),
                len(extraction.dates),
                len(extraction.amounts),
                len(extraction.emails),
                len(extraction.phone_numbers),
                len(extraction.receipt_ids),
                len(extraction.case_numbers),
            ])
            
            log_info("Entity extraction complete",
                    total_entities=total_entities,
                    persons=len(extraction.persons),
                    amounts=len(extraction.amounts))
            
            return extraction
            
        except Exception as e:
            log_error(f"Entity extraction failed: {str(e)}")
            
            # Return empty extraction
            return EntityExtraction(
                persons=[],
                organizations=[],
                dates=[],
                amounts=[],
                emails=[],
                phone_numbers=[],
                receipt_ids=[],
                case_numbers=[],
            )


# Create singleton instance
ner_agent = NERAgent()