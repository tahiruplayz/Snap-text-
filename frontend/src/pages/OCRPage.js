import React, { useState } from 'react';
import { ScanText, Wand2, Globe, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import Spinner from '../components/Spinner';
import ProgressBar from '../components/ProgressBar';
import CopyButton from '../components/CopyButton';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';
import { uploadImages, extractText } from '../services/api';
import { saveScan } from '../lib/scans';

const LANGS = [
  { code: 'eng', label: 'English' }, { code: 'urd', label: 'Urdu' },
  { code: 'hin', label: 'Hindi' },   { code: 'ara', label: 'Arabic' },
  { code: 'chi_sim', label: 'Chinese (Simplified)' }, { code: 'chi_tra', label: 'Chinese (Traditional)' },
  { code: 'jpn', label: 'Japanese' }, { code: 'spa', label: 'Spanish' },
];

export default function OCRPage() {
  const { user } = useAuth();
  const { tryUse, remaining } = useUsage();
  const [localImgs, setLocalImgs]   = useState([]);
  const [uploaded, setUploaded]     = useState([]);
  const [selIdx, setSelIdx]         = useState(0);
  const [uploading, setUploading]   = useState(false);
  const [upProg, setUpProg]         = useState(0);
  const [auto, setAuto]             = useState(true);
  const [lang, setLang]             = useState('eng');
  const [extracting, setExtracting] = useState(false);
  const [ocrProg, setOcrProg]       = useState(0);
  const [text, setText]             = useState('');
  const [detLang, setDetLang]       = useState('');

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

  const handleExtract = async () => {
    if (!uploaded[selIdx]) return toast.error('Upload an image first');
    if (!tryUse('ocr')) return;
    setExtracting(true); setOcrProg(20); setText(''); setDetLang('');
    try {
      setOcrProg(50);
      const res = await extractText(uploaded[selIdx].filename, auto ? 'auto' : lang);
      setOcrProg(100); setText(res.data.text);
      setDetLang(res.data.languageName || '');
      if (res.data.autoDetected) toast.success(`Detected: ${res.data.languageName}`);
      else toast.success('Text extracted');
    } catch (err) { toast.error(err.response?.data?.error || 'Extraction failed'); }
    finally { setExtracting(false); }
  };

  const handleSave = async () => {
    if (!user) return toast.error('Sign in to save');
    if (!text) return toast.error('Nothing to save');
    try { await saveScan({ imageName: uploaded[selIdx]?.originalname, language: lang, rawText: text }); toast.success('Saved'); }
    catch { toast.error('Save failed'); }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }} className="animate-fade">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ScanText size={18} color="#60a5fa" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>OCR Text Extraction</h1>
          <span className="s-badge s-badge-blue">Auto Detect</span>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Upload an image and extract text using AI-powered OCR</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="grid-cols-1 lg:grid-cols-2">
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="s-card" style={{ padding: 20 }}>
            <ImageUploader onFiles={handleFiles} uploading={uploading} />
            {uploading && <div style={{ marginTop: 12 }}><ProgressBar progress={upProg} label="Uploading" /></div>}
            <ImagePreview images={localImgs} onRemove={i => { setLocalImgs(p => p.filter((_,idx) => idx !== i)); setUploaded(p => p.filter((_,idx) => idx !== i)); }} onSelect={setSelIdx} selectedIndex={selIdx} />
          </div>

          <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p className="s-label">Language</p>
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #2d3748', background: '#0f1929' }}>
              {[{ id: true, label: 'Auto Detect', icon: Wand2 }, { id: false, label: 'Manual', icon: Globe }].map(({ id, label, icon: Icon }) => (
                <button key={String(id)} onClick={() => setAuto(id)}
                  style={{ flex: 1, padding: '9px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.15s', background: auto === id ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'transparent', color: auto === id ? '#fff' : '#64748b' }}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            {!auto && (
              <select value={lang} onChange={e => setLang(e.target.value)} className="s-input">
                {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            )}

            <button onClick={handleExtract} disabled={extracting || !uploaded.length} className="s-btn s-btn-primary" style={{ width: '100%', padding: '11px 0' }}>
              {extracting ? <Spinner size={16} /> : <ScanText size={16} />}
              {extracting ? 'Extracting...' : `Extract Text (${remaining('ocr')} left)`}
            </button>

            {extracting && <ProgressBar progress={ocrProg} label="Running OCR" />}
          </div>

          {text && (
            <button onClick={handleSave} className="s-btn s-btn-ghost" style={{ width: '100%' }}>
              <Save size={14} /> Save to History
            </button>
          )}
        </div>

        {/* Right */}
        <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Extracted Text</span>
              {detLang && <span className="s-badge s-badge-blue">{detLang}</span>}
            </div>
            <CopyButton text={text} />
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="s-textarea"
            rows={20}
            placeholder="Extracted text will appear here after running OCR..."
            style={{ flex: 1 }}
          />
        </div>
      </div>
    </div>
  );
}
