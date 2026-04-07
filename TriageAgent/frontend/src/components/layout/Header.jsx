/**
 * Header Component with Animated Logo
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Logo from '../common/Logo';

const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <motion.header
      className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <Logo size="md" animated={false} showTagline={false} />
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Notifications */}
            <motion.button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={20} />
            </motion.button>

            {/* Logout */}
            <motion.button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;