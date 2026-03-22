import React from 'react';
import { X } from 'lucide-react';

export default function ImagePreview({ images, onRemove, onSelect, selectedIndex }) {
  if (!images.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {images.map((img, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all
            ${selectedIndex === i ? 'border-brand-blue shadow-glow' : 'border-surface-4 hover:border-brand-blue/40'}`}
          style={{ width: 72, height: 72 }}
        >
          <img src={img.preview || img.url} alt="" className="w-full h-full object-cover" />
          <button
            onClick={e => { e.stopPropagation(); onRemove(i); }}
            className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X size={10} className="text-white" />
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center truncate">
            {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
