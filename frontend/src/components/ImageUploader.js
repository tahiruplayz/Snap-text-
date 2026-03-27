import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

export default function ImageUploader({ onFiles, uploading, compact = false }) {
  const onDrop = useCallback(accepted => { if (accepted.length) onFiles(accepted); }, [onFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'] },
    maxFiles: 10,
    maxSize: 20 * 1024 * 1024,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 select-none
        ${isDragActive
          ? 'border-blue-500 bg-blue-500/10 shadow-glow-blue'
          : 'border-surface-4 hover:border-blue-500/40 hover:bg-white/3'}
        ${uploading ? 'opacity-50 pointer-events-none' : ''}
        ${compact ? 'p-5' : 'p-10'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`rounded-2xl bg-surface-3 flex items-center justify-center transition-transform duration-200
          ${isDragActive ? 'scale-110' : 'group-hover:scale-105'}
          ${compact ? 'w-10 h-10' : 'w-14 h-14'}`}>
          <UploadCloud size={compact ? 20 : 26} className={isDragActive ? 'text-blue-400' : 'text-slate-400'} />
        </div>
        {isDragActive ? (
          <p className="text-blue-400 font-semibold">Drop images here</p>
        ) : (
          <>
            <div>
              <p className="text-slate-200 font-semibold text-sm">
                {compact ? 'Upload image' : 'Drag & drop images here'}
              </p>
              <p className="text-slate-500 text-xs mt-1">or click to browse</p>
            </div>
            {!compact && (
              <p className="text-slate-600 text-xs">JPG, PNG, BMP, TIFF, WEBP · max 20MB · up to 10 files</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
