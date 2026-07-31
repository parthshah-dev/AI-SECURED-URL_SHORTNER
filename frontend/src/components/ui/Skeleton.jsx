import React from 'react';

const Skeleton = ({ className = '', variant = 'line' }) => {
  const base = 'animate-pulse bg-neutral-200 rounded-lg';

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`card p-6 space-y-4 ${className}`}>
        <div className={`${base} h-4 w-1/3`} />
        <div className={`${base} h-8 w-1/2`} />
        <div className={`${base} h-3 w-1/4`} />
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={`flex items-center gap-4 px-6 py-4 ${className}`}>
        <div className={`${base} h-4 w-24`} />
        <div className={`${base} h-4 flex-1`} />
        <div className={`${base} h-4 w-16`} />
        <div className={`${base} h-4 w-20`} />
      </div>
    );
  }

  // Default line
  return <div className={`${base} h-4 ${className}`} />;
};

export default Skeleton;
