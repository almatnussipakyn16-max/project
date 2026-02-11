import React from 'react';
import { FiClock, FiCheckCircle, FiPackage, FiTruck, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StatusBadge = React.memo(({ status, showIcon = true, size = 'md' }) => {
  const config = {
    PENDING: {
      icon: FiClock,
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    },
    CONFIRMED: {
      icon: FiCheckCircle,
      label: 'Confirmed',
      className: 'bg-blue-100 text-blue-700 border-blue-300',
    },
    PREPARING: {
      icon: FiPackage,
      label: 'Preparing',
      className: 'bg-purple-100 text-purple-700 border-purple-300',
    },
    OUT_FOR_DELIVERY: {
      icon: FiTruck,
      label: 'Out for Delivery',
      className: 'bg-orange-100 text-orange-700 border-orange-300',
    },
    DELIVERED: {
      icon: FiCheckCircle,
      label: 'Delivered',
      className: 'bg-green-100 text-green-700 border-green-300',
    },
    CANCELLED: {
      icon: FiXCircle,
      label: 'Cancelled',
      className: 'bg-red-100 text-red-700 border-red-300',
    },
  };

  const statusData = config[status] || config.PENDING;
  const Icon = statusData.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        inline-flex items-center gap-2 rounded-full font-semibold border-2
        ${statusData.className}
        ${sizeClasses[size]}
      `}
    >
      {showIcon && <Icon />}
      <span>{statusData.label}</span>
    </motion.div>
  );
});

export default StatusBadge;
