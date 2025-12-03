import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ShopPage({ game, onBack }) {
  const { user, createTransaction } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(game?.packages?.[0] || null);
  const [uid, setUid] = useState('');
  const [server, setServer] = useState(game?.servers?.[0] || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-400 text-lg">Game not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all"
        >
          Back
        </button>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation
    if (!user) {
      setMessage({ type: 'error', text: 'Please login first' });
      return;
    }

    if (!selectedPackage) {
      setMessage({ type: 'error', text: 'Please select a package' });
      return;
    }

    if (!uid.trim()) {
      setMessage({ type: 'error', text: 'Please enter your Game UID' });
      return;
    }

    if (!server) {
      setMessage({ type: 'error', text: 'Please select a server' });
      return;
    }

    setLoading(true);

    try {
      const result = await createTransaction({
        gameName: game.name,
        packageAmount: selectedPackage.amount || selectedPackage.special,
        price: selectedPackage.price,
        uid: uid.trim(),
        server: server,
      });

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: '✓ Top-up successful! Redirecting to transactions...' 
        });
        
        setTimeout(() => {
          onBack(); // Navigate back to home or transactions
        }, 2000);

        // Reset form
        setUid('');
        setSelectedPackage(game.packages?.[0] || null);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message || 'Transaction failed' 
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setMessage({ 
        type: 'error', 
        text: 'An error occurred. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Game Banner */}
        <div>
          <div className="rounded-lg overflow-hidden mb-4">
            <img
              src={game.backgroundImage || game.image}
              alt={game.name}
              className="w-full h-64 object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{game.name}</h1>
          <p className="text-gray-400 mb-6">{game.description}</p>

          {/* Character Info */}
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Featured Character</p>
            <h3 className="text-white font-semibold mb-1">{game.characterName}</h3>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★</span>
              <span className="text-gray-300">Rarity {game.characterRarity}</span>
            </div>
          </div>
        </div>

        {/* Purchase Form */}
        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Package Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Choose Package
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {game.packages && game.packages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPackage?.id === pkg.id
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold">
                      {pkg.amount || pkg.special}
                    </span>
                    {pkg.bonus && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        +{pkg.bonus}
                      </span>
                    )}
                  </div>
                  <span className={`text-lg font-bold ${
                    selectedPackage?.id === pkg.id ? 'text-pink-400' : 'text-gray-300'
                  }`}>
                    {pkg.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Server Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Game Server
            </label>
            <select
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            >
              <option value="">Select server...</option>
              {game.servers && game.servers.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>

          {/* UID Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Game UID
            </label>
            <input
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Enter your Game UID"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              Your unique identifier in {game.name}
            </p>
          </div>

          {/* Order Summary */}
          {selectedPackage && (
            <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 space-y-3">
              <h3 className="text-white font-semibold">Order Summary</h3>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Game:</span>
                <span className="text-white font-semibold">{game.name}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Package:</span>
                <span className="text-white font-semibold">
                  {selectedPackage.amount || selectedPackage.special}
                </span>
              </div>

              {selectedPackage.bonus && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bonus:</span>
                  <span className="text-green-400 font-semibold">+{selectedPackage.bonus}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">UID:</span>
                <span className="text-white font-semibold">{uid || '-'}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Server:</span>
                <span className="text-white font-semibold">{server || '-'}</span>
              </div>

              <hr className="border-white/10" />

              <div className="flex justify-between">
                <span className="text-white font-bold">Total:</span>
                <span className="text-pink-400 font-bold text-lg">
                  {selectedPackage.price}
                </span>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Login Reminder */}
          {!user && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
              ⚠️ Please login first to complete your purchase
            </div>
          )}

          {/* Checkout Button */}
          <button
            type="submit"
            disabled={loading || !user || !selectedPackage || !uid || !server}
            className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
              loading || !user || !selectedPackage || !uid || !server
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? 'Processing...' : `Checkout - ${selectedPackage?.price || 'Select Package'}`}
          </button>

          {/* Payment Methods Info */}
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 text-sm text-gray-400">
            <p className="font-semibold text-white mb-2">Payment Methods</p>
            <div className="space-y-1 text-xs">
              <p>💳 Credit/Debit Card</p>
              <p>💰 E-Wallet (GCash, Gopay, OVO)</p>
              <p>🏦 Bank Transfer</p>
              <p>📱 QRIS</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}