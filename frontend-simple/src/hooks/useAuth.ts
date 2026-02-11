import { useAuthStore } from '../store/auth';
import { authApi } from '../api/auth';
import type { LoginRequest, RegisterRequest } from '../api/types';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, clearAuth, updateUser } = useAuthStore();

  const login = async (credentials: LoginRequest) => {
    const data = await authApi.login(credentials);
    setAuth(data.user, data.access, data.refresh);
    return data;
  };

  const register = async (userData: RegisterRequest) => {
    const user = await authApi.register(userData);
    // После регистрации автоматически входим
    const loginData = await authApi.login({
      email: userData.email,
      password: userData.password,
    });
    setAuth(loginData.user, loginData.access, loginData.refresh);
    return user;
  };

  const logout = () => {
    authApi.logout();
    clearAuth();
  };

  const refreshUserData = async () => {
    if (!isAuthenticated) return;
    const userData = await authApi.getCurrentUser();
    updateUser(userData);
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUserData,
  };
};
