import React from 'react';

export function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div className={`g-card transition-all duration-300 ${hover ? 'g-card-hover cursor-pointer' : ''} ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function GlassCard({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/10 ${className}`}
      style={{ background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(12px)' }}>
      {children}
    </div>
  );
}
