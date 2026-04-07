/**
 * Sidebar Component (with optional improvements)
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  BarChart3,
  PieChart,
  Settings,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/triage', icon: MessageSquare, label: 'Triage' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/analytics', icon: PieChart, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  // Only close on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Close button (mobile only) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Triage Agent v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;