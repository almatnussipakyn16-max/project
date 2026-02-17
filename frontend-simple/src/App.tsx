import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/auth';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RestaurantDetail from './pages/restaurants/Detail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import OrderList from './pages/orders/List';
import OrderDetail from './pages/orders/Detail';
import ReservationList from './pages/reservations/List';
import ReservationCreate from './pages/reservations/Create';
import Profile from './pages/profile/Profile';
import Favorites from './pages/profile/Favorites';
import SupportTickets from './pages/support/Tickets';
import SupportCreate from './pages/support/Create';
import FAQ from './pages/FAQ';
import Promotions from './pages/Promotions';
import OwnerDashboard from './pages/owner/Dashboard';

// QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Owner Route Component (requires RESTAURANT_OWNER role)
const OwnerRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'RESTAURANT_OWNER') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/promotions" element={<Promotions />} />
                
                {/* Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reservations"
                  element={
                    <ProtectedRoute>
                      <ReservationList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reservations/create"
                  element={
                    <ProtectedRoute>
                      <ReservationCreate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support"
                  element={
                    <ProtectedRoute>
                      <SupportTickets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support/create"
                  element={
                    <ProtectedRoute>
                      <SupportCreate />
                    </ProtectedRoute>
                  }
                />
                
                {/* Owner Panel Routes */}
                <Route
                  path="/owner"
                  element={
                    <OwnerRoute>
                      <OwnerDashboard />
                    </OwnerRoute>
                  }
                />
                <Route
                  path="/owner/dashboard"
                  element={
                    <OwnerRoute>
                      <OwnerDashboard />
                    </OwnerRoute>
                  }
                />
                
                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;