"use client";

import { useState, useEffect } from "react";
import { authService, type User } from "@/lib/auth";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: any }>;
  logout: () => void;
  refreshUser: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        const isAuth = authService.isAuthenticated();
        if (isAuth) {
          const userData = authService.getUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid tokens
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth state changes
    const handleAuthStateChange = (event: CustomEvent) => {
      console.log('Auth state changed:', event.detail);
      const { user, isAuthenticated } = event.detail;
      setUser(isAuthenticated ? user : null);
    };

    initAuth();

    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('authStateChanged', handleAuthStateChange as EventListener);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await authService.login(email, password);

      if (result.success) {
        const userData = authService.getUser();
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: { message: "Network error. Please try again." },
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    // Redirect to home page
    window.location.href = "/";
  };

  const refreshUser = () => {
    try {
      const userData = authService.getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user:", error);
      logout();
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };
}
