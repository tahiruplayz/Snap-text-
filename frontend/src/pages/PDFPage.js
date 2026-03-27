import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import Spinner from '../components/Spinner';
import ProgressBar from '../components/ProgressBar';
import { uploadImages, extractText, generatePDF } from '../services/api';
import { generateDocx } from '../utils/docxExport';

export default function PDFPage() {
  const [localImgs, setLocalImgs] = useState([]);
  const [uploaded, setUploaded]   = useState([]);
  const [selIdx, setSelIdx]       = useState(0);
  const [uploading, setUploading] = useState(false);
  const [upProg, setUpProg]       = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [title, setTitle]         = useState('');
  const [preview, setPreview]     = useState('');

  const handleFiles = async (files) => {
    setLocalImgs(p => [...p, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }))]);
    setUploading(true); setUpProg(0);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const res = await uploadImages(fd, setUpProg);
      setUploaded(p => [...p, ...res.data.files]);
      toast.success(`${files.length} image(s) ready`);
    } catch (err) { toast.error(err.response?.data?.error || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const extractAll = async () => {
    if (!uploaded.length) return toast.error('Upload images first');
    setProcessing(true); setProgress(0);
    let combined = '';
    for (let i = 0; i < uploaded.length; i++) {
      setProgress(Math.round((i / uploaded.length) * 80));
      try { const r = await extractText(uploaded[i].filename, 'auto'); combined += (i > 0 ? '\n\n' : '') + r.data.text; } catch {}
    }
    setPreview(combined.trim()); setProgress(100); setProcessing(false);
    return combined.trim();
  };

  const handlePDF = async () => {
    let content = preview || await extractAll();
    if (!content) return;
    try {
      const res = await generatePDF(title || 'Scanlix Export', content);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      Object.assign(document.createElement('a'), { href: url, download: `scanlix-${Date.now()}.pdf` }).click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch { toast.error('PDF failed'); }
  };

  const handleDocx = async () => {
    let content = preview || await extractAll();
    if (!content) return;
    try { await generateDocx(title || 'Scanlix Export', content); toast.success('DOCX downloaded'); }
    catch { toast.error('DOCX failed'); }
  };

  const handleTxt = () => {
    if (!preview) return toast.error('Extract text first');
    const url = URL.createObjectURL(new Blob([preview], { type: 'text/plain' }));
    Object.assign(document.createElement('a'), { href: url, download: `scanlix-${Date.now()}.txt` }).click();
    toast.success('TXT downloaded');
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }} className="animate-fade">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} color="#34d399" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Image to PDF</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Extract text from images and export as PDF, DOCX or TXT</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="s-card" style={{ padding: 20 }}>
            <ImageUploader onFiles={handleFiles} uploading={uploading} />
            {uploading && <div style={{ marginTop: 12 }}><ProgressBar progress={upProg} label="Uploading" /></div>}
            <ImagePreview images={localImgs} onRemove={i => { setLocalImgs(p => p.filter((_,idx) => idx !== i)); setUploaded(p => p.filter((_,idx) => idx !== i)); }} onSelect={setSelIdx} selectedIndex={selIdx} />
          </div>

          <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="s-label">Document Title (optional)</p>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Document" className="s-input" />
            <button onClick={extractAll} disabled={processing || !uploaded.length} className="s-btn s-btn-ghost" style={{ width: '100%' }}>
              {processing ? <Spinner size={15} /> : null}
              {processing ? 'Extracting...' : 'Extract Text from Images'}
            </button>
            {processing && <ProgressBar progress={progress} label="Processing" />}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[{ label: 'PDF', action: handlePDF }, { label: 'DOCX', action: handleDocx }, { label: 'TXT', action: handleTxt }].map(({ label, action }) => (
              <button key={label} onClick={action} disabled={processing || !uploaded.length} className="s-card"
                style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', border: '1px solid #2d3748', transition: 'all 0.15s', opacity: (!uploaded.length || processing) ? 0.4 : 1 }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2d3748'}>
                <Download size={20} color="#3b82f6" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Text Preview</span>
            {preview && <span className="s-badge s-badge-blue">{preview.length} chars</span>}
          </div>
          <textarea value={preview} onChange={e => setPreview(e.target.value)} className="s-textarea" rows={22} placeholder="Extracted text preview will appear here..." />
        </div>
      </div>
    </div>
  );
}
