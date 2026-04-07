/**
 * Triage Result Component
 * Complete display of triage analysis
 */

import React, { useState } from 'react';
import { CheckCircle, XCircle, TrendingUp, Target, Users } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import UrgencyBadge from './UrgencyBadge';
import EntityDisplay from './EntityDisplay';
import ResponsePreview from './ResponsePreview';
import { formatIntent, formatStatus, getConfidenceColor, formatPercentage } from '../../utils/helpers';

const TriageResult = ({ result, onApprove, onReject, showActions = true }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!result) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No triage result to display</p>
      </div>
    );
  }
  
  const { classification, entities, draft_response, routing } = result;
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'entities', label: 'Entities', icon: Users },
    { id: 'response', label: 'Draft Response', icon: TrendingUp },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="space-y-4">
          {/* Classification */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Triage Analysis Complete
              </h3>
              <p className="text-sm text-gray-600">
                ID: {result.triage_id}
              </p>
            </div>
            
            <Badge status={result.status}>
              {formatStatus(result.status)}
            </Badge>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Urgency</p>
              <UrgencyBadge urgency={classification.urgency} />
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Intent</p>
              <Badge intent={classification.intent}>
                {formatIntent(classification.intent)}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Confidence</p>
              <span className={`text-lg font-semibold ${getConfidenceColor(classification.confidence)}`}>
                {formatPercentage(classification.confidence)}
              </span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <Card>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Original Message */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Original Message
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {result.message}
                </p>
              </div>
            </div>
            
            {/* Classification Reasoning */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                AI Reasoning
              </h4>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-800">
                  {classification.reasoning}
                </p>
              </div>
            </div>
            
            {/* Routing Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Routing
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Department</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {routing.department}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Priority</p>
                  <p className="text-sm font-medium text-gray-900">
                    Priority {routing.priority} {routing.priority === 1 && '(Highest)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'entities' && (
          <EntityDisplay entities={entities} />
        )}
        
        {activeTab === 'response' && (
          <ResponsePreview response={draft_response} />
        )}
      </Card>
      
      {/* Actions */}
      {showActions && (
        <Card>
          <div className="flex gap-3">
            <Button
              variant="success"
              icon={CheckCircle}
              onClick={() => onApprove?.(result.triage_id)}
              className="flex-1"
            >
              Approve Response
            </Button>
            
            <Button
              variant="danger"
              icon={XCircle}
              onClick={() => onReject?.(result.triage_id)}
              className="flex-1"
            >
              Reject & Edit
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TriageResult;