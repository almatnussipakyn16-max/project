import React from 'react';

export const SkeletonBox = ({ width = '100%', height = '20px', className = '' }) => (
  <div 
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonRestaurantCard = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
    <SkeletonBox height="224px" className="rounded-none" />
    <div className="p-5 space-y-3">
      <SkeletonBox height="24px" width="70%" />
      <SkeletonBox height="16px" width="100%" />
      <SkeletonBox height="16px" width="90%" />
      <div className="flex gap-2">
        <SkeletonBox height="20px" width="60px" />
        <SkeletonBox height="20px" width="80px" />
      </div>
    </div>
  </div>
);

export const SkeletonOrderCard = () => (
  <div className="bg-white rounded-2xl shadow-md p-5 space-y-3">
    <div className="flex justify-between items-start">
      <SkeletonBox height="24px" width="120px" />
      <SkeletonBox height="28px" width="100px" />
    </div>
    <SkeletonBox height="20px" width="150px" />
    <SkeletonBox height="16px" width="200px" />
    <SkeletonBox height="40px" width="100%" />
  </div>
);

export const SkeletonMenuItem = () => (
  <div className="flex gap-4 p-4">
    <SkeletonBox width="96px" height="96px" className="rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonBox height="20px" width="60%" />
      <SkeletonBox height="16px" width="100%" />
      <SkeletonBox height="16px" width="80%" />
      <SkeletonBox height="24px" width="80px" />
    </div>
  </div>
);
