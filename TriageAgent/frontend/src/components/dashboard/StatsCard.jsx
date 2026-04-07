/**
 * Stats Card Component
 * Display key metrics
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
              <span className="text-sm text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;