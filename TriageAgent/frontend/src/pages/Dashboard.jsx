/**
 * Dashboard Page
 * Message management and filtering
 */

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import MessageList from '../components/dashboard/MessageList';
import FilterPanel from '../components/dashboard/FilterPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useMessageStore from '../store/useMessageStore';

const Dashboard = () => {
  const {
    messages,
    isLoading,
    filters,
    fetchMessages,
    setFilters,
    clearFilters,
  } = useMessageStore();
  
  const [showFilters, setShowFilters] = useState(true);
  
  useEffect(() => {
    loadMessages();
  }, [filters]);
  
  const loadMessages = async () => {
    await fetchMessages();
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleClearFilters = () => {
    clearFilters();
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage and review triaged messages
          </p>
        </div>
        
        <Button
          variant="outline"
          icon={RefreshCw}
          onClick={loadMessages}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}
        
        {/* Messages List */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <Card
            title={`Messages (${messages.length})`}
            subtitle="Click on any message to view details"
          >
            {isLoading ? (
              <LoadingSpinner text="Loading messages..." />
            ) : (
              <MessageList messages={messages} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;