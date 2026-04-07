/**
 * Settings Page
 */

import React from 'react';
import { User, Bell, Shield, Database } from 'lucide-react';
import Card from '../components/common/Card';
import useAuth from '../hooks/useAuth';

const SettingsPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account and preferences
        </p>
      </div>
      
      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card title="Profile" className="h-fit">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.full_name || 'User'}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
        
      </div>
    </div>
  );
};

export default SettingsPage;