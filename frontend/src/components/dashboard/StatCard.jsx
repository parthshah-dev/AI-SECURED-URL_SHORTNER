import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
  };

  const selectedColor = colors[color] || colors.primary;

  return (
    <div className="card p-6 flex items-center">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${selectedColor}`}>
        <FontAwesomeIcon icon={icon} className="text-2xl" />
      </div>
      <div className="ml-5">
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        <h3 className="text-2xl font-bold text-neutral-900 mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
