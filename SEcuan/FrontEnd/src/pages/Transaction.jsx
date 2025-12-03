import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import TransactionDetailPage from './TransactionDetail.jsx';

export default function TransactionPage({ onBack }) {
  const { user, fetchUserTransactions } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchGame, setSearchGame] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Load transactions from backend when page opens / user changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      // If not logged in, nothing to load
      if (!user) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetchUserTransactions(); // from AuthContext
        if (res.success) {
          const raw = res.data || [];

          // Map backend fields -> UI fields
          const mapped = raw.map((tx) => {
            const created = tx.date || tx.createdAt;
            let date = '';
            let time = '';

            if (created) {
              const d = new Date(created);
              if (!isNaN(d)) {
                date = d.toLocaleDateString('id-ID');
                time = d.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
              }
            }

            return {
              id: tx._id,
              game: tx.gameName,
              amount: tx.packageAmount,
              price: tx.price,
              date,
              time,
              status: tx.status || 'completed',
              uid: tx.uid,
              server: tx.server,
            };
          });

          setTransactions(mapped);
        } else {
          setError(res.message || 'Failed to load transactions');
        }
      } catch (e) {
        console.error('Fetch error:', e);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, fetchUserTransactions]);

  const normalizePriceToNumber = (price) => {
    if (!price) return 0;
    if (typeof price === 'number') return price;
    const digits = price.toString().replace(/[^0-9]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  };

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);

  // Stats
  const totalSpent = transactions
    .filter((tx) => tx.status === 'completed')
    .reduce((sum, tx) => sum + normalizePriceToNumber(tx.price), 0);

  const completedCount = transactions.filter((tx) => tx.status === 'completed').length;
  const pendingCount = transactions.filter((tx) => tx.status === 'pending').length;
  const failedCount = transactions.filter((tx) => tx.status === 'failed').length;

  // Filters
  const filteredTransactions = transactions
    .filter((tx) => (filterStatus === 'all' ? true : tx.status === filterStatus))
    .filter((tx) =>
      searchGame.trim()
        ? tx.game.toLowerCase().includes(searchGame.trim().toLowerCase())
        : true
    );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/40 text-green-300';
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300';
      case 'failed':
        return 'bg-red-500/10 border-red-500/40 text-red-300';
      default:
        return 'bg-slate-500/10 border-slate-500/40 text-slate-300';
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

  const handleOpenDetail = (tx) => {
    setSelectedTransaction(tx);
  };

  const handleBackFromDetail = () => {
    setSelectedTransaction(null);
  };

  // If viewing detail → show detail page
  if (selectedTransaction) {
    return (
      <TransactionDetailPage
        transaction={selectedTransaction}
        onBack={handleBackFromDetail}
        user={user}
      />
    );
  }

  // Check if user is logged in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-400 text-lg">Please log in to view your transactions</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">My Transactions</h2>
        <p className="text-gray-400">
          Signed in as <span className="text-pink-400">{user.username || user.email}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-semibold mb-2">Total Spent</p>
          <p className="text-2xl font-bold text-pink-400">{formatRupiah(totalSpent)}</p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-semibold mb-2">Completed</p>
          <p className="text-2xl font-bold text-green-400">{completedCount}</p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-semibold mb-2">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm font-semibold mb-2">Failed</p>
          <p className="text-2xl font-bold text-red-400">{failedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search game..."
            value={searchGame}
            onChange={(e) => setSearchGame(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      )}

      {/* Transactions List */}
      {!loading && filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <button
              key={tx.id}
              onClick={() => handleOpenDetail(tx)}
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-4 text-left hover:bg-slate-800/80 transition-all group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold group-hover:text-pink-400 transition-colors">
                    {tx.game}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    UID: {tx.uid} • Server: {tx.server}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {tx.date} at {tx.time}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-white font-semibold">{tx.amount}</p>
                  <p className="text-pink-400 font-bold">{tx.price}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                    {getStatusIcon(tx.status)} {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}