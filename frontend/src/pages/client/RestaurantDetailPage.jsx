import React from 'react';
import { useParams } from 'react-router-dom';

const RestaurantDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Restaurant Details</h1>
      <p className="text-gray-600">Restaurant ID: {id}</p>
      <p className="text-gray-600">Menu, ordering, and details coming soon...</p>
    </div>
  );
};

export default RestaurantDetailPage;
