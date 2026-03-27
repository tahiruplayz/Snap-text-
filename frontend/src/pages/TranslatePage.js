import React, { useState } from 'react';
import { Languages, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import CopyButton from '../components/CopyButton';
import { useUsage } from '../context/UsageContext';
import { translateText } from '../services/api';

const LANGS = ['English','Urdu','Hindi','Arabic','Spanish','French','German','Chinese','Japanese','Turkish','Russian','Portuguese','Korean','Italian'];

export default function TranslatePage() {
  const [input, setInput]     = useState('');
  const [output, setOutput]   = useState('');
  const [target, setTarget]   = useState('Urdu');
  const [loading, setLoading] = useState(false);
  const { tryUse, remaining } = useUsage();

  const handle = async () => {
    if (!input.trim()) return toast.error('Enter text to translate');
    if (!tryUse('translate')) return;
    setLoading(true);
    try { const r = await translateText(input, target); setOutput(r.data.translated); toast.success(`Translated to ${target}`); }
    catch (err) { toast.error(err.response?.data?.error || 'Translation failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }} className="animate-fade">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Languages size={18} color="#fb923c" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Translation Tool</h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Translate text into 14+ languages with AI</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select value={target} onChange={e => setTarget(e.target.value)} className="s-input" style={{ width: 160 }}>
              {LANGS.map(l => <option key={l}>{l}</option>)}
            </select>
            <button onClick={handle} disabled={loading || !input.trim()} className="s-btn s-btn-primary">
              {loading ? <Spinner size={15} /> : <Languages size={15} />}
              {loading ? 'Translating...' : `Translate (${remaining('translate')} left)`}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'start' }}>
        <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Source Text</span>
          <textarea value={input} onChange={e => setInput(e.target.value)} className="s-textarea" rows={20} placeholder="Paste text to translate..." />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#111827', border: '1px solid #2d3748', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={16} color="#fb923c" />
          </div>
        </div>

        <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Translation — {target}</span>
            <CopyButton text={output} />
          </div>
          <textarea value={output} readOnly className="s-textarea" rows={20} placeholder={`${target} translation will appear here...`} />
        </div>
      </div>
    </div>
  );
}
