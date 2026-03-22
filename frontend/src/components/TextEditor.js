import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function TextEditor({ value, onChange, label = 'Extracted Text', readOnly = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <button
          onClick={handleCopy}
          disabled={!value}
          className="text-xs btn-secondary py-1 px-3 disabled:opacity-40"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        rows={10}
        placeholder={readOnly ? 'Output will appear here...' : 'Extracted text will appear here...'}
        className="input resize-y font-mono text-sm leading-relaxed min-h-[200px]"
      />
    </div>
  );
}
