import React from 'react';

export function Input({ value, onChange, placeholder, type = 'text', icon, className = '', ...props }) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`g-input ${icon ? 'pl-10' : ''} ${className}`}
        {...props}
      />
    </div>
  );
}

export function Textarea({ value, onChange, placeholder, rows = 10, readOnly = false, className = '' }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder || 'Output will appear here...'}
      rows={rows}
      readOnly={readOnly}
      className={`g-textarea ${className}`}
    />
  );
}

export function Select({ value, onChange, children, className = '' }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`g-input ${className}`}>
      {children}
    </select>
  );
}
