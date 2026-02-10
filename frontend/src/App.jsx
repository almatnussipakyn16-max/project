import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/client/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RestaurantDetailPage from './pages/client/RestaurantDetailPage';
import AdminDashboard from './pages/admin/Dashboard';

// Layout
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </MainLayout>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;

