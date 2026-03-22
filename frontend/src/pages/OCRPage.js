import React, { useState } from 'react';
import { ScanText, Wand2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import TextPanel from '../components/TextPanel';
import Spinner from '../components/Spinner';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { uploadImages, extractText } from '../services/api';
import { saveScan } from '../lib/scans';

const LANGS = [
  { code: 'eng', label: 'English' },
  { code: 'urd', label: 'Urdu' },
  { code: 'hin', label: 'Hindi' },
  { code: 'ara', label: 'Arabic' },
  { code: 'chi_sim', label: 'Chinese (Simplified)' },
  { code: 'chi_tra', label: 'Chinese (Traditional)' },
  { code: 'jpn', label: 'Japanese' },
  { code: 'spa', label: 'Spanish' },
];

export default function OCRPage() {
  const { user } = useAuth();
  const [localImages, setLocalImages]     = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uploading, setUploading]         = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [autoDetect, setAutoDetect]       = useState(true);
  const [manualLang, setManualLang]       = useState('eng');
  const [extracting, setExtracting]       = useState(false);
  const [ocrProgress, setOcrProgress]     = useState(0);
  const [rawText, setRawText]             = useState('');
  const [detectedLang, setDetectedLang]   = useState('');

  const handleFiles = async (files) => {
    setLocalImages(p => [...p, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }))]);
    setUploading(true); setUploadProgress(0);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const res = await uploadImages(fd, setUploadProgress);
      setUploadedFiles(p => [...p, ...res.data.files]);
      toast.success(`${files.length} image(s) ready`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleRemove = (i) => {
    setLocalImages(p => p.filter((_, idx) => idx !== i));
    setUploadedFiles(p => p.filter((_, idx) => idx !== i));
    if (selectedIndex >= i && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const runOCR = async (file, lang) => {
    setExtracting(true); setOcrProgress(10); setRawText(''); setDetectedLang('');
    try {
      setOcrProgress(40);
      const res = await extractText(file.filename, lang);
      setOcrProgress(100);
      setRawText(res.data.text);
      setDetectedLang(res.data.languageName || res.data.language);
      if (res.data.autoDetected) toast.success(`Language detected: ${res.data.languageName}`);
      else toast.success('Text extracted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Extraction failed');
    } finally { setExtracting(false); }
  };

  const handleExtract = () => {
    if (!uploadedFiles[selectedIndex]) return toast.error('Upload an image first');
    runOCR(uploadedFiles[selectedIndex], autoDetect ? 'auto' : manualLang);
  };

  const handleExtractAll = async () => {
    if (!uploadedFiles.length) return toast.error('Upload images first');
    setExtracting(true); let combined = '';
    for (let i = 0; i < uploadedFiles.length; i++) {
      setOcrProgress(Math.round((i / uploadedFiles.length) * 100));
      try {
        const res = await extractText(uploadedFiles[i].filename, autoDetect ? 'auto' : manualLang);
        combined += `\n\n--- Image ${i + 1} ---\n\n${res.data.text}`;
      } catch {}
    }
    setRawText(combined.trim()); setOcrProgress(100); setExtracting(false);
    toast.success('All images extracted');
  };

  const handleSave = async () => {
    if (!user) return toast.error('Sign in to save scans');
    if (!rawText) return toast.error('Nothing to save');
    try {
      await saveScan({ imageName: uploadedFiles[selectedIndex]?.originalname, language: manualLang, rawText });
      toast.success('Saved to history');
    } catch { toast.error('Save failed'); }
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={ScanText}
        title="OCR Text Extraction"
        description="Upload an image and extract text automatically"
        badge="Auto Detect"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left */}
        <div className="flex flex-col gap-4">
          <div className="card-p flex flex-col gap-4">
            <ImageUploader onFiles={handleFiles} uploading={uploading} />
            {uploading && <ProgressBar progress={uploadProgress} label="Uploading" />}
            <ImagePreview images={localImages} onRemove={handleRemove} onSelect={setSelectedIndex} selectedIndex={selectedIndex} />
          </div>

          <div className="card-p flex flex-col gap-4">
            {/* Language toggle */}
            <div>
              <p className="section-label mb-2">Language</p>
              <div className="flex rounded-xl overflow-hidden border border-surface-4 bg-surface-3/40">
                <button
                  onClick={() => setAutoDetect(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors
                    ${autoDetect ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <Wand2 size={14} /> Auto Detect
                </button>
                <button
                  onClick={() => setAutoDetect(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors
                    ${!autoDetect ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <Globe size={14} /> Manual
                </button>
              </div>
            </div>

            {!autoDetect && (
              <select value={manualLang} onChange={e => setManualLang(e.target.value)} className="input">
                {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            )}

            <div className="flex gap-2">
              <button onClick={handleExtract} disabled={extracting || !uploadedFiles.length} className="btn-primary flex-1">
                {extracting ? <Spinner size={14} /> : <ScanText size={15} />}
                {extracting ? 'Extracting...' : 'Extract Text'}
              </button>
              {uploadedFiles.length > 1 && (
                <button onClick={handleExtractAll} disabled={extracting} className="btn-ghost">
                  All
                </button>
              )}
            </div>

            {extracting && <ProgressBar progress={ocrProgress} label="Running OCR" />}
          </div>

          {rawText && (
            <button onClick={handleSave} className="btn-ghost w-full">
              Save to History
            </button>
          )}
        </div>

        {/* Right */}
        <div className="card-p flex flex-col gap-3 min-h-[400px]">
          <TextPanel
            label="Extracted Text"
            value={rawText}
            onChange={setRawText}
            placeholder="Extracted text will appear here after running OCR..."
            badge={detectedLang || undefined}
            rows={18}
          />
        </div>
      </div>
    </div>
  );
}
