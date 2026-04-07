/**
 * Animated Register Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (password.length === 0) return null;
    if (password.length < 6) return { text: 'Too short', color: 'text-red-500', strength: 0 };
    if (password.length < 8) return { text: 'Weak', color: 'text-orange-500', strength: 33 };
    if (password.length < 12) return { text: 'Good', color: 'text-yellow-500', strength: 66 };
    return { text: 'Strong', color: 'text-green-500', strength: 100 };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const success = await register(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (success) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
        Create Account
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <motion.div
            className="relative"
            variants={inputVariants}
            whileFocus="focus"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="John Doe"
            />
          </motion.div>
        </motion.div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
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
          transition={{ delay: 0.5 }}
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

          {/* Password Strength Indicator */}
          {passwordStrength && (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${passwordStrength.color}`}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    passwordStrength.strength === 100
                      ? 'bg-green-500'
                      : passwordStrength.strength === 66
                      ? 'bg-yellow-500'
                      : passwordStrength.strength === 33
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength.strength}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Confirm Password Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
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
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </motion.div>

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <motion.div
              className="mt-2 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {formData.password === formData.confirmPassword ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">Passwords match</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">Passwords do not match</span>
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create Account
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
        transition={{ delay: 0.8 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Already have an account?</span>
        </div>
      </motion.div>

      {/* Login Link */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Link to="/login">
          <motion.span
            className="text-blue-600 hover:text-purple-600 font-medium transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
          >
            Sign in instead →
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Register;