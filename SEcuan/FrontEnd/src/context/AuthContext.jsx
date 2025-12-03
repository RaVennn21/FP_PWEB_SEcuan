import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

const API_BASE = "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch (e) {
        console.error("Failed to parse auth from localStorage", e);
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever user/token change
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem("auth");
    }
  }, [user, token]);

  // REGISTER
  const register = async (username, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Register failed" };
      }

      // Backend returns user + token after registration
      if (data.token && data.user) {
        setUser(data.user);
        setToken(data.token);
      }

      return { success: true, message: data.message || "Register success" };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Network error during register" };
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Login failed" };
      }

      // Backend returns { user, token }
      setUser(data.user);
      setToken(data.token);

      return { success: true, message: data.message || "Login success" };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error during login" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const checkAdminStatus = async () => {
    if (!token) return { isAdmin: false };

    try {
      const res = await fetch(`${API_BASE}/admin/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return { isAdmin: data.isAdmin || false };
    } catch (err) {
      console.error("Admin check error:", err);
      return { isAdmin: false };
    }
  };

  // CREATE TRANSACTION (protected)
  const createTransaction = async (transactionData) => {
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    try {
      const res = await fetch(`${API_BASE}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Transaction failed",
        };
      }

      return {
        success: true,
        message: data.message || "Transaction success",
        data,
      };
    } catch (err) {
      console.error("Transaction error:", err);
      return { success: false, message: "Network error during transaction" };
    }
  };

  // GET TRANSACTIONS FOR CURRENT USER
  const fetchUserTransactions = async () => {
    if (!token) {
      return { success: false, message: "Not authenticated", data: [] };
    }

    try {
      const res = await fetch(`${API_BASE}/transaction`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to fetch transactions",
          data: [],
        };
      }

      return { success: true, data: data.data || [] };
    } catch (err) {
      console.error("Fetch transactions error:", err);
      return {
        success: false,
        message: "Network error while fetching transactions",
        data: [],
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!token) return { success: false, message: "Not authenticated" };

    try {
      const res = await fetch(`${API_BASE}/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      return res.ok && data.success
        ? { success: true, message: data.message }
        : { success: false, message: data.message };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error" };
    }
  };

  const deleteAccount = async (password) => {
    if (!token) return { success: false, message: "Not authenticated" };

    try {
      const res = await fetch(`${API_BASE}/deleteAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth");
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error" };
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    createTransaction,
    fetchUserTransactions,
    changePassword,
    deleteAccount,
    checkAdminStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
