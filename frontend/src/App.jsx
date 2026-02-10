import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authSlice';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import RestaurantListPage from './pages/RestaurantListPage';
import RestaurantDetailPage from './pages/client/RestaurantDetailPage';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [initialLoading, setInitialLoading] = React.useState(() => {
    return isAuthenticated && !user;
  });

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchCurrentUser()).finally(() => {
        setInitialLoading(false);
      });
    }
  }, [dispatch, isAuthenticated, user]);

  if (initialLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurants" element={<RestaurantListPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Home - redirect to restaurants */}
          <Route path="/" element={<RestaurantListPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

