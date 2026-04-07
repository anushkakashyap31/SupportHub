/**
 * Analytics Component
 * Complete analytics dashboard
 */

import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, CheckCircle, BarChart } from 'lucide-react';
import Card from '../common/Card';
import StatsCard from './StatsCard';
import { UrgencyChart, IntentChart } from './Charts';
import LoadingSpinner from '../common/LoadingSpinner';
import { getDashboardSummary } from '../../services/analyticsAPI';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const summary = await getDashboardSummary();
      setData(summary);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }
  
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No analytics data available</p>
      </div>
    );
  }
  
  const { overview, urgency_distribution, intent_distribution, response_times } = data;
  
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Messages (7d)"
          value={overview?.total_7d || 0}
          icon={BarChart}
          color="blue"
        />
        
        <StatsCard
          title="Total Messages (30d)"
          value={overview?.total_30d || 0}
          icon={TrendingUp}
          color="purple"
        />
        
        <StatsCard
          title="Approval Rate"
          value={`${Math.round(overview?.approval_rate || 0)}%`}
          icon={CheckCircle}
          color="green"
        />
        
        <StatsCard
          title="Avg Processing Time"
          value={`${(overview?.avg_processing_time || 0).toFixed(1)}s`}
          icon={Clock}
          color="yellow"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Messages by Urgency">
          <UrgencyChart data={urgency_distribution?.counts} />
        </Card>
        
        <Card title="Messages by Intent">
          <IntentChart data={intent_distribution?.counts} />
        </Card>
      </div>
      
      {/* Performance Metrics */}
      <Card title="Performance Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
            <p className="text-2xl font-bold text-gray-900">
              {(response_times?.avg_processing_time || 0).toFixed(2)}s
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Min Response Time</p>
            <p className="text-2xl font-bold text-green-600">
              {(response_times?.min_processing_time || 0).toFixed(2)}s
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Max Response Time</p>
            <p className="text-2xl font-bold text-red-600">
              {(response_times?.max_processing_time || 0).toFixed(2)}s
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;