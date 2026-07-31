import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
        {subtitle && (
          <p className="text-neutral-500 mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </motion.div>
  );
};

export default PageHeader;
