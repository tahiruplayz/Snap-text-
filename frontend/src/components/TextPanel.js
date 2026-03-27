import React from 'react';
import CopyButton from './CopyButton';

export default function TextPanel({ label, value, onChange, readOnly = false, rows = 12, placeholder, badge }) {
  return (
    <div className="flex flex-col gap-2.5 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200">{label}</span>
          {badge && <span className="badge-purple text-xs">{badge}</span>}
        </div>
        <CopyButton text={value} />
      </div>
      <textarea
        value={value || ''}
        onChange={e => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        rows={rows}
        placeholder={placeholder || 'Output will appear here...'}
        className="textarea flex-1 min-h-0"
      />
    </div>
  );
}
