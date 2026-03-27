import React, { useEffect, useState } from 'react';
import { History, Trash2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { getScans, deleteScan } from '../lib/scans';

export default function HistoryPage() {
  const [scans, setScans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getScans().then(d => setScans(d || [])).catch(() => toast.error('Failed to load history')).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try { await deleteScan(id); setScans(p => p.filter(s => s.id !== id)); if (selected?.id === id) setSelected(null); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><Spinner size={32} /></div>;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }} className="animate-fade">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(244,114,182,0.12)', border: '1px solid rgba(244,114,182,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History size={18} color="#f472b6" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Scan History</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{scans.length} saved scans</p>
          </div>
        </div>
      </div>

      {scans.length === 0 ? (
        <div className="s-card" style={{ padding: 60, textAlign: 'center' }}>
          <History size={40} color="#374151" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>No scans saved yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scans.map(scan => (
              <div key={scan.id} onClick={() => setSelected(scan)}
                className="s-card"
                style={{ padding: 14, cursor: 'pointer', transition: 'all 0.15s', borderColor: selected?.id === scan.id ? '#3b82f6' : '#1f2937' }}
                onMouseEnter={e => { if (selected?.id !== scan.id) e.currentTarget.style.borderColor = '#2d3748'; }}
                onMouseLeave={e => { if (selected?.id !== scan.id) e.currentTarget.style.borderColor = '#1f2937'; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>
                      {scan.image_name || 'Untitled Scan'}
                    </p>
                    <p style={{ fontSize: 11, color: '#475569', marginBottom: 6 }}>
                      {new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {scan.language && ` · ${scan.language}`}
                    </p>
                    <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {scan.raw_text?.slice(0, 80) || 'No text'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <button onClick={e => handleDelete(scan.id, e)} className="s-btn-icon" style={{ width: 26, height: 26, color: '#ef4444', opacity: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = 0; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
                      <Trash2 size={12} />
                    </button>
                    <ChevronRight size={14} color="#374151" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            {selected ? (
              <div className="s-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }} key={selected.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{selected.image_name || 'Scan Detail'}</h2>
                    <p style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  {selected.language && <span className="s-badge s-badge-blue">{selected.language}</span>}
                </div>
                {[
                  { label: 'Raw Text', value: selected.raw_text },
                  { label: 'Cleaned Text', value: selected.cleaned_text },
                  { label: 'Notes', value: selected.notes },
                  { label: `Translation (${selected.translation_lang})`, value: selected.translated_text },
                ].filter(s => s.value).map(({ label, value }) => (
                  <div key={label}>
                    <p className="s-label" style={{ marginBottom: 8 }}>{label}</p>
                    <pre style={{ background: '#0f1929', border: '1px solid #2d3748', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#94a3b8', whiteSpace: 'pre-wrap', maxHeight: 160, overflowY: 'auto', margin: 0, fontFamily: 'inherit', lineHeight: 1.6 }}>{value}</pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="s-card" style={{ padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ChevronRight size={24} color="#374151" />
                <p style={{ color: '#475569', fontSize: 13 }}>Select a scan to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
