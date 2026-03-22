import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import Spinner from '../components/Spinner';
import ProgressBar from '../components/ProgressBar';
import { uploadImages, extractText, generatePDF } from '../services/api';
import { generateDocx } from '../utils/docxExport';

export default function PDFPage() {
  const [localImages, setLocalImages]     = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uploading, setUploading]         = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing]       = useState(false);
  const [progress, setProgress]           = useState(0);
  const [title, setTitle]                 = useState('');
  const [preview, setPreview]             = useState('');

  const handleFiles = async (files) => {
    setLocalImages(p => [...p, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }))]);
    setUploading(true); setUploadProgress(0);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const res = await uploadImages(fd, setUploadProgress);
      setUploadedFiles(p => [...p, ...res.data.files]);
      toast.success(`${files.length} image(s) ready`);
    } catch (err) { toast.error(err.response?.data?.error || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleRemove = (i) => {
    setLocalImages(p => p.filter((_, idx) => idx !== i));
    setUploadedFiles(p => p.filter((_, idx) => idx !== i));
    if (selectedIndex >= i && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const extractAll = async () => {
    if (!uploadedFiles.length) return toast.error('Upload images first');
    setProcessing(true); setProgress(0);
    let combined = '';
    for (let i = 0; i < uploadedFiles.length; i++) {
      setProgress(Math.round((i / uploadedFiles.length) * 80));
      try {
        const res = await extractText(uploadedFiles[i].filename, 'auto');
        combined += (i > 0 ? '\n\n' : '') + res.data.text;
      } catch {}
    }
    setPreview(combined.trim());
    setProgress(100);
    setProcessing(false);
    return combined.trim();
  };

  const handleGeneratePDF = async () => {
    let content = preview;
    if (!content) content = await extractAll();
    if (!content) return toast.error('No text extracted');
    try {
      const res = await generatePDF(title || 'Snaplix Export', content);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      Object.assign(document.createElement('a'), { href: url, download: `snaptext-${Date.now()}.pdf` }).click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch { toast.error('PDF generation failed'); }
  };

  const handleDocx = async () => {
    let content = preview;
    if (!content) content = await extractAll();
    if (!content) return toast.error('No text extracted');
    try { await generateDocx(title || 'Snaplix Export', content); toast.success('DOCX downloaded'); }
    catch { toast.error('DOCX failed'); }
  };

  const handleTxt = () => {
    if (!preview) return toast.error('Extract text first');
    const url = URL.createObjectURL(new Blob([preview], { type: 'text/plain' }));
    Object.assign(document.createElement('a'), { href: url, download: `snaptext-${Date.now()}.txt` }).click();
    toast.success('TXT downloaded');
  };

  return (
    <div className="p-6 flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={FileText}
        title="Image to PDF"
        description="Extract text from images and export as PDF, DOCX, or TXT"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="card-p flex flex-col gap-4">
            <ImageUploader onFiles={handleFiles} uploading={uploading} />
            {uploading && <ProgressBar progress={uploadProgress} label="Uploading" />}
            <ImagePreview images={localImages} onRemove={handleRemove} onSelect={setSelectedIndex} selectedIndex={selectedIndex} />
          </div>

          <div className="card-p flex flex-col gap-3">
            <label className="section-label">Document Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="My Document"
              className="input"
            />
            <button onClick={extractAll} disabled={processing || !uploadedFiles.length} className="btn-ghost w-full">
              {processing ? <Spinner size={14} /> : null}
              {processing ? 'Extracting...' : 'Extract Text from Images'}
            </button>
            {processing && <ProgressBar progress={progress} label="Processing" />}
          </div>

          {/* Export buttons */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'PDF', action: handleGeneratePDF },
              { label: 'DOCX', action: handleDocx },
              { label: 'TXT', action: handleTxt },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                disabled={processing || !uploadedFiles.length}
                className="card-p flex flex-col items-center gap-2 py-5 hover:border-brand-blue/40
                  transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={20} className="text-brand-blue" />
                <span className="text-sm font-medium text-white">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card-p flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Text Preview</span>
            {preview && <span className="badge-cyan">{preview.length} chars</span>}
          </div>
          <textarea
            value={preview}
            onChange={e => setPreview(e.target.value)}
            rows={20}
            placeholder="Extracted text preview will appear here..."
            className="textarea flex-1"
          />
        </div>
      </div>
    </div>
  );
}
