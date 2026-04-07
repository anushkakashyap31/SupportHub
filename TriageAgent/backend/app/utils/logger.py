"""
Logging Configuration
Structured JSON logging for production
"""

import logging
import sys
from datetime import datetime
from pythonjsonlogger import jsonlogger


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter with additional fields"""
    
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        
        # Add timestamp
        log_record['timestamp'] = datetime.utcnow().isoformat()
        
        # Add log level
        log_record['level'] = record.levelname
        
        # Add module info
        log_record['module'] = record.module
        log_record['function'] = record.funcName


def setup_logger(name: str = "triage_agent", level: str = "INFO") -> logging.Logger:
    """
    Set up structured logger
    
    Args:
        name: Logger name
        level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    
    Returns:
        Configured logger instance
    """
    
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))
    
    # Remove existing handlers
    logger.handlers = []
    
    # Console handler with JSON formatting
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    
    # JSON formatter
    formatter = CustomJsonFormatter(
        '%(timestamp)s %(level)s %(module)s %(funcName)s %(message)s'
    )
    console_handler.setFormatter(formatter)
    
    logger.addHandler(console_handler)
    
    return logger


# Create default logger
logger = setup_logger()


# Convenience functions
def log_info(message: str, **kwargs):
    """Log info message with additional context"""
    logger.info(message, extra=kwargs)


def log_error(message: str, **kwargs):
    """Log error message with additional context"""
    logger.error(message, extra=kwargs)


def log_warning(message: str, **kwargs):
    """Log warning message with additional context"""
    logger.warning(message, extra=kwargs)


def log_debug(message: str, **kwargs):
    """Log debug message with additional context"""
    logger.debug(message, extra=kwargs)