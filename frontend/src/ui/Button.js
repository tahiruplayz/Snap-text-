import React from 'react';

export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', className = '' }) {
  const sizes = { sm: 'px-3 py-1.5 text-xs rounded-lg', md: 'px-4 py-2 text-sm rounded-xl', lg: 'px-6 py-3 text-sm rounded-xl' };
  const base = `${sizes[size]} font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none ${className}`;
  if (variant === 'primary') return <button type={type} onClick={onClick} disabled={disabled} className={`g-btn ${base}`}>{children}</button>;
  if (variant === 'ghost')   return <button type={type} onClick={onClick} disabled={disabled} className={`g-ghost ${base}`}>{children}</button>;
  if (variant === 'danger')  return <button type={type} onClick={onClick} disabled={disabled} className={`g-ghost text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/30 ${base}`}>{children}</button>;
  return <button type={type} onClick={onClick} disabled={disabled} className={`g-ghost ${base}`}>{children}</button>;
}

export function IconBtn({ children, onClick, title, className = '', active = false }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer
        ${active ? 'bg-blue-500/10 text-blue-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/10'}
        ${className}`}
    >
      {children}
    </button>
  );
}
