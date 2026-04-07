/**
 * Animated Login Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Button from '../common/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error toast is already shown by the store
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-bold text-gray-900 mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Sign In
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <motion.div
            className="relative"
            variants={inputVariants}
            whileFocus="focus"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
            />
          </motion.div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <motion.div
            className="relative"
            variants={inputVariants}
            whileFocus="focus"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Divider */}
      <motion.div
        className="relative my-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">New to TriageAgent?</span>
        </div>
      </motion.div>

      {/* Register Link */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link to="/register">
          <motion.span
            className="text-blue-600 hover:text-purple-600 font-medium transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
          >
            Create an account →
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Login;