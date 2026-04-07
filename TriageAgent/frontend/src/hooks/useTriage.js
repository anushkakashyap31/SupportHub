/**
 * useTriage Hook
 * Convenient hook for triage operations
 */

import useTriageStore from '../store/useTriageStore';

const useTriage = () => {
  const {
    currentResult,
    isProcessing,
    error,
    history,
    processMessage,
    getResult,
    submitFeedback,
    clearCurrent,
    clearError,
  } = useTriageStore();
  
  return {
    currentResult,
    isProcessing,
    error,
    history,
    processMessage,
    getResult,
    submitFeedback,
    clearCurrent,
    clearError,
  };
};

export default useTriage;