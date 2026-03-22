import React from 'react';

export default function Spinner({ size = 16, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`border-2 border-surface-4 border-t-brand-blue rounded-full animate-spin flex-shrink-0 ${className}`}
    />
  );
}
