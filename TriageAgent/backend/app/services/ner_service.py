"""
NER Service - Named Entity Recognition
Hybrid approach: spaCy (fast) + LLM (context-aware)
"""

import spacy
from typing import Dict, List, Any
from app.services.llm_service import llm_service
from app.utils import logger, log_info, log_error
import re


class NERService:
    """Named Entity Recognition service using hybrid approach"""
    
    def __init__(self):
        """Initialize spaCy model"""
        try:
            # Load spaCy model
            self.nlp = spacy.load("en_core_web_sm")
            log_info("✓ NER Service initialized", model="en_core_web_sm")
        except OSError:
            log_error("spaCy model not found. Run: python -m spacy download en_core_web_sm")
            raise
    
    async def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """
        Extract entities using hybrid approach
        
        Args:
            text: Text to extract entities from
        
        Returns:
            Dictionary of extracted entities
        """
        try:
            # Step 1: Fast extraction with spaCy
            spacy_entities = self._extract_with_spacy(text)
            
            # Step 2: Context-aware extraction with LLM
            llm_entities = await self._extract_with_llm(text)
            
            # Step 3: Merge results
            merged = self._merge_entities(spacy_entities, llm_entities)
            
            log_info("Entities extracted",
                    persons=len(merged.get("persons", [])),
                    dates=len(merged.get("dates", [])),
                    amounts=len(merged.get("amounts", [])))
            
            return merged
            
        except Exception as e:
            log_error(f"Entity extraction failed: {str(e)}")
            return self._get_empty_entities()
    
    def _extract_with_spacy(self, text: str) -> Dict[str, List[str]]:
        """
        Extract entities using spaCy (fast, offline)
        
        Args:
            text: Text to process
        
        Returns:
            Extracted entities
        """
        try:
            doc = self.nlp(text)
            
            entities = {
                "persons": [],
                "organizations": [],
                "dates": [],
                "amounts": [],
            }
            
            # Extract standard entities
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    entities["persons"].append(ent.text)
                elif ent.label_ == "ORG":
                    entities["organizations"].append(ent.text)
                elif ent.label_ == "DATE":
                    entities["dates"].append(ent.text)
                elif ent.label_ == "MONEY":
                    entities["amounts"].append(ent.text)
            
            # Deduplicate
            for key in entities:
                entities[key] = list(set(entities[key]))
            
            return entities
            
        except Exception as e:
            log_error(f"spaCy extraction failed: {str(e)}")
            return {
                "persons": [],
                "organizations": [],
                "dates": [],
                "amounts": [],
            }
    
    async def _extract_with_llm(self, text: str) -> Dict[str, List[str]]:
        """
        Extract domain-specific entities using LLM
        
        Args:
            text: Text to process
        
        Returns:
            Extracted entities
        """
        try:
            # Use LLM service for context-aware extraction
            result = await llm_service.extract_entities_llm(text)
            
            return {
                "emails": result.get("emails", []),
                "phone_numbers": result.get("phone_numbers", []),
                "receipt_ids": result.get("receipt_ids", []),
                "case_numbers": result.get("case_numbers", []),
                "donation_ids": result.get("donation_ids", []),
            }
            
        except Exception as e:
            log_error(f"LLM extraction failed: {str(e)}")
            return {
                "emails": [],
                "phone_numbers": [],
                "receipt_ids": [],
                "case_numbers": [],
                "donation_ids": [],
            }
    
    def _merge_entities(
        self,
        spacy_entities: Dict[str, List[str]],
        llm_entities: Dict[str, List[str]]
    ) -> Dict[str, List[str]]:
        """
        Merge entities from both sources
        
        Args:
            spacy_entities: Entities from spaCy
            llm_entities: Entities from LLM
        
        Returns:
            Merged entity dictionary
        """
        merged = {
            # From spaCy
            "persons": spacy_entities.get("persons", []),
            "organizations": spacy_entities.get("organizations", []),
            "dates": spacy_entities.get("dates", []),
            "amounts": spacy_entities.get("amounts", []),
            # From LLM
            "emails": llm_entities.get("emails", []),
            "phone_numbers": llm_entities.get("phone_numbers", []),
            "receipt_ids": llm_entities.get("receipt_ids", []),
            "case_numbers": llm_entities.get("case_numbers", []),
            "donation_ids": llm_entities.get("donation_ids", []),
        }
        
        # Clean and deduplicate
        for key in merged:
            merged[key] = [str(item).strip() for item in merged[key] if item]
            merged[key] = list(set(merged[key]))  # Remove duplicates
        
        return merged
    
    def _get_empty_entities(self) -> Dict[str, List[str]]:
        """Return empty entity dictionary"""
        return {
            "persons": [],
            "organizations": [],
            "dates": [],
            "amounts": [],
            "emails": [],
            "phone_numbers": [],
            "receipt_ids": [],
            "case_numbers": [],
            "donation_ids": [],
        }
    
    def extract_emails_regex(self, text: str) -> List[str]:
        """
        Extract email addresses using regex (backup method)
        
        Args:
            text: Text to search
        
        Returns:
            List of email addresses
        """
        pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(pattern, text)
        return list(set(emails))
    
    def extract_phones_regex(self, text: str) -> List[str]:
        """
        Extract phone numbers using regex (backup method)
        
        Args:
            text: Text to search
        
        Returns:
            List of phone numbers
        """
        # Multiple phone patterns
        patterns = [
            r'\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}',  # US format
            r'\([0-9]{3}\)\s*[0-9]{3}-[0-9]{4}',  # (123) 456-7890
            r'[0-9]{3}-[0-9]{3}-[0-9]{4}',  # 123-456-7890
        ]
        
        phones = []
        for pattern in patterns:
            matches = re.findall(pattern, text)
            phones.extend(matches)
        
        return list(set(phones))
    
    def extract_amounts_regex(self, text: str) -> List[str]:
        """
        Extract monetary amounts using regex (backup method)
        
        Args:
            text: Text to search
        
        Returns:
            List of amounts
        """
        patterns = [
            r'\$\s*\d+(?:,\d{3})*(?:\.\d{2})?',  # $1,000.00
            r'\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars?|USD)',  # 1000 dollars
        ]
        
        amounts = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            amounts.extend(matches)
        
        return list(set(amounts))
    
    def extract_receipt_ids_regex(self, text: str) -> List[str]:
        """
        Extract receipt IDs using regex (backup method)
        
        Args:
            text: Text to search
        
        Returns:
            List of receipt IDs
        """
        patterns = [
            r'#\d{4,}',  # #12345
            r'REC-[\w]+',  # REC-12345
            r'TXN-[\w]+',  # TXN-ABC123
            r'receipt[:\s]+[\w-]+',  # Receipt: 12345
            r'transaction[:\s]+[\w-]+',  # Transaction: ABC123
        ]
        
        receipt_ids = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            receipt_ids.extend(matches)
        
        # Clean up
        receipt_ids = [rid.strip() for rid in receipt_ids]
        return list(set(receipt_ids))


# Create singleton instance
ner_service = NERService()