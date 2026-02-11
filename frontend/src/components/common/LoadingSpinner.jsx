import React from 'react';

const LoadingSpinner = React.memo(({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-b-2 border-orange-600 ${sizeClasses[size]}`}></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="py-12">{spinner}</div>;
});

export default LoadingSpinner;
