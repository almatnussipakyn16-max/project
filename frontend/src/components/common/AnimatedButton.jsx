import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ children, className, onClick, disabled, type = 'button' }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
