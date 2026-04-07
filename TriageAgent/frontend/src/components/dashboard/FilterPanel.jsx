/**
 * Filter Panel Component
 * Filters for message list
 */

import React from 'react';
import { Filter, X } from 'lucide-react';
import Button from '../common/Button';
import { URGENCY_LEVELS, STATUS_TYPES } from '../../utils/constants';
import { formatStatus, capitalize } from '../../utils/helpers';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const hasActiveFilters = filters.status || filters.urgency;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            icon={X}
          >
            Clear
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Urgency Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgency
          </label>
          <select
            value={filters.urgency || ''}
            onChange={(e) => onFilterChange({ urgency: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            {Object.values(URGENCY_LEVELS).map((level) => (
              <option key={level} value={level}>
                {capitalize(level)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            {Object.values(STATUS_TYPES).map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Results per page
          </label>
          <select
            value={filters.limit || 50}
            onChange={(e) => onFilterChange({ limit: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;