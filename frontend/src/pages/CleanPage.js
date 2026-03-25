import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import TextPanel from '../components/TextPanel';
import Spinner from '../components/Spinner';
import { cleanText } from '../services/api';
import { useUsage } from '../context/UsageContext';

export default function CleanPage() {
  const [input, setInput]     = useState('');
  const [output, setOutput]   = useState('');
  const [loading, setLoading] = useState(false);
  const { tryUse, remaining } = useUsage();

  const handle = async () => {
    if (!input.trim()) return toast.error('Paste some text first');
    if (!tryUse('clean')) return;
    setLoading(true);
    try {
      const res = await cleanText(input);
      setOutput(res.data.cleaned);
      toast.success('Text cleaned');
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI service error');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 animate-fade-in">
      <PageHeader
        icon={Sparkles}
        title="AI Text Cleaner"
        description="Fix OCR errors, grammar, spacing and noise using AI"
        action={
          <button onClick={handle} disabled={loading || !input.trim()} className="btn-primary">
            {loading ? <Spinner size={14} /> : <Sparkles size={15} />}
            {loading ? 'Cleaning...' : `Clean Text (${remaining('clean')} left)`}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-p">
          <TextPanel
            label="Input Text"
            value={input}
            onChange={setInput}
            placeholder="Paste your raw OCR text here..."
            rows={18}
          />
        </div>

        <div className="card-p relative">
          {/* Arrow indicator */}
          <div className="hidden xl:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10
            bg-surface-2 border border-surface-3 rounded-full items-center justify-center z-10">
            <ArrowRight size={16} className="text-brand-blue" />
          </div>
          <TextPanel
            label="Cleaned Text"
            value={output}
            onChange={setOutput}
            placeholder="AI-cleaned text will appear here..."
            rows={18}
          />
        </div>
      </div>

      <div className="card-p bg-brand-blue/5 border-brand-blue/20">
        <p className="section-label mb-2">What this does</p>
        <ul className="text-sm text-slate-400 flex flex-col gap-1">
          <li>• Fixes OCR character recognition errors</li>
          <li>• Corrects grammar and punctuation</li>
          <li>• Removes noise characters and artifacts</li>
          <li>• Improves overall readability</li>
        </ul>
      </div>
    </div>
  );
}
