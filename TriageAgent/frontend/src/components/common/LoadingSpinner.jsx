/**
 * Loading Spinner Component
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} text-blue-600 animate-spin`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center py-8">
      {content}
    </div>
  );
};

export default LoadingSpinner;