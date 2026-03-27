import React, { useState } from 'react';
import { X, Crown, Check, Copy, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const FREE = ['5 OCR extractions/day', '2 AI cleanings/day', '2 translations/day', '1 PDF export/day'];
const PRO  = ['Unlimited OCR', 'Unlimited AI cleaning', 'Unlimited translations', 'Unlimited PDF & DOCX', 'All 8 languages', 'Scan history forever', 'Priority speed'];
const METHODS = [
  { id: 'jc', name: 'JazzCash',  num: '0323-4109619', color: '#ef4444' },
  { id: 'ep', name: 'Easypaisa', num: '0323-4109619', color: '#10b981' },
  { id: 'py', name: 'Payoneer',  num: '0323-4109619', color: '#f59e0b' },
];

export default function PremiumModal({ onClose, reason }) {
  const [step, setStep]     = useState('plans');
  const [method, setMethod] = useState(null);

  const copy = (val) => { navigator.clipboard.writeText(val); toast.success('Copied!'); };
  const whatsapp = () => {
    const msg = encodeURIComponent(`Hi! I want to upgrade to Scanlix Pro.\nPayment: ${method?.name || 'JazzCash'}\nPlease activate my account.`);
    window.open(`https://wa.me/923234109619?text=${msg}`, '_blank');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 480, background: '#111827', border: '1px solid #1f2937', borderRadius: 20, overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }} className="animate-slide-up">

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', borderBottom: '1px solid #1f2937', padding: 20, position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(8px)' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }} className="s-btn-icon"><X size={15} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={20} color="#fbbf24" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Scanlix Pro</p>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Unlock unlimited access · $5/month</p>
            </div>
          </div>
          {reason && <div style={{ marginTop: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fbbf24' }}>⚠️ {reason}</div>}
        </div>

        {step === 'plans' && (
          <>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Free */}
              <div style={{ background: '#0f1929', border: '1px solid #2d3748', borderRadius: 14, padding: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>Free</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>$0</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {FREE.map(f => <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: '#64748b' }}><Check size={12} style={{ color: '#374151', marginTop: 1, flexShrink: 0 }} />{f}</div>)}
                </div>
              </div>
              {/* Pro */}
              <div style={{ background: 'rgba(59,130,246,0.08)', border: '2px solid rgba(59,130,246,0.3)', borderRadius: 14, padding: 16, position: 'relative' }}>
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>BEST VALUE</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa', marginBottom: 4 }}>Pro</p>
                <div style={{ marginBottom: 14 }}><span style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>$5</span><span style={{ fontSize: 12, color: '#64748b' }}>/mo</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PRO.map(f => <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: '#e2e8f0' }}><Check size={12} style={{ color: '#3b82f6', marginTop: 1, flexShrink: 0 }} />{f}</div>)}
                </div>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => setStep('payment')} className="s-btn s-btn-primary" style={{ width: '100%', padding: '12px 0' }}>
                <Zap size={16} /> Get Pro Now
              </button>
              <button onClick={onClose} style={{ fontSize: 12, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}>Continue with free plan</button>
            </div>
          </>
        )}

        {step === 'payment' && (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>Choose Payment Method</p>
              <p style={{ fontSize: 12, color: '#64748b' }}>Send $5 (or PKR equivalent) to any account below</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {METHODS.map(m => (
                <div key={m.id} onClick={() => setMethod(m)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, border: `1px solid ${method?.id === m.id ? '#3b82f6' : '#2d3748'}`, background: method?.id === m.id ? 'rgba(59,130,246,0.08)' : '#0f1929', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${m.color}20`, color: m.color, border: `1px solid ${m.color}30` }}>{m.name}</span>
                    <span style={{ fontSize: 13, color: '#e2e8f0', fontFamily: 'monospace' }}>{m.num}</span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); copy(m.num); }} className="s-btn-icon" style={{ width: 28, height: 28 }}><Copy size={12} /></button>
                </div>
              ))}
            </div>
            <div style={{ background: '#0f1929', border: '1px solid #2d3748', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>How it works:</p>
              <p>1. Send $5 to any account above</p>
              <p>2. Click "Confirm on WhatsApp" below</p>
              <p>3. Send payment screenshot</p>
              <p>4. Account activated within 1 hour</p>
            </div>
            <button onClick={whatsapp} className="s-btn" style={{ width: '100%', padding: '12px 0', background: '#16a34a', color: '#fff', fontSize: 14, fontWeight: 600, borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              💬 Confirm Payment on WhatsApp
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep('plans')} className="s-btn s-btn-ghost" style={{ flex: 1 }}>← Back</button>
              <button onClick={onClose} style={{ flex: 1, fontSize: 12, color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
