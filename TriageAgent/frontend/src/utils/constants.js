/**
 * Application Constants
 */

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGIN_EMAIL: '/api/auth/login-email',
    ME: '/api/auth/me',
  },
  // Triage
  TRIAGE: {
    PROCESS: '/api/triage',
    GET: (id) => `/api/triage/${id}`,
    FEEDBACK: (id) => `/api/triage/${id}/feedback`,
    STATS: '/api/triage/stats/overview',
  },
  // Messages
  MESSAGES: {
    LIST: '/api/messages',
    GET: (id) => `/api/messages/${id}`,
    UPDATE_STATUS: (id) => `/api/messages/${id}/status`,
  },
  // Analytics
  ANALYTICS: {
    STATS: '/api/analytics/stats',
    DASHBOARD: '/api/analytics/dashboard',
    URGENCY: '/api/analytics/urgency',
    INTENT: '/api/analytics/intent',
    PERFORMANCE: '/api/analytics/performance',
    TRENDING: '/api/analytics/trending',
  },
};

// Urgency Levels
export const URGENCY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
};

// Intent Categories
export const INTENT_CATEGORIES = {
  DONATION: 'donation',
  VOLUNTEER: 'volunteer',
  QUESTION: 'question',
  COMPLAINT: 'complaint',
  FEEDBACK: 'feedback',
  PARTNERSHIP: 'partnership',
  EVENT: 'event',
  OTHER: 'other',
};

// Status Types
export const STATUS_TYPES = {
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SENT: 'sent',
  ARCHIVED: 'archived',
};

// Urgency Colors (Tailwind classes)
export const URGENCY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  normal: 'bg-blue-100 text-blue-800 border-blue-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200',
};

// Intent Colors (Tailwind classes)
export const INTENT_COLORS = {
  donation: 'bg-green-100 text-green-800',
  volunteer: 'bg-purple-100 text-purple-800',
  question: 'bg-blue-100 text-blue-800',
  complaint: 'bg-red-100 text-red-800',
  feedback: 'bg-yellow-100 text-yellow-800',
  partnership: 'bg-indigo-100 text-indigo-800',
  event: 'bg-pink-100 text-pink-800',
  other: 'bg-gray-100 text-gray-800',
};

// Status Colors (Tailwind classes)
export const STATUS_COLORS = {
  pending_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  sent: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-800',
};