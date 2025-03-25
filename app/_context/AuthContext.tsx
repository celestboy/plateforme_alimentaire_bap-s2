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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  // Function to check token validity
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
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserId(null);
        return false;
      }

      // Token is valid
      if (!isAuthenticated) {
        setIsAuthenticated(true);
        setUserId(decoded.userId || null);
        console.log("Auth check successful, user ID:", decoded.userId);
      }

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

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    // This helps ensure we're only running in the browser
    if (typeof window !== "undefined") {
      checkAuth();
    }
  }, [checkAuth]);

  // Check auth status on window focus
  useEffect(() => {
    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkAuth]);

  // Set up periodic checks (every minute)
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

      console.log("Login successful, user ID:", decoded.userId);

      // Clear any existing notifications to start fresh
      localStorage.removeItem("chatNotifications");
    } catch (error) {
      console.error("Invalid token on login:", error);
      localStorage.removeItem("token");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("chatNotifications");
    setIsAuthenticated(false);
    setUserId(null);
    router.push("/");
  }, [router]);

  const contextValue = {
    isAuthenticated,
    userId,
    login,
    logout,
    checkAuth,
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
