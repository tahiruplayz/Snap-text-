import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

export default function ImageUploader({ onFiles, uploading }) {
  const onDrop = useCallback(a => { if (a.length) onFiles(a); }, [onFiles]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, disabled: uploading,
    accept: { 'image/*': ['.jpg','.jpeg','.png','.bmp','.tiff','.webp'] },
    maxFiles: 10, maxSize: 20 * 1024 * 1024,
  });

  return (
    <div {...getRootProps()} className={`drop-zone${isDragActive ? ' drag-over' : ''}`}
      style={{ padding: 40, textAlign: 'center', opacity: uploading ? 0.5 : 1, pointerEvents: uploading ? 'none' : 'auto' }}>
      <input {...getInputProps()} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UploadCloud size={24} color={isDragActive ? '#3b82f6' : '#475569'} />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: isDragActive ? '#60a5fa' : '#e2e8f0', marginBottom: 4 }}>
            {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
          </p>
          <p style={{ fontSize: 12, color: '#475569' }}>or click to browse · JPG, PNG, WEBP · max 20MB</p>
        </div>
      </div>
    </div>
  );
}
