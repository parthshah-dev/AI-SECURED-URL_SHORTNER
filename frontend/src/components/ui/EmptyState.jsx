import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = 'No data found', 
  description = '', 
  action = null 
}) => {
  return (
    <motion.div
      className="py-16 px-4 flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-800 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
