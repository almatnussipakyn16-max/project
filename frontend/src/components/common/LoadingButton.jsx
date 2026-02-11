import React from 'react';
import { motion } from 'framer-motion';

const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  return (
    <motion.button
      whileHover={{ scale: (loading || disabled) ? 1 : 1.02 }}
      whileTap={{ scale: (loading || disabled) ? 1 : 0.98 }}
      onClick={onClick}
      disabled={loading || disabled}
      type={type}
      className={`
        ${variants[variant]}
        ${className}
        px-6 py-3 rounded-xl font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default LoadingButton;
