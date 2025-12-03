import React from 'react';
import { GAMES } from '../utils/constants.js';
import GameCard from '../components/Gamecard.jsx';

export default function Home({ onSelectGame }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SEcuan
          </h1>
          <p className="text-xl text-gray-300 mb-2">Your Ultimate Gaming Top-Up Platform</p>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Get instant top-ups for your favorite games. Secure, fast, and reliable.
          </p>
        </section>

        {/* Games Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Choose Your Game
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GAMES.map((game) => (
              <div key={game.id} onClick={() => onSelectGame(game)}>
                <GameCard game={game} onClick={() => onSelectGame(game)} />
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Why Choose SEcuan?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-white mb-2">Instant Delivery</h3>
              <p className="text-gray-300 text-sm">Get your top-ups within seconds</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-white mb-2">100% Secure</h3>
              <p className="text-gray-300 text-sm">Your data is protected with encryption</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-white mb-2">Best Prices</h3>
              <p className="text-gray-300 text-sm">Competitive rates on all packages</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}