import { FC } from 'react';
import type { OrderStatus as OrderStatusType } from '../../api/types';
import { ORDER_STATUSES } from '../../utils/constants';

interface OrderStatusProps {
  status: OrderStatusType;
  showProgress?: boolean;
}

const STATUS_FLOW: OrderStatusType[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export const OrderStatus: FC<OrderStatusProps> = ({ status, showProgress = true }) => {
  const statusConfig = ORDER_STATUSES[status];
  const currentIndex = STATUS_FLOW.indexOf(status);

  if (!showProgress) {
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {STATUS_FLOW.map((s, index) => {
          const config = ORDER_STATUSES[s];
          const isActive = index <= currentIndex;
          const isCurrent = s === status;

          return (
            <div key={s} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}
                    ${isCurrent ? 'ring-4 ring-primary-200' : ''}
                  `}
                >
                  {isActive ? '✓' : index + 1}
                </div>
                <span className={`text-xs mt-2 text-center ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {config.label}
                </span>
              </div>
              {index < STATUS_FLOW.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 ${
                    index < currentIndex ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                  style={{ zIndex: -1 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
