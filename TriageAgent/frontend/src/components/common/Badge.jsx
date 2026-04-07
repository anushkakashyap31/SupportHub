/**
 * Reusable Badge Component
 */

import React from 'react';
import { URGENCY_COLORS, INTENT_COLORS, STATUS_COLORS } from '../../utils/constants';

const Badge = ({
  children,
  variant = 'default',
  type = 'default',
  urgency,
  intent,
  status,
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border';
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  // Determine color based on type
  let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
  
  if (urgency) {
    colorClass = URGENCY_COLORS[urgency] || colorClass;
  } else if (intent) {
    colorClass = INTENT_COLORS[intent] || colorClass;
  } else if (status) {
    colorClass = STATUS_COLORS[status] || colorClass;
  }
  
  return (
    <span className={`${baseStyles} ${sizes[size]} ${colorClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;