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
          ? 'border-brand-blue bg-brand-blue/10'
          : 'border-surface-4 hover:border-brand-blue/50 hover:bg-surface-3/40'}
        ${uploading ? 'opacity-50 pointer-events-none' : ''}
        ${compact ? 'p-5' : 'p-10'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`rounded-xl bg-surface-3 flex items-center justify-center
          ${compact ? 'w-10 h-10' : 'w-14 h-14'}`}>
          <UploadCloud size={compact ? 20 : 26} className={isDragActive ? 'text-brand-blue' : 'text-slate-400'} />
        </div>
        {isDragActive ? (
          <p className="text-brand-blue font-medium text-sm">Drop images here</p>
        ) : (
          <>
            <div>
              <p className="text-slate-200 font-medium text-sm">
                {compact ? 'Upload image' : 'Drag & drop images here'}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">or click to browse</p>
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
