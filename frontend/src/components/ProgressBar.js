import React from 'react';

export default function ProgressBar({ progress = 0, label }) {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <p className="text-xs text-slate-400">{label} — {progress}%</p>}
      <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
