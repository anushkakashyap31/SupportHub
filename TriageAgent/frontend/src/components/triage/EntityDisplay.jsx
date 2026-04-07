/**
 * Entity Display Component
 * Shows extracted entities from NER
 */

import React from 'react';
import { User, Building, Calendar, DollarSign, Mail, Phone, Hash } from 'lucide-react';

const EntityDisplay = ({ entities }) => {
  if (!entities) return null;
  
  const entityTypes = [
    {
      key: 'persons',
      label: 'People',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      key: 'organizations',
      label: 'Organizations',
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      key: 'dates',
      label: 'Dates',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      key: 'amounts',
      label: 'Amounts',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      key: 'emails',
      label: 'Emails',
      icon: Mail,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      key: 'phone_numbers',
      label: 'Phone Numbers',
      icon: Phone,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      key: 'receipt_ids',
      label: 'Receipt IDs',
      icon: Hash,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      key: 'case_numbers',
      label: 'Case Numbers',
      icon: Hash,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];
  
  // Filter out empty entity types
  const displayEntities = entityTypes.filter(
    (type) => entities[type.key] && entities[type.key].length > 0
  );
  
  if (displayEntities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No entities extracted</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {displayEntities.map((type) => (
        <div key={type.key}>
          <div className="flex items-center gap-2 mb-2">
            <type.icon className={`w-4 h-4 ${type.color}`} />
            <span className="text-sm font-medium text-gray-700">{type.label}</span>
            <span className="text-xs text-gray-500">
              ({entities[type.key].length})
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {entities[type.key].map((entity, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm ${type.bgColor} ${type.color}`}
              >
                {entity}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EntityDisplay;