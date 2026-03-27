import React from 'react';

export default function ProgressBar({ progress = 0, label }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">{label}</p>
          <p className="text-xs text-slate-500">{progress}%</p>
        </div>
      )}
      <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
