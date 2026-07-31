import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, size = 'default' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.default;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={`${spinnerSize} animate-spin text-primary-600`} />
          <span className="text-sm text-neutral-500 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`${spinnerSize} animate-spin text-primary-600`} />
    </div>
  );
};

export default Loader;
