"""
Input Validation Utilities
"""

import re
from typing import Optional


def validate_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email: Email address to validate
    
    Returns:
        True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """
    Validate phone number format (US format)
    
    Args:
        phone: Phone number to validate
    
    Returns:
        True if valid, False otherwise
    """
    # Remove common separators
    cleaned = re.sub(r'[\s\-\(\)\.]', '', phone)
    
    # Check if it's 10 or 11 digits (with country code)
    pattern = r'^(\+?1)?[0-9]{10}$'
    return bool(re.match(pattern, cleaned))


def sanitize_text(text: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize user input text
    
    Args:
        text: Text to sanitize
        max_length: Maximum length (truncate if longer)
    
    Returns:
        Sanitized text
    """
    # Remove excessive whitespace
    text = ' '.join(text.split())
    
    # Remove control characters
    text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\r\t')
    
    # Truncate if needed
    if max_length and len(text) > max_length:
        text = text[:max_length] + "..."
    
    return text.strip()


def extract_receipt_ids(text: str) -> list:
    """
    Extract receipt/transaction IDs from text
    
    Common patterns:
    - #12345
    - REC-12345
    - TXN-ABC123
    - Receipt: 12345
    
    Args:
        text: Text to search
    
    Returns:
        List of found receipt IDs
    """
    patterns = [
        r'#\d{4,}',                    # #12345
        r'REC-[\w]+',                  # REC-12345
        r'TXN-[\w]+',                  # TXN-ABC123
        r'receipt[:\s]+[\w-]+',        # Receipt: 12345
        r'transaction[:\s]+[\w-]+',    # Transaction: ABC123
    ]
    
    receipt_ids = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        receipt_ids.extend(matches)
    
    # Clean and deduplicate
    receipt_ids = [rid.strip() for rid in receipt_ids]
    return list(set(receipt_ids))


def is_urgent_keyword(text: str) -> bool:
    """
    Check if text contains urgent keywords
    
    Args:
        text: Text to check
    
    Returns:
        True if urgent keywords found
    """
    urgent_keywords = [
        'urgent', 'emergency', 'asap', 'immediately',
        'critical', 'fraud', 'scam', 'legal',
        'lawsuit', 'stolen', 'hack', 'breach'
    ]
    
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in urgent_keywords)


def extract_amounts(text: str) -> list:
    """
    Extract monetary amounts from text
    
    Args:
        text: Text to search
    
    Returns:
        List of found amounts
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