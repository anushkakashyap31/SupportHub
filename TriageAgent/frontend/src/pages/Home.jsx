/**
 * Landing Page with Animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, BarChart3, Zap, Shield, Brain, Clock, 
  ArrowRight, TrendingUp
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Logo from '../components/common/Logo';

const Home = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Classification',
      description: 'Automatically classify messages by urgency and intent using advanced AI',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Named Entity Recognition',
      description: 'Extract critical information like names, dates, amounts, and IDs',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: MessageSquare,
      title: 'Smart Response Generation',
      description: 'Generate contextually accurate draft responses instantly',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Clock,
      title: '10-20x Faster',
      description: 'Reduce message processing time from minutes to seconds',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track performance metrics and gain actionable insights',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Shield,
      title: 'Production Ready',
      description: 'Enterprise-grade reliability with comprehensive error handling',
      gradient: 'from-teal-500 to-cyan-500',
    },
  ];

  const stats = [
    { value: '30 sec', label: 'Avg Processing Time', icon: Clock },
    { value: '95%', label: 'Classification Accuracy', icon: TrendingUp },
    { value: '10-20x', label: 'Faster Than Manual', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-12"
            variants={itemVariants}
          >
            <Logo size="xl" animated={true} />
          </motion.div>

          {/* Headline */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Triage Agent
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Automate your non-profit communication triage with intelligent AI classification,
              entity extraction, and response generation
            </p>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              variants={itemVariants}
            >
              <Link to="/triage">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="primary" size="lg" icon={MessageSquare}>
                    Start Triaging
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" icon={BarChart3}>
                    View Dashboard
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3">
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 text-center mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-center">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.h2
          className="text-4xl font-bold text-center text-gray-900 mb-4"
          variants={itemVariants}
        >
          Powerful Features
        </motion.h2>
        <motion.p
          className="text-xl text-center text-gray-600 mb-12"
          variants={itemVariants}
        >
          Everything you need to automate communication triage
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card hoverable className="h-full">
                <div className="text-center">
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-4 shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-600 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8"
            variants={itemVariants}
          >
            Start triaging messages with AI in seconds
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link to="/triage">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="secondary" size="lg">
                  Try It Now
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;