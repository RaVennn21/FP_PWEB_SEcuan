import React from 'react';

// Admin Guard Component - Protects admin routes
export default function AdminGuard({ user, children, onUnauthorized }) {
  // Check if user exists and has admin role
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  // If not admin, show access denied message
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You do not have permission to access the admin dashboard. This area is restricted to administrators only.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Current Status:</span>{' '}
              <span className="text-red-400">
                {user ? 'Logged in as Regular User' : 'Not Logged In'}
              </span>
            </p>
            {user && (
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Username:</span>{' '}
                <span className="text-gray-300">{user.username}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => onUnauthorized?.()}
            className="w-full mt-6 px-6 py-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold rounded-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If admin, render children (admin page)
  return children;
}