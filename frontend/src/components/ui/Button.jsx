import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  onClick,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    outline: 'btn-outline',
    gradient: 'btn-gradient',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const selectedVariant = variantClasses[variant] || variantClasses.primary;
  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${selectedVariant} ${selectedSize} ${className}`}
      disabled={isLoading || disabled}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      )}
      {!isLoading && Icon && (
        <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
