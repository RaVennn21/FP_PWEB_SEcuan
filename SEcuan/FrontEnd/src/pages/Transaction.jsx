import React, { useState } from 'react';
import TransactionDetailPage from './TransactionDetail.jsx';

export default function TransactionPage({ onBack, user }) {
  // Sample transaction data (replace with API call later)
  const [transactions] = useState([
    {
      id: 1,
      game: 'Genshin Impact',
      amount: '300 Primogems',
      price: 'Rp. 73.000',
      date: '2025-12-03',
      time: '14:30',
      status: 'completed',
      uid: '501234567',
      server: 'Asia',
    },
    {
      id: 2,
      game: 'Honkai Star Rail',
      amount: '50 Stellar Jade',
      price: 'Rp. 12.000',
      date: '2025-12-02',
      time: '10:15',
      status: 'completed',
      uid: '601234567',
      server: 'Global',
    },
    {
      id: 3,
      game: 'Zenless Zone Zero',
      amount: '80 Coins',
      price: 'Rp. 20.000',
      date: '2025-12-01',
      time: '16:45',
      status: 'completed',
      uid: '701234567',
      server: 'Global',
    },
    {
      id: 4,
      game: 'Genshin Impact',
      amount: '980 Primogems',
      price: 'Rp. 239.000',
      date: '2025-11-30',
      time: '09:20',
      status: 'completed',
      uid: '501234567',
      server: 'Asia',
    },
    {
      id: 5,
      game: 'Honkai Star Rail',
      amount: 'Welkin Moon',
      price: 'Rp. 65.000',
      date: '2025-11-28',
      time: '13:00',
      status: 'pending',
      uid: '601234567',
      server: 'Global',
    },
    {
      id: 6,
      game: 'Genshin Impact',
      amount: '60 Primogems',
      price: 'Rp. 16.000',
      date: '2025-11-27',
      time: '11:30',
      status: 'completed',
      uid: '501234567',
      server: 'America',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchGame, setSearchGame] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const statusMatch = filterStatus === 'all' || tx.status === filterStatus;
    const gameMatch = tx.game.toLowerCase().includes(searchGame.toLowerCase());
    return statusMatch && gameMatch;
  });

  // Calculate totals
  const totalSpent = transactions
    .filter((tx) => tx.status === 'completed')
    .reduce((sum, tx) => {
      const amount = parseInt(tx.price.replace(/[^0-9]/g, ''));
      return sum + amount;
    }, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'failed':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'pending':
        return '⏱️';
      case 'failed':
        return '✕';
      default:
        return '•';
    }
  };

  // Show transaction detail page if selected
  if (selectedTransactionId) {
    const selectedTransaction = transactions.find((tx) => tx.id === selectedTransactionId);
    return (
      <TransactionDetailPage
        transaction={selectedTransaction}
        onBack={() => setSelectedTransactionId(null)}
        user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 border-b border-white/10 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Transaction History
              </h1>
            </div>
            <p className="text-gray-400 text-sm">{user?.username || 'Guest'}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Transactions */}
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-pink-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-white">{transactions.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-400">
                  {transactions.filter((tx) => tx.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-purple-400">
                  Rp. {totalSpent.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by Game */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Search Game
              </label>
              <input
                type="text"
                placeholder="Search by game name..."
                value={searchGame}
                onChange={(e) => setSearchGame(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Filter Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              >
                <option value="all">All Transactions</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSearchGame('');
                }}
                className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg font-semibold transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-pink-500/50 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Left Side - Transaction Details */}
                  <div className="flex-1 w-full">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🎮</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white truncate">
                            {tx.game}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              tx.status
                            )}`}
                          >
                            {getStatusIcon(tx.status)}{' '}
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{tx.amount}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span>{tx.date}</span>
                          <span>{tx.time}</span>
                          <span>UID: {tx.uid}</span>
                          <span>{tx.server}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Price & Action */}
                  <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-400">{tx.price}</p>
                      <p className="text-xs text-gray-500">Transaction ID: #{tx.id}</p>
                    </div>
                    <button
                      onClick={() => setSelectedTransactionId(tx.id)}
                      className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg font-semibold transition-all flex-shrink-0"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-12 backdrop-blur-sm text-center">
              <p className="text-gray-400 text-lg mb-2">No transactions found</p>
              <p className="text-gray-500 text-sm">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </div>

        {/* Empty State Help */}
        {filteredTransactions.length === 0 && transactions.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setFilterStatus('all');
                setSearchGame('');
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}