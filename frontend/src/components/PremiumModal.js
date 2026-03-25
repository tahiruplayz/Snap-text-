import React, { useState } from 'react';
import { X, Zap, Check, Crown, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const FREE_FEATURES = [
  '5 OCR extractions per day',
  '2 AI cleanings per day',
  '2 translations per day',
  '1 PDF export per day',
];

const PRO_FEATURES = [
  'Unlimited OCR extractions',
  'Unlimited AI cleaning & notes',
  'Unlimited translations',
  'Unlimited PDF & DOCX exports',
  'All 8 languages supported',
  'Scan history saved forever',
  'Priority processing speed',
];

const PAYMENT_METHODS = [
  {
    id: 'jazzcash',
    name: 'JazzCash',
    number: '0323-4109619',
    color: 'from-red-600/20 to-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-400',
  },
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    number: '0323-4109619',
    color: 'from-green-600/20 to-green-500/10',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400',
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    number: '0323-4109619',
    color: 'from-orange-600/20 to-orange-500/10',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400',
  },
];

export default function PremiumModal({ onClose, reason }) {
  const [step, setStep] = useState('plans'); // 'plans' | 'payment'
  const [selectedMethod, setSelectedMethod] = useState(null);

  const copyNumber = (val) => {
    navigator.clipboard.writeText(val);
    toast.success('Copied!');
  };

  const handleWhatsApp = () => {
    const method = selectedMethod?.name || 'JazzCash/Easypaisa/Payoneer';
    const msg = encodeURIComponent(
      `Hi! I want to upgrade to Scanlix Pro.\nPayment method: ${method}\nPlease confirm my account activation.`
    );
    window.open(`https://wa.me/923234109619?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-surface-2 border border-surface-3 rounded-2xl shadow-2xl animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 border-b border-surface-3 p-5 sticky top-0 z-10">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-surface-3 text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <Crown size={18} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Scanlix Pro</h2>
              <p className="text-slate-400 text-xs">Unlock unlimited access · $5/month</p>
            </div>
          </div>
          {reason && (
            <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
              <p className="text-yellow-400 text-xs">⚠️ {reason}</p>
            </div>
          )}
        </div>

        {step === 'plans' && (
          <>
            {/* Plans */}
            <div className="p-5 grid grid-cols-2 gap-3">
              <div className="bg-surface-3/50 border border-surface-4 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-300 mb-1">Free</p>
                <p className="text-2xl font-bold text-white mb-3">$0</p>
                <ul className="flex flex-col gap-1.5">
                  {FREE_FEATURES.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                      <Check size={11} className="text-slate-500 mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand-blue/10 border-2 border-brand-blue/40 rounded-xl p-4 relative">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  BEST VALUE
                </div>
                <p className="text-sm font-semibold text-brand-blue mb-1">Pro</p>
                <div className="mb-3">
                  <span className="text-2xl font-bold text-white">$5</span>
                  <span className="text-slate-400 text-xs">/mo</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {PRO_FEATURES.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check size={11} className="text-brand-blue mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-5 pb-5 flex flex-col gap-2">
              <button
                onClick={() => setStep('payment')}
                className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Zap size={16} /> Get Pro Now
              </button>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xs text-center transition-colors">
                Continue with free plan
              </button>
            </div>
          </>
        )}

        {step === 'payment' && (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-1">Choose Payment Method</p>
              <p className="text-xs text-slate-400">Send $5 (or PKR equivalent) to any of these accounts</p>
            </div>

            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.map(method => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={`bg-gradient-to-r ${method.color} border ${method.border} rounded-xl p-4 cursor-pointer transition-all
                    ${selectedMethod?.id === method.id ? 'ring-2 ring-brand-blue/50' : 'hover:border-opacity-60'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-xs font-bold px-2 py-1 rounded-lg ${method.badge}`}>
                        {method.name}
                      </div>
                      <span className="text-sm text-white font-mono">{method.number}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); copyNumber(method.number); }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-3/50 border border-surface-4 rounded-xl p-4 text-xs text-slate-400 flex flex-col gap-1">
              <p className="font-medium text-slate-300">How it works:</p>
              <p>1. Send $5 to any account above</p>
              <p>2. Click "Confirm Payment" below</p>
              <p>3. Send screenshot on WhatsApp</p>
              <p>4. Your account gets activated within 1 hour</p>
            </div>

            <button
              onClick={handleWhatsApp}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>💬</span> Confirm Payment on WhatsApp
            </button>

            <div className="flex gap-2">
              <button onClick={() => setStep('plans')} className="btn-ghost flex-1 text-sm">
                ← Back
              </button>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xs flex-1 text-center transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
