/**
 * Animated Register Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Register from '../components/auth/Register';
import Logo from '../components/common/Logo';
import { Sparkles, Stars } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      {/* Floating Stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 1, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          {i % 2 === 0 ? (
            <Stars className="text-blue-400" size={12 + Math.random() * 12} />
          ) : (
            <Sparkles className="text-purple-400" size={12 + Math.random() * 12} />
          )}
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
            Get Started
          </h1>
          <p className="text-gray-600">
            Create your account to start triaging with AI
          </p>
        </motion.div>

        {/* Register Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Register />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;