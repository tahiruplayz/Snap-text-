import React from 'react';

export function Spinner({ size = 16 }) {
  return (
    <div style={{ width: size, height: size, borderWidth: 2, borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.15)', borderTopColor: '#3b82f6', borderRadius: '50%' }}
      className="anim-spin flex-shrink-0" />
  );
}

export function PageLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-64">
      <Spinner size={28} />
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  );
}
