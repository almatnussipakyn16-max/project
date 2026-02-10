import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  variant = 'primary',
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`
        ${variants[variant]}
        ${className}
        px-6 py-3 rounded-lg font-semibold
        shadow-md hover:shadow-lg
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
