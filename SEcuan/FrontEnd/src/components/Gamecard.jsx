// src/components/Gamecard.jsx
import React from 'react';

export default function GameCard({ image, name, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        relative
        rounded-2xl overflow-hidden shadow-lg cursor-pointer
        hover:scale-105 transition duration-300
        w-[260px] h-[390px]
        mx-auto
      "
    >
      {/* Game Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />

      {/* Hover Overlay */}
      <div
        className="
          absolute inset-0 
          bg-black/60 
          opacity-0 
          hover:opacity-100 
          transition-opacity 
          flex items-center justify-center
        "
      >
        <span className="text-white text-2xl font-bold drop-shadow-lg">
          {name}
        </span>
      </div>
    </div>
  );
}

