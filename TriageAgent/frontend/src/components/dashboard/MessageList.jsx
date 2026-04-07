/**
 * Message List Component
 * Display list of triaged messages
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import Badge from '../common/Badge';
import UrgencyBadge from '../triage/UrgencyBadge';
import { formatDate, truncateText, formatIntent, formatStatus } from '../../utils/helpers';

const MessageList = ({ messages, onMessageClick }) => {
  const navigate = useNavigate();
  
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No messages found</p>
      </div>
    );
  }
  
  const handleClick = (message) => {
    if (onMessageClick) {
      onMessageClick(message);
    } else {
      navigate(`/messages/${message.triage_id}`);
    }
  };
  
  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.triage_id}
          onClick={() => handleClick(message)}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <UrgencyBadge urgency={message.classification?.urgency} size="sm" />
                <Badge intent={message.classification?.intent} size="sm">
                  {formatIntent(message.classification?.intent)}
                </Badge>
                <Badge status={message.status} size="sm">
                  {formatStatus(message.status)}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-800 mb-2">
                {truncateText(message.message, 150)}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(message.created_at)}</span>
                </div>
                
                {message.metadata?.sender_email && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{message.metadata.sender_email}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Routing Info */}
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">Department</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {message.routing?.department}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;