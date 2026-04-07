/**
 * Messages API Service
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get list of messages with filters
 */
export const getMessages = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.status) params.append('status', filters.status);
  if (filters.urgency) params.append('urgency', filters.urgency);
  
  const response = await api.get(`${API_ENDPOINTS.MESSAGES.LIST}?${params.toString()}`);
  return response.data;
};

/**
 * Get single message by ID
 */
export const getMessage = async (messageId) => {
  const response = await api.get(API_ENDPOINTS.MESSAGES.GET(messageId));
  return response.data;
};

/**
 * Update message status
 */
export const updateMessageStatus = async (messageId, status) => {
  const response = await api.put(
    `${API_ENDPOINTS.MESSAGES.UPDATE_STATUS(messageId)}?status=${status}`
  );
  return response.data;
};