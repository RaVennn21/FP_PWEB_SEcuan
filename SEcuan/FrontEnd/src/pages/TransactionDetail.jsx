import React, { useState } from 'react';

export default function TransactionDetailPage({ transaction, onBack, user }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(transaction?.status || '');
  const [message, setMessage] = useState('');
  const [currentTransaction, setCurrentTransaction] = useState(transaction);

  const handleCancel = () => {
    // Update status to cancelled
    const updatedTransaction = { ...currentTransaction, status: 'cancelled' };
    setCurrentTransaction(updatedTransaction);
    setMessage({ type: 'success', text: 'Transaction cancelled successfully' });
    setTimeout(() => {
      setShowCancelConfirm(false);
    }, 1500);
  };

  const handleUpdateStatus = () => {
    if (newStatus === transaction.status) {
      setMessage({ type: 'error', text: 'Please select a different status' });
      return;
    }
    setMessage({ type: 'success', text: `Status updated to ${newStatus}` });
    setTimeout(() => {
      setShowUpdateStatus(false);
    }, 1500);
  };

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Transaction not found</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      case 'cancelled':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 border-red-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 border-gray-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Transaction Details
          </h1>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-500/20 border-green-500/30 text-green-400'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm mb-6">
          {/* Transaction ID & Status */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
            <div>
              <p className="text-gray-400 text-sm">Transaction ID</p>
              <p className="text-2xl font-bold text-white">#{currentTransaction.id}</p>
            </div>
            <div
              className={`border rounded-lg px-4 py-2 font-semibold ${getStatusBg(currentTransaction.status)} ${getStatusColor(currentTransaction.status)}`}
            >
              {currentTransaction.status.charAt(0).toUpperCase() + currentTransaction.status.slice(1)}
            </div>
          </div>

          {/* Game & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Game</p>
              <p className="text-xl font-semibold text-white">{currentTransaction.game}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Amount</p>
              <p className="text-xl font-semibold text-pink-400">{currentTransaction.amount}</p>
            </div>
          </div>

          {/* Price & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Price</p>
              <p className="text-lg font-semibold text-green-400">{currentTransaction.price}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Date</p>
              <p className="text-lg font-semibold text-white">{currentTransaction.date}</p>
            </div>
          </div>

          {/* UID & Server */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Game UID</p>
              <p className="text-lg font-semibold text-white">{currentTransaction.uid}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Server</p>
              <p className="text-lg font-semibold text-white">{currentTransaction.server}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* User Actions - Cancel Button */}
          {currentTransaction.status !== 'completed' && currentTransaction.status !== 'cancelled' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">⏱️ Pending Transaction</h3>
              <p className="text-gray-300 mb-4">
                This transaction is still pending. You can cancel it if you've changed your mind.
              </p>

              {!showCancelConfirm ? (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 font-semibold rounded-lg transition-all"
                >
                  Cancel Transaction
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                    >
                      No, Keep It
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Completed Transaction */}
          {currentTransaction.status === 'completed' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-green-400 font-semibold">✓ This transaction has been completed</p>
            </div>
          )}

          {/* Cancelled Transaction */}
          {currentTransaction.status === 'cancelled' && (
            <div className="bg-gray-500/10 border border-gray-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-gray-400 font-semibold">⊘ This transaction has been cancelled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}