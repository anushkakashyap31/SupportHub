/**
 * Triage API Service
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Process message through triage system
 */
export const triageMessage = async (messageData) => {
  const response = await api.post(API_ENDPOINTS.TRIAGE.PROCESS, {
    text: messageData.text,
    sender_email: messageData.senderEmail || null,
    sender_name: messageData.senderName || null,
    metadata: messageData.metadata || {},
  });
  return response.data;
};

/**
 * Get triage result by ID
 */
export const getTriageResult = async (triageId) => {
  const response = await api.get(API_ENDPOINTS.TRIAGE.GET(triageId));
  return response.data;
};

/**
 * Submit feedback on triage result
 */
export const submitFeedback = async (triageId, feedbackData) => {
  const response = await api.post(
    API_ENDPOINTS.TRIAGE.FEEDBACK(triageId),
    {
      triage_id: triageId,
      approved: feedbackData.approved,
      edited_response: feedbackData.editedResponse || null,
      notes: feedbackData.notes || null,
    }
  );
  return response.data;
};

/**
 * Get triage statistics
 */
export const getTriageStats = async () => {
  const response = await api.get(API_ENDPOINTS.TRIAGE.STATS);
  return response.data;
};