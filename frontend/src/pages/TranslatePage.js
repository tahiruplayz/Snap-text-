import React, { useState } from 'react';
import { Languages, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import TextPanel from '../components/TextPanel';
import Spinner from '../components/Spinner';
import { translateText } from '../services/api';

const LANGS = [
  'English','Urdu','Hindi','Arabic','Spanish',
  'French','German','Chinese','Japanese','Turkish',
  'Russian','Portuguese','Korean','Italian',
];

export default function TranslatePage() {
  const [input, setInput]       = useState('');
  const [output, setOutput]     = useState('');
  const [targetLang, setTargetLang] = useState('Urdu');
  const [loading, setLoading]   = useState(false);

  const handle = async () => {
    if (!input.trim()) return toast.error('Enter text to translate');
    setLoading(true);
    try {
      const res = await translateText(input, targetLang);
      setOutput(res.data.translated);
      toast.success(`Translated to ${targetLang}`);
    } catch (err) { toast.error(err.response?.data?.error || 'Translation failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={Languages}
        title="Translation Tool"
        description="Translate extracted or custom text into any language"
        action={
          <div className="flex items-center gap-2">
            <select
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
              className="input w-40 py-2"
            >
              {LANGS.map(l => <option key={l}>{l}</option>)}
            </select>
            <button onClick={handle} disabled={loading || !input.trim()} className="btn-primary">
              {loading ? <Spinner size={14} /> : <Languages size={15} />}
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card-p">
          <TextPanel
            label="Source Text"
            value={input}
            onChange={setInput}
            placeholder="Paste text to translate..."
            rows={18}
          />
        </div>

        <div className="card-p relative">
          <div className="hidden xl:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10
            bg-surface-2 border border-surface-3 rounded-full items-center justify-center z-10">
            <ArrowRight size={16} className="text-brand-blue" />
          </div>
          <TextPanel
            label={`Translation — ${targetLang}`}
            value={output}
            readOnly
            placeholder={`${targetLang} translation will appear here...`}
            rows={18}
          />
        </div>
      </div>
    </div>
  );
}
