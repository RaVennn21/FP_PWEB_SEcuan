import React from 'react';
import { GAMES } from '../utils/constants.js';

export default function GameCard({ game, onClick }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden w-full mx-auto transform hover:scale-105"
      onClick={onClick}
    >
      <img
        src={game.image}
        alt={game.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
        <p className="text-lg font-semibold">{game.name}</p>
      </div>
    </div>
  );
}
