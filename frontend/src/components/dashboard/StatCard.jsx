import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle }) => {
  const colorMap = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      border: 'border-primary-100',
    },
    success: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    warning: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-100',
    },
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-500',
      border: 'border-red-100',
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-100',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <h3 className="text-3xl font-bold text-neutral-900 mt-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg} ${colors.border} border`}>
          {Icon && <Icon className={`w-6 h-6 ${colors.icon}`} />}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
