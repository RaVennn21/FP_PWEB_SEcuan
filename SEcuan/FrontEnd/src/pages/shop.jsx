import React, { useState } from 'react';
import { GAMES } from '../utils/constants';

export default function ShopPage({ game, onBack, user, onProceedToPayment }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [uid, setUid] = useState('');
  const [server, setServer] = useState(game?.servers?.[0] || 'Global');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [message, setMessage] = useState('');

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setMessage('');
  };

  const handleProceedToPayment = () => {
    // Validation
    if (!selectedPackage) {
      setMessage({ type: 'error', text: 'Please select a package first!' });
      return;
    }

    if (!uid || uid.trim() === '') {
      setMessage({ type: 'error', text: 'Please enter your UID!' });
      return;
    }

    if (!server) {
      setMessage({ type: 'error', text: 'Please select a server!' });
      return;
    }

    // Show payment modal
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    // Simulate payment processing
    setPaymentStatus('processing');
    
    // Simulate API call
    setTimeout(() => {
      const transaction = {
        id: Math.floor(Math.random() * 10000),
        game: game?.name || 'Unknown Game',
        amount: selectedPackage.amount,
        price: selectedPackage.price,
        uid: uid,
        server: server,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID'),
      };

      setPaymentStatus('success');
      setMessage({
        type: 'success',
        text: `Payment successful! Transaction ID: #${transaction.id}`,
      });

      // Call callback if provided
      if (onProceedToPayment) {
        onProceedToPayment(transaction);
      }

      // Reset after 2 seconds
      setTimeout(() => {
        setShowPaymentModal(false);
        setSelectedPackage(null);
        setUid('');
        setPaymentStatus(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: game?.backgroundImage ? `url(${game.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'rgba(16, 16, 32, 0.65)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        {/* Game Header Section */}
        <section className="min-h-screen relative overflow-hidden" style={{ pointerEvents: 'auto' }}>
          <div className="relative z-10 min-h-screen pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="back-button flex items-center gap-2 text-white bg-black bg-opacity-40 hover:bg-opacity-60 px-6 py-3 rounded-full mb-8 transition-all backdrop-blur-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-semibold">Back to Games</span>
              </button>

              {/* Game Content */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-70vh">
                {/* Left Side - Character Image */}
                <div className="flex-1 flex justify-center lg:justify-start">
                  <img
                    src={game?.characterImage}
                    alt={game?.name}
                    className="max-w-full h-auto object-contain drop-shadow-2xl"
                    style={{
                      maxHeight: '70vh',
                      filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))',
                    }}
                  />
                </div>

                {/* Right Side - Text Content */}
                <div className="flex-1 flex flex-col gap-8 max-w-xl">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
                    {game?.name}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-white leading-relaxed drop-shadow-md">
                    {game?.description}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() =>
                        document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' })
                      }
                      className="btn-primary px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all"
                    >
                      Buy {game?.characterName}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shop Section */}
        <section id="shop-section" className="min-h-screen relative overflow-hidden pb-32" style={{ pointerEvents: 'auto' }}>
          <div className="relative z-10 pt-16 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Messages */}
              {message && (
                <div
                  className={`mb-8 p-4 rounded-lg border ${
                    message.type === 'error'
                      ? 'bg-red-500/20 border-red-500/30 text-red-400'
                      : 'bg-green-500/20 border-green-500/30 text-green-400'
                  }`}
                >
                  {message.type === 'error' ? '✕' : '✓'} {message.text}
                </div>
              )}

              {/* Character Info Card */}
              <div className="bg-white bg-opacity-95 rounded-3xl shadow-2xl p-8 mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Character Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={game?.characterImage}
                      alt={game?.characterName}
                      className="w-48 h-48 object-cover rounded-2xl shadow-lg"
                    />
                  </div>

                  {/* Character Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                      <h2 className="text-3xl font-bold text-gray-800">{game?.characterName}</h2>
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {game?.characterRarity} ⭐
                      </span>
                    </div>
                    <p className="text-gray-600 text-lg">{game?.description}</p>
                  </div>
                </div>
              </div>

              {/* Currency Packages Grid */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Select a Package</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {game?.packages?.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                      className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                        selectedPackage?.id === pkg.id
                          ? 'ring-4 ring-pink-500 scale-105'
                          : ''
                      }`}
                    >
                      {/* Crystal Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-10 h-10 text-white fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.5 7h7.5l-6 5 2.5 8-7-5-7 5 2.5-8-6-5h7.5z" />
                          </svg>
                        </div>
                      </div>

                      {/* Package Details */}
                      <div className="text-center">
                        {pkg.special && (
                          <>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">{pkg.special}</h4>
                            <p className="text-sm text-gray-600 mb-3">Special Offer</p>
                          </>
                        )}
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{pkg.amount}</h4>
                        <p className="text-sm text-gray-600 mb-3">Crystals</p>
                        {pkg.bonus && (
                          <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                            {pkg.bonus}
                          </span>
                        )}
                        <p className="text-2xl font-bold text-purple-600">{pkg.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Common Questions</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Is this payment secure?</h4>
                    <p className="text-gray-300">Yes, all transactions are encrypted and secure.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">When will I receive my purchase?</h4>
                    <p className="text-gray-300">Instant delivery upon successful payment.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Can I get a refund?</h4>
                    <p className="text-gray-300">Digital purchases cannot be refunded once delivered.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Bottom Checkout Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* UID Input */}
            <div className="flex-1 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Your UID (e.g., 501XXXXXX)"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-white focus:outline-none focus:border-purple-600 text-gray-800 font-medium"
              />
            </div>

            {/* Server Dropdown */}
            <div className="flex-1 w-full lg:w-auto">
              <select
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-white focus:outline-none focus:border-purple-600 text-gray-800 font-medium bg-white"
              >
                {game?.servers?.map((srv) => (
                  <option key={srv} value={srv}>
                    {srv}
                  </option>
                ))}
              </select>
            </div>

            {/* Proceed Button */}
            <div className="w-full lg:w-auto">
              <button
                onClick={handleProceedToPayment}
                className="w-full lg:w-auto bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Payment</h3>

            <div className="space-y-4 mb-6 bg-slate-700/50 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Game:</span>
                <span className="text-white font-semibold">{game?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white font-semibold">{selectedPackage?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price:</span>
                <span className="text-pink-400 font-bold text-lg">{selectedPackage?.price}</span>
              </div>
              <div className="border-t border-white/10 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">UID:</span>
                  <span className="text-white">{uid}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Server:</span>
                  <span className="text-white">{server}</span>
                </div>
              </div>
            </div>

            {paymentStatus === 'processing' && (
              <div className="text-center mb-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div>
                <p className="text-gray-400 text-sm mt-2">Processing payment...</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center mb-6">
                <p className="text-green-400 font-semibold">✓ Payment Successful!</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentStatus(null);
                }}
                disabled={paymentStatus === 'processing'}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={paymentStatus !== null}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {paymentStatus === 'processing' ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}