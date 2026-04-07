/**
 * Message Input Component
 * Input form for messages to be triaged
 */

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Button from '../common/Button';

const MessageInput = ({ onSubmit, isProcessing }) => {
  const [message, setMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    onSubmit({
      text: message.trim(),
      senderEmail: senderEmail.trim() || null,
      senderName: senderName.trim() || null,
    });
  };
  
  const handleClear = () => {
    setMessage('');
    setSenderEmail('');
    setSenderName('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message Text Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message Text *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter the message to be triaged..."
          rows={6}
          required
          disabled={isProcessing}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-sm text-gray-500">
          Minimum 10 characters required
        </p>
      </div>
      
      {/* Sender Information (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sender Email (Optional)
          </label>
          <input
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="sender@example.com"
            disabled={isProcessing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sender Name (Optional)
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="John Doe"
            disabled={isProcessing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isProcessing || message.length < 10}
          loading={isProcessing}
          icon={Send}
          className="flex-1"
        >
          {isProcessing ? 'Processing...' : 'Triage Message'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isProcessing}
        >
          Clear
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;