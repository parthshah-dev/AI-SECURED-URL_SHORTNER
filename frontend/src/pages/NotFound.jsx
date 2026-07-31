import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="text-8xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-3">Page Not Found</h2>
        <p className="text-neutral-500 mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button icon={Home} variant="gradient">
              Go Home
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button icon={ArrowLeft} variant="secondary">
              Go Back
            </Button>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
