import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, UserProfile, AdminProfile } from './store';

type User = UserProfile | AdminProfile | null;

interface AuthContextType {
  user: User;
  loginUser: (username: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  loginAdmin: (email: string, code: string, pin: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Check local storage for persisted session
    const stored = localStorage.getItem('make_app_session');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('make_app_session');
      }
    }
  }, []);

  const loginUser = async (username: string, pin: string) => {
    // Check if user exists
    let userProfile = await api.getUser(username);
    
    if (!userProfile) {
      // For this prototype, we'll auto-register if not found, or we could return error
      // Prompt says "Sign In/Sign Up with Username and 6-digit number". 
      // Let's create if not exists for smooth onboarding.
      userProfile = await api.createUser(username, pin);
    } else {
      if (userProfile.pin !== pin) {
        return { success: false, message: 'Invalid PIN' };
      }
    }

    setUser(userProfile);
    localStorage.setItem('make_app_session', JSON.stringify(userProfile));
    return { success: true };
  };

  const loginAdmin = async (email: string, code: string, pin: string) => {
    // Hardcoded per prompt: mawsisocial@gmail.com / ADMIN / 888999
    if (email === 'mawsisocial@gmail.com' && code === 'ADMIN' && pin === '888999') {
      const admin: AdminProfile = { email, role: 'admin' };
      setUser(admin);
      localStorage.setItem('make_app_session', JSON.stringify(admin));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('make_app_session');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loginUser,
      loginAdmin,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
