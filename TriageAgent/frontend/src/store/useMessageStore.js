/**
 * Messages Store (Zustand)
 */

import { create } from 'zustand';
import * as messageAPI from '../services/messageAPI';
import toast from 'react-hot-toast';

const useMessageStore = create((set, get) => ({
  // State
  messages: [],
  currentMessage: null,
  isLoading: false,
  error: null,
  filters: {
    status: null,
    urgency: null,
    limit: 50,
  },

  // Actions
  fetchMessages: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().filters, ...customFilters };
      const data = await messageAPI.getMessages(filters);
      
      set({
        messages: data.messages || [],
        isLoading: false,
      });
      
      return data.messages;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch messages';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return [];
    }
  },

  getMessage: async (messageId) => {
    set({ isLoading: true });
    try {
      const message = await messageAPI.getMessage(messageId);
      set({ currentMessage: message, isLoading: false });
      return message;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch message';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateStatus: async (messageId, status) => {
    try {
      await messageAPI.updateMessageStatus(messageId, status);
      
      // Update in local state
      const messages = get().messages;
      const updated = messages.map((msg) =>
        msg.triage_id === messageId ? { ...msg, status } : msg
      );
      
      set({ messages: updated });
      toast.success('Status updated successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to update status';
      toast.error(errorMessage);
      return false;
    }
  },

  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
  },

  clearFilters: () => {
    set({
      filters: {
        status: null,
        urgency: null,
        limit: 50,
      },
    });
  },

  clearError: () => set({ error: null }),
}));

export default useMessageStore;