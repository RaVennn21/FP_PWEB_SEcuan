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
  const { user, logout } = useAuth();

  const openGame = (game) => {
    setSelectedGame(game);
    setPage('shop');
  };

  const handleLogout = () => {
    logout();
    setPage('home');
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onSelectGame={openGame} />;
      case 'shop':
        return <ShopPage game={selectedGame} onBack={() => setPage('home')} />;
      case 'account':
        return <Account onBack={() => setPage('home')} />;
      case 'transaction':
        return <TransactionPage onBack={() => setPage('home')} />;
      case 'admin':
        return (
          <AdminGuard user={user} onUnauthorized={() => setPage('home')}>
            <AdminPage onBack={() => setPage('home')} user={user} />
          </AdminGuard>
        );
      case 'payment':
        return <Payment onBack={() => setPage('home')} />;
      default:
        return <HomePage onSelectGame={openGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar
        currentPage={page}
        onNavigate={setPage}
        user={user}
        onLogout={handleLogout}
      />

      <main className="mt-8 px-4">
        {renderPage()}
      </main>
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