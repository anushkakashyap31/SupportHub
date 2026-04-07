/**
 * Message Detail Page
 * View individual message details
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import TriageResult from '../components/triage/TriageResult';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useMessageStore from '../store/useMessageStore';
import useTriageStore from '../store/useTriageStore';

const MessagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMessage } = useMessageStore();
  const { submitFeedback } = useTriageStore();
  const [message, setMessage] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  useEffect(() => {
    loadMessage();
  }, [id]);
  
  const loadMessage = async () => {
    setLoading(true);
    try {
      const data = await getMessage(id);
      setMessage(data);
    } catch (error) {
      console.error('Failed to load message:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async (triageId) => {
    await submitFeedback(triageId, { approved: true });
    loadMessage();
  };
  
  const handleReject = async (triageId) => {
    await submitFeedback(triageId, { approved: false });
    loadMessage();
  };
  
  if (loading) {
    return <LoadingSpinner fullScreen text="Loading message..." />;
  }
  
  if (!message) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Message not found</p>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => navigate('/dashboard')}
        >
          Back
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Message Details</h1>
          <p className="mt-1 text-gray-600">ID: {id}</p>
        </div>
      </div>
      
      {/* Message Detail */}
      <div className="max-w-4xl">
        <TriageResult
          result={message}
          onApprove={handleApprove}
          onReject={handleReject}
          showActions={message.status === 'pending_review'}
        />
      </div>
    </div>
  );
};

export default MessagePage;