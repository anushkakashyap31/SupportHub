/**
 * Analytics Page
 * System analytics and insights
 */

import React from 'react';
import Analytics from '../components/dashboard/Analytics';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          System performance metrics and insights
        </p>
      </div>
      
      {/* Analytics Component */}
      <Analytics />
    </div>
  );
};

export default AnalyticsPage;