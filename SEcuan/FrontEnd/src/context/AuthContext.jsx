import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Define admin emails
const ADMIN_EMAILS = ['admin@example.com', 'admin@gamerecharge.com'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const register = (username, email, password) => {
    if (users.find((u) => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Check if email is admin email
    const isAdmin = ADMIN_EMAILS.includes(email);

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password,
      role: isAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return { success: true, message: 'Registration successful' };
  };

  const login = (email, password) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Invalid email or password' };
    setUser(found);
    return { success: true, message: 'Login successful' };
  };

  const logout = () => setUser(null);

  // Change password
  const changePassword = (currentPassword, newPassword) => {
    if (!user) return { success: false, message: 'User not logged in' };
    
    if (user.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    if (newPassword.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters' };
    }

    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    return { success: true, message: 'Password changed successfully' };
  };

  // Delete account
  const deleteAccount = (password) => {
    if (!user) return { success: false, message: 'User not logged in' };
    
    if (user.password !== password) {
      return { success: false, message: 'Password is incorrect' };
    }

    setUsers(users.filter(u => u.id !== user.id));
    setUser(null);
    return { success: true, message: 'Account deleted successfully' };
  };

  // Add transaction
  const addTransaction = (transactionData) => {
    const newTransaction = {
      id: transactions.length + 1,
      ...transactionData,
      userId: user?.id,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    return newTransaction;
  };

  // Update transaction status
  const updateTransactionStatus = (transactionId, status) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === transactionId ? { ...tx, status, updatedAt: new Date().toISOString() } : tx
      )
    );
    return { success: true, message: 'Transaction status updated' };
  };

  // Cancel transaction
  const cancelTransaction = (transactionId) => {
    const transaction = transactions.find((tx) => tx.id === transactionId);
    
    if (!transaction) {
      return { success: false, message: 'Transaction not found' };
    }

    if (transaction.status === 'completed') {
      return { success: false, message: 'Cannot cancel completed transaction' };
    }

    updateTransactionStatus(transactionId, 'cancelled');
    return { success: true, message: 'Transaction cancelled successfully' };
  };

  // Get user transactions
  const getUserTransactions = () => {
    if (!user) return [];
    return transactions.filter((tx) => tx.userId === user.id);
  };

  const value = {
    user,
    users,
    transactions,
    register,
    login,
    logout,
    changePassword,
    deleteAccount,
    addTransaction,
    updateTransactionStatus,
    cancelTransaction,
    getUserTransactions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};