import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ currentPage, onNavigate, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;
  const auth = useAuth();
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    ...(user ? [{ id: 'transaction', label: 'Transactions', icon: '📋' }] : []),
    { id: 'account', label: 'Account', icon: '👤' },
    // Admin link - only show if user is admin
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: '⚙️', adminOnly: true }] : []),
  ];

  const handleNavigate = (pageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-2xl">SEcuan</div>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline">
              Game Store
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
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
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Info & Logout (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">
                    {user.username}
                    {isAdmin && <span className="ml-1 text-red-400 font-semibold">(Admin)</span>}
                  </span>
                </div>
                <button
                  onClick={() => {
                  auth.logout();
                  onLogout();
                  onBack();
                }}
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
            className="md:hidden text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-2">
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
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.adminOnly && <span className="ml-auto text-xs bg-red-500/20 px-2 py-1 rounded text-red-400">ADMIN</span>}
              </button>
            ))}

            {user ? (
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">{user.username}</p>
                    {isAdmin && <p className="text-xs text-red-400 font-semibold">Admin Account</p>}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all text-sm"
                >
                  Logout
                </button>
              </div>
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