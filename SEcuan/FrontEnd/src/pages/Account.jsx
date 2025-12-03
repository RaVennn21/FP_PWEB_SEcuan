import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';


export default function AccountPage({ onBack, user, onLogin, onRegister, onLogout }) {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState(user ? 'profile' : 'signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sign in state
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Register state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  // Change password state
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sign in handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signInData.email || !signInData.password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signInData.email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    const result = await auth.login(signInData.email, signInData.password);

    if (result.success) {
      setSuccessMessage('Sign in successful! Welcome back!');
      setTimeout(() => {
        setSignInData({ email: '', password: '', rememberMe: false });
        setActiveTab('profile');
      }, 1500);
    } else {
      setErrorMessage(result.message || 'Invalid email or password');
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (registerData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!registerData.acceptTerms) {
      setErrorMessage('Please accept the Terms & Conditions');
      return;
    }

    const result = await auth.register(
      registerData.username,
      registerData.email,
      registerData.password
    );

    if (result.success) {
      setSuccessMessage('Registration successful! Signing you in.');
      setTimeout(() => {
        setRegisterData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false,
        });
        setActiveTab('profile');
      }, 1500);
    } else {
      setErrorMessage(result.message || 'Registration failed');
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (
      !changePasswordData.currentPassword ||
      !changePasswordData.newPassword ||
      !changePasswordData.confirmPassword
    ) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    if (changePasswordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }
    const result = await auth.changePassword(
      changePasswordData.currentPassword,
      changePasswordData.newPassword
    );
    if (result.success) {
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => {
        setChangePasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }, 1500);
    } else {
      setErrorMessage(result.message);
    }
  };


  // Delete account handler
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!deleteAccountPassword) {
      setErrorMessage('Please enter your password');
      return;
    }
    const result = await auth.deleteAccount(deleteAccountPassword);
    if (result.success) {
      setSuccessMessage('Account deleted successfully. Redirecting...');
      setTimeout(() => {
        onLogout();
        onBack();
      }, 2000);
    } else {
      setErrorMessage(result.message);
    }
  };


  // User is logged in - show profile
  if (auth.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <div className="w-6"></div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {['profile', 'security', 'danger'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                    : 'bg-slate-800/50 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {tab === 'profile' && '👤 Profile'}
                {tab === 'security' && '🔒 Security'}
                {tab === 'danger' && '⚠️ Danger Zone'}
              </button>
            ))}
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg">
              ✓ {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg">
              ✕ {errorMessage}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                  <div className="px-4 py-3 rounded-lg bg-slate-700/50 border border-white/10 text-gray-300">
                    {auth.user.username}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                  <div className="px-4 py-3 rounded-lg bg-slate-700/50 border border-white/10 text-gray-300">
                    {auth.user.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Account Type</label>
                  <div className="px-4 py-3 rounded-lg bg-slate-700/50 border border-white/10">
                    <span className={`font-semibold ${auth.user.isAdmin ? 'text-red-400' : 'text-blue-400'}`}>
                      {auth.user.isAdmin ? '👑 Administrator' : '👤 Regular User'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Member Since</label>
                  <div className="px-4 py-3 rounded-lg bg-slate-700/50 border border-white/10 text-gray-300">
                    {new Date(auth.user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab - Change Password */}
          {activeTab === 'security' && (
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">🔒 Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={changePasswordData.currentPassword}
                    onChange={(e) =>
                      setChangePasswordData({
                        ...changePasswordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={changePasswordData.newPassword}
                    onChange={(e) =>
                      setChangePasswordData({
                        ...changePasswordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={changePasswordData.confirmPassword}
                    onChange={(e) =>
                      setChangePasswordData({
                        ...changePasswordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
                >
                  Change Password
                </button>
              </form>
            </div>
          )}

          {/* Danger Zone Tab - Delete Account */}
          {activeTab === 'danger' && (
            <div className="bg-slate-800/50 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-red-400 mb-6">⚠️ Danger Zone</h2>
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-300">
                  <span className="font-semibold">Warning:</span> Deleting your account is permanent and cannot be undone.
                  All your data will be deleted immediately.
                </p>
              </div>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all border border-red-500/30"
                >
                  🗑️ Delete Account
                </button>
              ) : (
                <form onSubmit={handleDeleteAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Enter your password to confirm deletion
                    </label>
                    <input
                      type="password"
                      value={deleteAccountPassword}
                      onChange={(e) => setDeleteAccountPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-red-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteAccountPassword('');
                      }}
                      className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Delete Account
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Logout Button */}
          <div className="mt-8">
            <button
              onClick={() => {
                auth.logout();
                onLogout();
                onBack();
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in - show sign in / register
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {['signin', 'signup'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {tab === 'signin' ? '🔓 Sign In' : '✍️ Sign Up'}
            </button>
          ))}
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm">
            ✓ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm">
            ✕ {errorMessage}
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleRegister} className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="your username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={registerData.acceptTerms}
                  onChange={(e) => setRegisterData({ ...registerData, acceptTerms: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label className="ml-2 text-sm text-gray-400">
                  I accept Terms & Conditions
                </label>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
              >
                Create Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}