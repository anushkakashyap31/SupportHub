/**
 * Logo Component with Animation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Zap } from 'lucide-react';

const Logo = ({ size = 'md', animated = true, showTagline = true }) => {
  const sizes = {
    sm: { icon: 20, text: 'text-xl', tagline: 'text-xs' },
    md: { icon: 32, text: 'text-2xl', tagline: 'text-sm' },
    lg: { icon: 40, text: 'text-3xl', tagline: 'text-base' },
    xl: { icon: 48, text: 'text-4xl', tagline: 'text-lg' },
  };

  const { icon, text, tagline } = sizes[size];

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    hover: {
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 },
    },
  };

  const sparkleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  };

  const LogoContent = () => (
    <motion.div
      className="flex items-center gap-3"
      variants={animated ? logoVariants : {}}
      initial={animated ? 'hidden' : ''}
      animate={animated ? 'visible' : ''}
      whileHover="hover"
    >
      {/* Icon Container */}
      <div className="relative">
        {/* Main Icon */}
        <motion.div
          className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2 shadow-lg"
          variants={iconVariants}
        >
          <MessageSquare className="text-white" size={icon} strokeWidth={2.5} />
        </motion.div>

        {/* Sparkle Effect */}
        {animated && (
          <motion.div
            className="absolute -top-1 -right-1"
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
          >
            <Zap className="text-yellow-400" size={icon / 2} fill="currentColor" />
          </motion.div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className={`${text} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
          TriageAgent
        </span>
        {showTagline && (
          <span className={`${tagline} text-gray-500 -mt-1`}>
            AI-Powered Triage
          </span>
        )}
      </div>
    </motion.div>
  );

  return <LogoContent />;
};

export default Logo;