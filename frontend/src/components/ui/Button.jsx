import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  isLoading = false,
  disabled = false,
  icon = null,
  onClick,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const selectedVariant = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      type={type}
      className={`${baseClasses} ${selectedVariant} px-4 py-2 ${className}`}
      disabled={isLoading || disabled}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
      )}
      {!isLoading && icon && (
        <FontAwesomeIcon icon={icon} className="mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;
