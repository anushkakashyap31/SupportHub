/**
 * Analytics API Service
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get analytics statistics
 */
export const getAnalyticsStats = async (days = 7) => {
  const response = await api.get(`${API_ENDPOINTS.ANALYTICS.STATS}?days=${days}`);
  return response.data;
};

/**
 * Get dashboard summary
 */
export const getDashboardSummary = async () => {
  const response = await api.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
  return response.data;
};

/**
 * Get urgency distribution
 */
export const getUrgencyDistribution = async (days = 30) => {
  const response = await api.get(`${API_ENDPOINTS.ANALYTICS.URGENCY}?days=${days}`);
  return response.data;
};

/**
 * Get intent distribution
 */
export const getIntentDistribution = async (days = 30) => {
  const response = await api.get(`${API_ENDPOINTS.ANALYTICS.INTENT}?days=${days}`);
  return response.data;
};

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = async (days = 7) => {
  const response = await api.get(`${API_ENDPOINTS.ANALYTICS.PERFORMANCE}?days=${days}`);
  return response.data;
};

/**
 * Get trending intents
 */
export const getTrendingIntents = async (days = 7, limit = 5) => {
  const response = await api.get(
    `${API_ENDPOINTS.ANALYTICS.TRENDING}?days=${days}&limit=${limit}`
  );
  return response.data;
};