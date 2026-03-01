import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authAPI } from '../utils/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, additionalData?: any) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('gamisaviya_user');
        const token = localStorage.getItem('gamisaviya_token');
        
        if (savedUser && token) {
          // Verify session with backend
          const response = await authAPI.getSession();
          if (response.success && response.user) {
            setUser(response.user);
          } else {
            // Session invalid, clear local storage
            localStorage.removeItem('gamisaviya_user');
            localStorage.removeItem('gamisaviya_token');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // Clear invalid session
        localStorage.removeItem('gamisaviya_user');
        localStorage.removeItem('gamisaviya_token');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authAPI.signin(email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('gamisaviya_user', JSON.stringify(response.user));
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.signout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('gamisaviya_user');
      localStorage.removeItem('gamisaviya_token');
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    additionalData?: any
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      
      const userData = {
        email,
        password,
        name,
        role: role || 'buyer',
        ...additionalData,
      };

      const response = await authAPI.signup(userData);
      
      if (response.success && response.user) {
        // For sellers, don't auto-login as they need approval
        if (role === 'seller') {
          return { 
            success: true, 
            message: response.message || 'Seller account created. Awaiting admin approval.'
          };
        }
        
        // For buyers and admins, auto-login
        setUser(response.user);
        localStorage.setItem('gamisaviya_user', JSON.stringify(response.user));
        
        // Get the access token by signing in
        const signinResponse = await authAPI.signin(email, password);
        if (signinResponse.success && signinResponse.accessToken) {
          return { success: true, message: 'Account created successfully' };
        }
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration failed:', error);
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
