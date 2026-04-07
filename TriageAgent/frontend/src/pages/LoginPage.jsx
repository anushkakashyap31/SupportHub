/**
 * Animated Login Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Login from '../components/auth/Login';
import Logo from '../components/common/Logo';
import { Sparkles } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      {/* Floating Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <Sparkles className="text-purple-400" size={16 + Math.random() * 16} />
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo - Clickable to go back to landing page */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Logo size="lg" animated={true} />
            </motion.div>
          </Link>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue managing your triage workflow
          </p>
        </motion.div>

        {/* Login Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Login />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;