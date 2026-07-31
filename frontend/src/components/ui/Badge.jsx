import React from 'react';

const Badge = ({ variant = 'active', children, dot = true }) => {
  const variants = {
    active: 'badge-active',
    inactive: 'badge-inactive',
    expired: 'badge-expired',
  };

  const dotColors = {
    active: 'bg-emerald-500',
    inactive: 'bg-red-500',
    expired: 'bg-amber-500',
  };

  const selectedVariant = variants[variant] || variants.active;
  const selectedDot = dotColors[variant] || dotColors.active;

  return (
    <span className={`badge ${selectedVariant}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${selectedDot}`}></span>}
      {children}
    </span>
  );
};

export default Badge;
