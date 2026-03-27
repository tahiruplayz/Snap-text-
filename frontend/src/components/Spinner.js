import React from 'react';

export default function Spinner({ size = 16, className = '' }) {
  return (
    <div
      style={{ width: size, height: size, borderWidth: 2 }}
      className={`border-white/20 border-t-blue-400 rounded-full animate-spin flex-shrink-0 ${className}`}
    />
  );
}
