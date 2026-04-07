/**
 * Public Landing Page - Shown Before Authentication
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, BarChart3, Zap, Shield, Brain, Clock, 
  ArrowRight, TrendingUp, CheckCircle, Star, Users,
  Sparkles, Target, Award
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Logo from '../components/common/Logo';

const LandingPage = () => {
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

  const benefits = [
    'Automatic urgency detection',
    'Smart entity extraction',
    'AI-generated responses',
    'Department routing',
    'Real-time analytics',
    'Secure & scalable',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <motion.nav
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" animated={true} showTagline={false} />
            
            <div className="flex items-center gap-4">
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline">Sign In</Button>
                </motion.div>
              </Link>
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="primary">Get Started</Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden pt-20 pb-32"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
            className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Headline */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={16} />
              <span className="text-sm font-medium">Powered by AI</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Automate Communication{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Triage
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered message classification, entity extraction, and response generation 
              for non-profit organizations. Process messages <strong>10-20x faster</strong>.
            </p>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              variants={itemVariants}
            >
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="primary" size="lg">
                    Start Free Trial
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg">
                    Watch Demo
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
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3">
                    <stat.icon className="text-white" size={28} />
                  </div>
                </div>
                <p className="text-5xl font-bold text-gray-900 text-center mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-center font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple 4-step process to automate your communication triage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'Message Arrives',
              description: 'Incoming message from email, or any communication channel, Paste it to Triage Message and Submit',
              icon: MessageSquare,
              color: 'from-blue-500 to-cyan-500',
            },
            {
              step: '2',
              title: 'AI Classification',
              description: 'Automatically detect urgency level and message intent using advanced AI',
              icon: Brain,
              color: 'from-purple-500 to-pink-500',
            },
            {
              step: '3',
              title: 'Entity Extraction',
              description: 'Extract key information like names, dates, amounts, and IDs automatically',
              icon: Zap,
              color: 'from-orange-500 to-red-500',
            },
            {
              step: '4',
              title: 'Smart Response',
              description: 'Generate contextual draft response and route to the right department',
              icon: CheckCircle,
              color: 'from-green-500 to-emerald-500',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <Card hoverable className="h-full text-center">
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {item.step}
                  </div>
                </div>

                <div className="pt-8">
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl mb-4 shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <motion.div
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full">
            <Clock className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-700">
              Complete process in under 10 seconds
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to automate your communication workflow
          </p>
        </motion.div>

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

      {/* Benefits Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-600 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose TriageAgent?
            </h2>
            <p className="text-xl text-blue-100">
              Built for modern non-profit organizations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <CheckCircle className="text-green-300 flex-shrink-0" size={24} />
                <span className="text-white font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-600 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8"
            variants={itemVariants}
          >
            Join hundreds of non-profits automating their communication workflow
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link to="/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="secondary" size="lg">
                  Start Free Trial
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </motion.div>
            </Link>
            <p className="text-blue-100 mt-4 text-sm">
              No credit card required • Setup in 5 minutes
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Logo size="sm" animated={false} />
              <p className="text-sm mt-2">© 2026 TriageAgent. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;