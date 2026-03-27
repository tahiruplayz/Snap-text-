import React from 'react';
import { X } from 'lucide-react';
export default function ImagePreview({ images, onRemove, onSelect, selectedIndex }) {
  if (!images.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
      {images.map((img, i) => (
        <div key={i} onClick={() => onSelect(i)}
          style={{ position: 'relative', width: 72, height: 72, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${selectedIndex === i ? '#3b82f6' : '#2d3748'}`, transition: 'border-color 0.15s', flexShrink: 0 }}>
          <img src={img.preview || img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button onClick={e => { e.stopPropagation(); onRemove(i); }}
            style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0}>
            <X size={10} color="#fff" />
          </button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', fontSize: 9, color: '#fff', textAlign: 'center', padding: '2px 0' }}>{i + 1}</div>
        </div>
      ))}
    </div>
  );
}
