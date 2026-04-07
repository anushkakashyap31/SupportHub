/**
 * Triage Page
 * Main interface for message triage
 */

import React from 'react';
import { Send } from 'lucide-react';
import Card from '../components/common/Card';
import MessageInput from '../components/triage/MessageInput';
import TriageResult from '../components/triage/TriageResult';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useTriage from '../hooks/useTriage';

const TriagePage = () => {
  const {
    currentResult,
    isProcessing,
    processMessage,
    submitFeedback,
    clearCurrent,
  } = useTriage();
  
  const handleSubmit = async (messageData) => {
    try {
      await processMessage(messageData);
    } catch (error) {
      console.error('Triage failed:', error);
    }
  };
  
  const handleApprove = async (triageId) => {
    const success = await submitFeedback(triageId, { approved: true });
    if (success) {
      clearCurrent();
    }
  };
  
  const handleReject = async (triageId) => {
    const success = await submitFeedback(triageId, { approved: false });
    if (success) {
      clearCurrent();
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Message Triage</h1>
          <p className="mt-2 text-gray-600">
            AI-powered classification, entity extraction, and response generation
          </p>
        </div>
        
        {currentResult && (
          <button
            onClick={clearCurrent}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            New Message
          </button>
        )}
      </div>
      
      {/* Main Content */}
      {!currentResult ? (
        <Card title="Submit Message for Triage" className="max-w-3xl mx-auto">
          <MessageInput onSubmit={handleSubmit} isProcessing={isProcessing} />
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto">
          {isProcessing ? (
            <LoadingSpinner text="Processing message through AI agents..." />
          ) : (
            <TriageResult
              result={currentResult}
              onApprove={handleApprove}
              onReject={handleReject}
              showActions={true}
            />
          )}
        </div>
      )}
      
      {/* Info Banner */}
      {!currentResult && (
        <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Send className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                How It Works
              </h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Enter the message to be triaged</li>
                <li>AI classifies urgency and intent</li>
                <li>Extracts entities (names, dates, IDs, amounts)</li>
                <li>Generates contextual draft response</li>
                <li>Routes to appropriate department</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriagePage;