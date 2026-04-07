"""
Helper Utilities
"""

import hashlib
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, Optional


def generate_id(prefix: str = "") -> str:
    """
    Generate unique ID
    
    Args:
        prefix: Optional prefix for the ID
    
    Returns:
        Unique identifier string
    """
    unique_id = str(uuid.uuid4())
    return f"{prefix}_{unique_id}" if prefix else unique_id


def generate_triage_id() -> str:
    """Generate unique triage ID"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:8]
    return f"TRG-{timestamp}-{random_suffix}"


def hash_text(text: str) -> str:
    """
    Generate hash of text (for deduplication)
    
    Args:
        text: Text to hash
    
    Returns:
        SHA256 hash
    """
    return hashlib.sha256(text.encode()).hexdigest()


def truncate_text(text: str, max_length: int = 200, suffix: str = "...") -> str:
    """
    Truncate text to maximum length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated
    
    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)].strip() + suffix


def format_timestamp(dt: Optional[datetime] = None, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format datetime as string
    
    Args:
        dt: Datetime object (defaults to now)
        format_str: Format string
    
    Returns:
        Formatted datetime string
    """
    if dt is None:
        dt = datetime.utcnow()
    
    return dt.strftime(format_str)


def parse_timestamp(timestamp_str: str) -> Optional[datetime]:
    """
    Parse timestamp string to datetime
    
    Args:
        timestamp_str: Timestamp string
    
    Returns:
        Datetime object or None if invalid
    """
    formats = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d",
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(timestamp_str, fmt)
        except ValueError:
            continue
    
    return None


def time_ago(dt: datetime) -> str:
    """
    Convert datetime to human-readable time ago string
    
    Args:
        dt: Datetime object
    
    Returns:
        Human-readable string (e.g., "2 hours ago")
    """
    now = datetime.utcnow()
    diff = now - dt
    
    seconds = diff.total_seconds()
    
    if seconds < 60:
        return "just now"
    elif seconds < 3600:
        minutes = int(seconds / 60)
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    elif seconds < 86400:
        hours = int(seconds / 3600)
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    elif seconds < 2592000:
        days = int(seconds / 86400)
        return f"{days} day{'s' if days != 1 else ''} ago"
    else:
        months = int(seconds / 2592000)
        return f"{months} month{'s' if months != 1 else ''} ago"


def merge_dicts(dict1: Dict[str, Any], dict2: Dict[str, Any]) -> Dict[str, Any]:
    """
    Merge two dictionaries (dict2 overrides dict1)
    
    Args:
        dict1: First dictionary
        dict2: Second dictionary
    
    Returns:
        Merged dictionary
    """
    result = dict1.copy()
    result.update(dict2)
    return result


def safe_get(dictionary: Dict[str, Any], key: str, default: Any = None) -> Any:
    """
    Safely get value from dictionary
    
    Args:
        dictionary: Dictionary to search
        key: Key to look for
        default: Default value if key not found
    
    Returns:
        Value or default
    """
    return dictionary.get(key, default)


def calculate_confidence_score(factors: Dict[str, float]) -> float:
    """
    Calculate overall confidence score from multiple factors
    
    Args:
        factors: Dictionary of factor names and scores (0-1)
    
    Returns:
        Overall confidence score (0-1)
    """
    if not factors:
        return 0.0
    
    # Weighted average
    total_score = sum(factors.values())
    return min(total_score / len(factors), 1.0)