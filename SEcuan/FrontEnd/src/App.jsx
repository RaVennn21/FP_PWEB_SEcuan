import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/shop.jsx';
import Account from './pages/Account.jsx';
import Payment from './pages/payment.jsx';
import TransactionPage from './pages/Transaction.jsx';
import AdminPage from './pages/admin.jsx';
import AdminGuard from './components/Admin.jsx';
import { GAMES } from './utils/constants.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function AppInner() {
  const [page, setPage] = useState('home');
  const [selectedGame, setSelectedGame] = useState(GAMES[0]);
  const { user, login, register, logout } = useAuth();

  const openGame = (game) => {
    setSelectedGame(game);
    setPage('shop');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar current={page} onNavigate={setPage} user={user} />
      {page === 'home' && <HomePage onSelectGame={openGame} />}
      {page === 'shop' && <ShopPage game={selectedGame} onBack={() => setPage('home')} />}
      {page === 'account' && (
        <Account
          onBack={() => setPage('home')}
          user={user}
          onLogin={(e, p) => login(e, p).success}
          onRegister={(u, e, p) => register(u, e, p).success}
          onLogout={logout}
        />
      )}
      {page === 'payment' && <Payment onBack={() => setPage('home')} />}
      {page === 'transaction' && <TransactionPage onBack={() => setPage('home')} />}
      {page === 'admin' && <AdminPage onBack={() => setPage('home')} />}
      {page === 'admin' && (
        <AdminGuard user={user} onUnauthorized={() => setPage('home')}>
        <AdminPage onBack={() => setPage('home')} user={user} />
        </AdminGuard>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

