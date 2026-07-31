import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
import backgroundImage from '../assets/background.png';

const AuthLayout = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative"
      style={{
        backgroundColor: '#06091C',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-[#06091C]/40" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-2.5 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Linkly</span>
          </Link>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          className="glass-card px-6 py-8 sm:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
