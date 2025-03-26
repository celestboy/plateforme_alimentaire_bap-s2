"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: number;
  email: string;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
  refreshAuthState: () => void; // New function to explicitly refresh auth state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [authVersion, setAuthVersion] = useState(0); // Add version to trigger re-renders
  const router = useRouter();
  console.log("Auth version:", authVersion);
  // Function to check token validity and update state
  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("token");

    if (!token) {
      if (isAuthenticated) {
        setIsAuthenticated(false);
        setUserId(null);
      }
      return false;
    }

    try {
      // Use jwt-decode which works on the client side
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if token has expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        console.log("Token expired");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserId(null);
        return false;
      }

      // Token is valid
      setIsAuthenticated(true);
      setUserId(decoded.userId || null);
      console.log("Auth check successful, user ID:", decoded.userId);
      return true;
    } catch (error) {
      console.error("Error checking auth:", error);
      // Token is invalid
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUserId(null);
      return false;
    }
  }, [isAuthenticated]);

  // Force refresh of auth state - can be called from anywhere
  const refreshAuthState = useCallback(() => {
    checkAuth();
    setAuthVersion((v) => v + 1); // Increment version to force re-renders
  }, [checkAuth]);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    // This helps ensure we're only running in the browser
    if (typeof window !== "undefined") {
      checkAuth();
    }
  }, [checkAuth]);

  // Check auth status on window focus and storage events
  useEffect(() => {
    const handleFocus = () => {
      checkAuth();
    };

    // Listen for storage events to sync auth across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === null) {
        console.log("Storage changed, refreshing auth state");
        checkAuth();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkAuth]);

  // Set up periodic checks
  useEffect(() => {
    const authCheckInterval = setInterval(() => {
      checkAuth();
    }, 60000); // Check every minute

    return () => clearInterval(authCheckInterval);
  }, [checkAuth]);

  const login = useCallback((token: string) => {
    try {
      // Use jwt-decode which works on the client side
      const decoded = jwtDecode<JwtPayload>(token);

      // Store the token
      localStorage.setItem("token", token);

      // Update state
      setIsAuthenticated(true);
      setUserId(decoded.userId);
      setAuthVersion((v) => v + 1); // Force re-renders

      console.log("Login successful, user ID:", decoded.userId);

      // Clear any existing notifications to start fresh
      localStorage.removeItem("chatNotifications");
    } catch (error) {
      console.error("Invalid token on login:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("chatNotifications");
    setIsAuthenticated(false);
    setUserId(null);
    setAuthVersion((v) => v + 1); // Force re-renders
    router.push("/");
  }, [router]);

  const contextValue = {
    isAuthenticated,
    userId,
    login,
    logout,
    checkAuth,
    refreshAuthState, // Make available to consumers
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
