import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiTruck, FiClock } from 'react-icons/fi';

const OrderTimeline = React.memo(({ order }) => {
  const steps = [
    {
      key: 'placed',
      label: 'Order Placed',
      icon: FiCheckCircle,
      time: order.created_at,
      completed: true,
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      icon: FiCheckCircle,
      time: order.confirmed_at,
      completed: ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status),
    },
    {
      key: 'preparing',
      label: 'Preparing',
      icon: FiPackage,
      time: order.preparing_at,
      completed: ['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status),
    },
    {
      key: 'delivery',
      label: 'Out for Delivery',
      icon: FiTruck,
      time: order.out_for_delivery_at,
      completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status),
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: FiCheckCircle,
      time: order.delivered_at,
      completed: order.status === 'DELIVERED',
    },
  ];

  // Skip timeline if cancelled
  if (order.status === 'CANCELLED') {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-3">❌</div>
        <div className="text-xl font-bold text-red-600">Order Cancelled</div>
        {order.cancelled_at && (
          <div className="text-gray-600 mt-2">
            {new Date(order.cancelled_at).toLocaleString()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.completed;

        return (
          <div key={step.key} className="relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              {/* Icon Circle */}
              <div className={`
                w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg
                ${isActive 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
                }
              `}>
                <Icon className="text-2xl" />
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className={`text-lg font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </div>
                {step.time && (
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(step.time).toLocaleString()}
                  </div>
                )}
                {!step.time && isActive && (
                  <div className="text-sm text-orange-600 font-medium mt-1 flex items-center gap-1">
                    <FiClock className="animate-pulse" />
                    In Progress...
                  </div>
                )}
              </div>
            </motion.div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className={`
                absolute left-7 top-14 w-0.5 h-12 -ml-px
                ${isActive ? 'bg-gradient-to-b from-green-500 to-green-600' : 'bg-gray-300'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
});

export default OrderTimeline;
