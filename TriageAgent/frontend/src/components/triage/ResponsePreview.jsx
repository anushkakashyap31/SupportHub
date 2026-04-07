/**
 * Response Preview Component
 * Shows the AI-generated draft response
 */

import React, { useState } from 'react';
import { Copy, Check, Edit } from 'lucide-react';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const ResponsePreview = ({ response, onEdit }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Extract subject line if present
  const hasSubject = response?.includes('Subject:');
  const subjectLine = hasSubject 
    ? response.split('\n')[0].replace('Subject:', '').trim()
    : null;
  const bodyText = hasSubject 
    ? response.split('\n').slice(1).join('\n').trim()
    : response;
  
  return (
    <div className="space-y-4">
      {/* Subject Line (if present) */}
      {subjectLine && (
        <div className="pb-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Subject:</p>
          <p className="text-base font-semibold text-gray-900">{subjectLine}</p>
        </div>
      )}
      
      {/* Response Body - WITH SCROLL! */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 max-h-96 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
          {bodyText}
        </pre>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          icon={copied ? Check : Copy}
        >
          {copied ? 'Copied!' : 'Copy Response'}
        </Button>
        
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            icon={Edit}
          >
            Edit Response
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResponsePreview;