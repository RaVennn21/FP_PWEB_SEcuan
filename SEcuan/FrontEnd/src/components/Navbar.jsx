import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ currentPage, onNavigate, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    ...(user ? [{ id: 'transaction', label: 'Transactions', icon: '📋' }] : []),
    { id: 'account', label: 'Account', icon: '👤' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: '⚙️', adminOnly: true }] : []),
  ];

  const handleNavigate = (pageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-800/50 backdrop-blur border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              SEcuan
            </h1>
            <p className="text-gray-400 text-sm hidden md:block">Game Store</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                    : item.adminOnly
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title={item.adminOnly ? 'Admin Only' : ''}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* User Info & Logout (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-white text-sm font-semibold">{user.username}</span>
                  {isAdmin && <span className="text-red-400 text-xs bg-red-500/20 px-2 py-1 rounded">Admin</span>}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigate('account')}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg font-semibold transition-all text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white transition text-xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                    : item.adminOnly
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                {item.label}
                {item.adminOnly && <span className="text-red-400 text-xs ml-auto">ADMIN</span>}
              </button>
            ))}

            <hr className="border-white/10 my-2" />

            {user ? (
              <>
                <div className="px-4 py-2 text-gray-300 text-sm">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-gray-400">{user.email}</p>
                  {isAdmin && <p className="text-red-400 text-xs mt-1">Admin Account</p>}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigate('account')}
                className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}