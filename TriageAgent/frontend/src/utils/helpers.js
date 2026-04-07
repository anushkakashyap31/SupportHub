/**
 * Helper Utility Functions
 */

/**
 * Format timestamp to readable date
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const timeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format urgency label
 */
export const formatUrgency = (urgency) => {
  return capitalize(urgency);
};

/**
 * Format intent label
 */
export const formatIntent = (intent) => {
  return capitalize(intent);
};

/**
 * Format status label
 */
export const formatStatus = (status) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Parse error message from API response
 */
export const parseError = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculate confidence color
 */
export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.8) return 'text-green-600';
  if (confidence >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Format percentage
 */
export const formatPercentage = (value) => {
  return `${Math.round(value * 100)}%`;
};