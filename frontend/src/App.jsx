import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authSlice';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

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
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Home */}
          <Route
            path="/"
            element={
              <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-bold mb-4">🍽️ Welcome to FoodDelivery</h1>
                <p className="text-gray-600 mb-8">
                  Your favorite restaurants, delivered to your door.
                </p>
                <div className="text-gray-500 text-sm space-y-1">
                  <p>✅ PR #3: Services & Redux - Done</p>
                  <p>✅ PR #4: Navbar & Footer - Done</p>
                  <p>✅ PR #5: Login & Register - Current</p>
                  <p>⏳ PR #6: Profile - Coming soon</p>
                  <p>⏳ PR #7: Restaurants - Coming soon</p>
                </div>
                {isAuthenticated && user && (
                  <div className="mt-8 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded inline-block">
                    ✅ Logged in as: <strong>{user.first_name} {user.last_name}</strong> ({user.email})
                  </div>
                )}
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

