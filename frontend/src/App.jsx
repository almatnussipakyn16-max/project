import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCurrentUser } from './store/slices/authSlice';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import HomePage from './pages/client/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RestaurantDetailPage from './pages/client/RestaurantDetailPage';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [initialLoading, setInitialLoading] = React.useState(true);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchCurrentUser()).finally(() => {
        setInitialLoading(false);
      });
    } else {
      setInitialLoading(false);
    }
  }, [dispatch, isAuthenticated, user]);

  if (initialLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;

