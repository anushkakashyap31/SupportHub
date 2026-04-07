"""
Utility Functions
"""

from app.utils.logger import (
    setup_logger,
    logger,
    log_info,
    log_error,
    log_warning,
    log_debug,
)

from app.utils.validators import (
    validate_email,
    validate_phone,
    sanitize_text,
    extract_receipt_ids,
    is_urgent_keyword,
    extract_amounts,
)

from app.utils.helpers import (
    generate_id,
    generate_triage_id,
    hash_text,
    truncate_text,
    format_timestamp,
    parse_timestamp,
    time_ago,
    merge_dicts,
    safe_get,
    calculate_confidence_score,
)

__all__ = [
    # Logger
    "setup_logger",
    "logger",
    "log_info",
    "log_error",
    "log_warning",
    "log_debug",
    # Validators
    "validate_email",
    "validate_phone",
    "sanitize_text",
    "extract_receipt_ids",
    "is_urgent_keyword",
    "extract_amounts",
    # Helpers
    "generate_id",
    "generate_triage_id",
    "hash_text",
    "truncate_text",
    "format_timestamp",
    "parse_timestamp",
    "time_ago",
    "merge_dicts",
    "safe_get",
    "calculate_confidence_score",
]