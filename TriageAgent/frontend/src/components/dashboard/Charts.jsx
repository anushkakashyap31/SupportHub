/**
 * Charts Component
 * Analytics visualizations using Recharts
 */

import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { capitalize } from '../../utils/helpers';

const COLORS = {
  critical: '#EF4444',
  high: '#F59E0B',
  normal: '#3B82F6',
  low: '#6B7280',
  donation: '#10B981',
  volunteer: '#8B5CF6',
  question: '#3B82F6',
  complaint: '#EF4444',
  feedback: '#F59E0B',
  partnership: '#6366F1',
  event: '#EC4899',
  other: '#6B7280',
};

export const UrgencyChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>;
  }
  
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: capitalize(key),
    value: value,
    fill: COLORS[key] || '#6B7280',
  }));
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const IntentChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>;
  }
  
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: capitalize(key),
    count: value,
    fill: COLORS[key] || '#6B7280',
  }));
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#3B82F6">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};