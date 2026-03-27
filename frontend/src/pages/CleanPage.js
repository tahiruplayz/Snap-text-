import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import CopyButton from '../components/CopyButton';
import { useUsage } from '../context/UsageContext';
import { cleanText } from '../services/api';

export default function CleanPage() {
  const [input, setInput]   = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { tryUse, remaining } = useUsage();

  const handle = async () => {
    if (!input.trim()) return toast.error('Paste some text first');
    if (!tryUse('clean')) return;
    setLoading(true);
    try {
      const res = await cleanText(input);
      setOutput(res.data.cleaned);
      toast.success('Text cleaned');
    } catch (err) { toast.error(err.response?.data?.error || 'AI error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }} className="animate-fade">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#a78bfa" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>AI Text Cleaner</h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Fix grammar, spacing and OCR noise using AI</p>
            </div>
          </div>
          <button onClick={handle} disabled={loading || !input.trim()} className="s-btn s-btn-primary">
            {loading ? <Spinner size={15} /> : <Sparkles size={15} />}
            {loading ? 'Cleaning...' : `Clean Text (${remaining('clean')} left)`}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'start' }}>
        <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Input Text</span>
          <textarea value={input} onChange={e => setInput(e.target.value)} className="s-textarea" rows={20} placeholder="Paste your raw OCR text here..." />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#111827', border: '1px solid #2d3748', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={16} color="#3b82f6" />
          </div>
        </div>

        <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Cleaned Text</span>
            <CopyButton text={output} />
          </div>
          <textarea value={output} onChange={e => setOutput(e.target.value)} className="s-textarea" rows={20} placeholder="AI-cleaned text will appear here..." />
        </div>
      </div>
    </div>
  );
}
