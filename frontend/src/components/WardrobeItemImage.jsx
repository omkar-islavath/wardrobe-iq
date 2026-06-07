import React, { useState } from 'react';

const WardrobeItemImage = ({ src, category, color, className = '', showColor = false }) => {
  const [hasError, setHasError] = useState(false);

  // Normalize category
  const cat = (category || '').toLowerCase().trim();

  // Color mapping or gradient mapping based on category
  const getFallbackStyles = () => {
    switch (cat) {
      case 'shirt':
      case 't-shirt':
        return {
          bg: 'from-indigo-600 to-purple-600',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2 text-white/95">
              <path d="M15.4 7H19l2.5 6H18v8H6v-8H2.5L5 7h3.6a4 4 0 0 1 7.8 0z" />
            </svg>
          )
        };
      case 'pants':
      case 'jeans':
      case 'shorts':
        return {
          bg: 'from-emerald-600 to-teal-600',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2 text-white/95">
              <path d="M6 2h12v3l3 1v16h-6v-8h-2v8H3V6l3-1z" />
            </svg>
          )
        };
      case 'jacket':
        return {
          bg: 'from-blue-600 to-indigo-700',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2 text-white/95">
              <path d="M4 10h16v11H4z" />
              <path d="M12 2v8" />
              <path d="M8 2h8" />
              <path d="M4 6h16" />
            </svg>
          )
        };
      case 'shoes':
        return {
          bg: 'from-rose-500 to-orange-500',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2 text-white/95">
              <path d="M3 18h18c.6 0 1-.4 1-1v-2c0-1.7-1.3-3-3-3h-3c-1.1 0-2-.9-2-2V8c0-.6-.4-1-1-1H9c-.6 0-1 .4-1 1v4H5c-1.1 0-2 .9-2 2v3c0 .6.4 1 1 1z" />
              <path d="M11 18v-4" />
            </svg>
          )
        };
      case 'accessories':
      default:
        return {
          bg: 'from-amber-500 to-yellow-600',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2 text-white/95">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          )
        };
    }
  };

  if (hasError || !src) {
    const fallback = getFallbackStyles();
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br ${fallback.bg} relative ${className}`}>
        {fallback.icon}
        {showColor && color && (
          <span className="absolute bottom-2 text-[10px] font-bold text-white/90 bg-black/30 px-2 py-0.5 rounded-md capitalize">
            {color}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={category}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default WardrobeItemImage;
