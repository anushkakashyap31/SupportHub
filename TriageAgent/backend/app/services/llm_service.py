"""
LLM Service - Gemini API Integration
Handles all LLM operations using Google's Gemini 2.5 Flash
"""

from google import genai
from google.genai import types
from app.config import settings
from app.utils import logger, log_error, log_info
from typing import Optional, Dict, Any
import json


class LLMService:
    """Service for interacting with Gemini LLM"""
    
    def __init__(self):
        """Initialize Gemini client"""
        try:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            log_info("✓ LLM Service initialized", model="gemini-2.5-flash")
        except Exception as e:
            log_error(f"Failed to initialize LLM service: {str(e)}")
            raise
    
    async def generate_text(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        json_mode: bool = False
    ) -> str:
        """
        Generate text using Gemini
        
        Args:
            prompt: Input prompt
            temperature: Creativity (0.0-1.0)
            max_tokens: Maximum output length
            json_mode: Whether to expect JSON output
        
        Returns:
            Generated text
        """
        try:
            # Create generation config
            config = types.GenerateContentConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
                response_modalities=["TEXT"],
                stop_sequences=None, # Don't stop early
            )      
            # Add JSON instruction if needed
            if json_mode:
                prompt = f"{prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanations, just JSON."
            
            # Generate content - THIS WAS MISSING!
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=config
            )
            # Check if response exists
            if not response:
                log_error("No response from Gemini API")
                raise ValueError("No response from LLM")
            # Check if response was blocked
            if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                if hasattr(response.prompt_feedback, 'block_reason') and response.prompt_feedback.block_reason:
                    log_error(f"Content blocked: {response.prompt_feedback.block_reason}")
                    raise ValueError(f"Content was blocked by safety filters")
            
            # Extract text - try multiple methods
            result_text = None
            
            if response and hasattr(response, 'text') and response.text:
                result_text = response.text.strip()
            elif response and hasattr(response, 'candidates') and response.candidates:
                # Try getting from candidates
                if response.candidates[0].content.parts:
                    result_text = response.candidates[0].content.parts[0].text.strip()
            
            if not result_text:
                log_error("Empty response from LLM")
                raise ValueError("Empty response from LLM")
            
            # Clean JSON response if needed
            if json_mode:
                result_text = self._clean_json_response(result_text)
            
            log_info(f"LLM generated {len(result_text)} characters")
            
            return result_text
                
        except Exception as e:
            log_error(f"LLM generation failed: {str(e)}", prompt_length=len(prompt))
            raise        
        
    async def generate_text_with_retry(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        json_mode: bool = False,
        max_retries: int = 3
    ) -> str:
        """
        Generate text with automatic retry on 503 errors
        
        Args:
            prompt: Input prompt
            temperature: Creativity (0.0-1.0)
            max_tokens: Maximum output length
            json_mode: Whether to expect JSON output
            max_retries: Maximum number of retry attempts
        
        Returns:
            Generated text
        """
        import asyncio
        
        for attempt in range(max_retries):
            try:
                return await self.generate_text(prompt, temperature, max_tokens, json_mode)
            except Exception as e:
                error_str = str(e)
                # Retry on 503 (high demand) or 429 (rate limit)
                if ('503' in error_str or '429' in error_str) and attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 2  # 2s, 4s, 6s
                    log_info(f"API temporarily unavailable. Retry {attempt + 1}/{max_retries} after {wait_time}s...")
                    await asyncio.sleep(wait_time)
                else:
                    # On last attempt or non-retryable error, raise
                    raise
                
    async def classify_message(self, text: str) -> Dict[str, Any]:
        """
        Classify message urgency and intent
        
        Args:
            text: Message to classify
        
        Returns:
            Classification result with urgency, intent, confidence, reasoning
        """
        prompt = f"""You are a message classification expert for a non-profit and customer service organization.

Analyze this message and classify it:

MESSAGE:
{text}

Classify the message with:
1. URGENCY: critical, high, normal, or low
2. INTENT: donation, volunteer, question, complaint, feedback, partnership, event, or other
3. CONFIDENCE: 0.0 to 1.0 (how confident are you?)
4. REASONING: Brief explanation of your classification

URGENCY GUIDELINES:
- CRITICAL: Legal issues, Urgent issues requiring immediate attention, fraud, emergencies, safety concerns
- HIGH: Donation problems, urgent complaints, time-sensitive requests
- NORMAL: General inquiries, standard requests
- LOW: Newsletters, general information, casual feedback

INTENT GUIDELINES:
- DONATION: Anything related to donations, receipts, tax documents
- VOLUNTEER: Volunteer sign-ups, scheduling, inquiries
- COMPLAINT: Problems, issues, negative feedback
- QUESTION: General questions, information requests
- FEEDBACK: Positive feedback, testimonials, suggestions
- PARTNERSHIP: Partnership, sponsorship, collaboration requests
- EVENT: Event-related inquiries, registrations
- OTHER: Anything that doesn't fit above categories

Respond ONLY with this JSON format:
{{
    "urgency": "critical|high|normal|low",
    "intent": "donation|volunteer|question|complaint|feedback|partnership|event|other",
    "confidence": 0.85,
    "reasoning": "Brief explanation here"
}}"""

        try:
            response = await self.generate_text_with_retry(prompt, temperature=0.3, json_mode=True, max_retries=3)
            result = json.loads(response)
            
            # Validate response structure
            required_fields = ["urgency", "intent", "confidence", "reasoning"]
            if not all(field in result for field in required_fields):
                raise ValueError("Invalid classification response structure")
            
            log_info("Message classified", 
                    urgency=result["urgency"], 
                    intent=result["intent"],
                    confidence=result["confidence"])
            
            return result
            
        except json.JSONDecodeError as e:
            log_error(f"Failed to parse classification JSON: {str(e)}")
            # Return default classification
            return {
                "urgency": "normal",
                "intent": "question",
                "confidence": 0.5,
                "reasoning": "Classification failed, using default"
            }
    
    async def extract_entities_llm(self, text: str) -> Dict[str, Any]:
        """
        Extract domain-specific entities using LLM
        
        Args:
            text: Text to extract entities from
        
        Returns:
            Extracted entities
        """
        prompt = f"""Extract the following entities from this message:

MESSAGE:
{text}

Extract these entities (use empty array if not found):
1. EMAILS: Email addresses
2. PHONE_NUMBERS: Phone numbers (any format)
3. RECEIPT_IDS: Receipt/transaction IDs (formats: #12345, REC-xxx, etc.)
4. CASE_NUMBERS: Case or ticket numbers
5. DONATION_IDS: Donation reference IDs

Respond ONLY with this JSON format:
{{
    "emails": ["email1@example.com", "email2@example.com"],
    "phone_numbers": ["+1-234-567-8900"],
    "receipt_ids": ["#12345", "REC-67890"],
    "case_numbers": ["CASE-123"],
    "donation_ids": ["DON-456"]
}}"""

        try:
            response = await self.generate_text_with_retry(prompt, temperature=0.1, json_mode=True, max_retries=3)
            result = json.loads(response)
            
            log_info("Entities extracted via LLM", 
                    emails=len(result.get("emails", [])),
                    receipts=len(result.get("receipt_ids", [])))
            
            return result
            
        except json.JSONDecodeError as e:
            log_error(f"Failed to parse entity extraction JSON: {str(e)}")
            return {
                "emails": [],
                "phone_numbers": [],
                "receipt_ids": [],
                "case_numbers": [],
                "donation_ids": []
            }
    
    async def generate_response(
        self,
        message: str,
        urgency: str,
        intent: str,
        entities: Dict[str, Any]
    ) -> str:
        """
        Generate draft response based on classification and entities
        
        Args:
            message: Original message
            urgency: Urgency level
            intent: Intent category
            entities: Extracted entities
        
        Returns:
            Draft response text
        """
        # Build context about entities
        entity_context = []
        if entities.get("persons"):
            entity_context.append(f"Sender name: {entities['persons'][0]}")
        if entities.get("amounts"):
            entity_context.append(f"Mentioned amount: {entities['amounts'][0]}")
        if entities.get("receipt_ids"):
            entity_context.append(f"Receipt ID: {entities['receipt_ids'][0]}")
        if entities.get("dates"):
            entity_context.append(f"Mentioned date: {entities['dates'][0]}")
        
        entity_info = "\n".join(entity_context) if entity_context else "No specific details extracted"
        
        prompt = f"""You are a professional customer service representative for a Non-Profit Communications.

Generate a Complete Professional email draft response (Minimum 300-400 words) to this message:

ORIGINAL MESSAGE:
{message}

MESSAGE CLASSIFICATION:
- Urgency: {urgency}
- Intent: {intent}

EXTRACTED DETAILS:
{entity_info}

RESPONSE GUIDELINES:
1. Be professional, empathetic, and warm
2. Address the specific intent ({intent})
3. Match urgency level ({urgency})
4. Reference specific details if available
5. Provide clear next steps
6. Use appropriate tone for non-profit communication

IMPORTANT INSTRUCTIONS:
1. Write a COMPLETE email with ALL sections below
2. Include a clear subject line
3. Write 3-4 paragraphs (atleast 300-400 words)
4. Be warm, professional, and empathetic tone
5. Reference specific details from the message
6. Provide clear actionable next steps
7. Use appropriate tone for {urgency} urgency
8. Professional sign-off (Best regards, With Gratitude etc)

EMAIL STRUCTURE REQUIRED:
Subject: [Write compelling subject line]

[Greeting - Dear Friend/Supporter/etc]

[Paragraph 1 - Acknowledge their message and show appreciation]

[Paragraph 2 - Address their specific request/concern with details]

[Paragraph 3 - Provide next steps, timeline, or additional information]

[Paragraph 4 - Thank them and close warmly]

[Sign-off - Best regards, With gratitude, etc.]
[Organization/Department name]

TONE GUIDELINES:
- CRITICAL/HIGH urgency: Apologetic, immediate action, reassuring
- NORMAL urgency: Friendly, helpful, informative
- LOW urgency: Warm, grateful, informative

Generate a complete, professional email response now.
Include appropriate greeting and closing.
DO NOT use placeholders like [Name] - use "Dear Friend" or similar if name unknown."""

        try:
            response = await self.generate_text_with_retry(prompt, temperature=0.7, max_tokens=2000, max_retries=3)
            
            log_info("Response generated", 
                    urgency=urgency,
                    intent=intent,
                    length=len(response))
            
            return response
            
        except Exception as e:
            log_error(f"Failed to generate response: {str(e)}")
            # Return fallback response
            return self._get_fallback_response(urgency, intent)
    
    def _clean_json_response(self, text: str) -> str:
        """Clean JSON response from markdown formatting"""
        # Remove markdown code blocks
        text = text.replace("```json", "").replace("```", "")
        
        # Remove any text before first { or [
        start_idx = min(
            text.find("{") if "{" in text else len(text),
            text.find("[") if "[" in text else len(text)
        )
        text = text[start_idx:]
        
        # Remove any text after last } or ]
        end_idx = max(
            text.rfind("}") if "}" in text else -1,
            text.rfind("]") if "]" in text else -1
        )
        if end_idx != -1:
            text = text[:end_idx + 1]
        
        return text.strip()
    
    def _get_fallback_response(self, urgency: str, intent: str) -> str:
        """Generate simple fallback response"""
        responses = {
            "donation": "Thank you for contacting us regarding your donation. Our team is reviewing your inquiry and will respond within 24 hours. We appreciate your support!",
            "volunteer": "Thank you for your interest in volunteering! Our volunteer coordinator will reach out to you within 48 hours with more information.",
            "complaint": "We sincerely apologize for any inconvenience. Your concern is important to us, and our team will investigate this matter immediately.",
            "question": "Thank you for reaching out. We've received your inquiry and will respond with the information you need within 24-48 hours.",
        }
        
        return responses.get(intent, "Thank you for contacting us. We've received your message and will respond shortly.")


# Create singleton instance
llm_service = LLMService()