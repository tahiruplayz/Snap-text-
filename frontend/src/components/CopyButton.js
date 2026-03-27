import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} disabled={!text} className="s-btn s-btn-ghost s-btn-sm" style={{ gap: 5 }}>
      {copied ? <Check size={12} style={{ color: '#34d399' }} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
