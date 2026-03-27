import React, { useState } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import CopyButton from '../components/CopyButton';
import { generateNotes, summarizeText } from '../services/api';

export default function NotesPage() {
  const [input, setInput]   = useState('');
  const [notes, setNotes]   = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState('');
  const [tab, setTab]       = useState('notes');

  const handleNotes = async () => {
    if (!input.trim()) return toast.error('Paste some text first');
    setLoading('notes');
    try { const r = await generateNotes(input); setNotes(r.data.notes); setTab('notes'); toast.success('Notes generated'); }
    catch (err) { toast.error(err.response?.data?.error || 'AI error'); }
    finally { setLoading(''); }
  };

  const handleSummary = async () => {
    if (!input.trim()) return toast.error('Paste some text first');
    setLoading('summary');
    try { const r = await summarizeText(input); setSummary(r.data.summary); setTab('summary'); toast.success('Summary ready'); }
    catch (err) { toast.error(err.response?.data?.error || 'AI error'); }
    finally { setLoading(''); }
  };

  const output = tab === 'notes' ? notes : summary;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }} className="animate-fade">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color="#22d3ee" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Notes Generator</h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Convert text into structured notes or summaries</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleNotes} disabled={!!loading || !input.trim()} className="s-btn s-btn-primary">
              {loading === 'notes' ? <Spinner size={15} /> : <BookOpen size={15} />}
              {loading === 'notes' ? 'Generating...' : 'Smart Notes'}
            </button>
            <button onClick={handleSummary} disabled={!!loading || !input.trim()} className="s-btn s-btn-ghost">
              {loading === 'summary' ? <Spinner size={15} /> : <GraduationCap size={15} />}
              {loading === 'summary' ? 'Summarizing...' : 'Summarize'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Input Text</span>
          <textarea value={input} onChange={e => setInput(e.target.value)} className="s-textarea" rows={22} placeholder="Paste your text here to generate notes or a summary..." />
        </div>

        <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 4, background: '#0f1929', borderRadius: 8, padding: 3 }}>
              {[{ id: 'notes', label: 'Notes', icon: BookOpen }, { id: 'summary', label: 'Summary', icon: GraduationCap }].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.15s', background: tab === id ? '#1f2937' : 'transparent', color: tab === id ? '#f1f5f9' : '#64748b' }}>
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
            <CopyButton text={output} />
          </div>
          <div style={{ flex: 1, background: '#0f1929', border: '1px solid #2d3748', borderRadius: 10, padding: '12px 14px', minHeight: 400, overflowY: 'auto', fontSize: 13, lineHeight: 1.7, color: '#e2e8f0' }}
            className="prose prose-invert prose-sm max-w-none">
            {output ? <ReactMarkdown>{output}</ReactMarkdown> : <p style={{ color: '#475569', fontStyle: 'italic' }}>Output will appear here...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
