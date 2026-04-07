/**
 * Triage Store (Zustand)
 */

import { create } from 'zustand';
import * as triageAPI from '../services/triageAPI';
import toast from 'react-hot-toast';

const useTriageStore = create((set, get) => ({
  // State
  currentResult: null,
  isProcessing: false,
  error: null,
  history: [],

  // Actions
  processMessage: async (messageData) => {
    set({ isProcessing: true, error: null });
    try {
      const result = await triageAPI.triageMessage(messageData);
      
      // Add to history
      const history = get().history;
      set({
        currentResult: result,
        history: [result, ...history].slice(0, 10), // Keep last 10
        isProcessing: false,
      });
      
      toast.success('Message triaged successfully!');
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Triage failed';
      set({ error: errorMessage, isProcessing: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  getResult: async (triageId) => {
    try {
      const result = await triageAPI.getTriageResult(triageId);
      set({ currentResult: result });
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch result';
      toast.error(errorMessage);
      throw error;
    }
  },

  submitFeedback: async (triageId, feedbackData) => {
    try {
      await triageAPI.submitFeedback(triageId, feedbackData);
      toast.success('Feedback submitted successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to submit feedback';
      toast.error(errorMessage);
      return false;
    }
  },

  clearCurrent: () => set({ currentResult: null }),
  clearError: () => set({ error: null }),
}));

export default useTriageStore;