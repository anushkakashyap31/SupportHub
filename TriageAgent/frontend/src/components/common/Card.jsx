/**
 * Reusable Card Component
 */

import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  hoverable = false,
  className = '',
}) => {
  const hoverClass = hoverable ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  return (
    <div className={`bg-white rounded-lg shadow-md ${hoverClass} ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="px-6 py-4">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;