import React, { useState } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import CopyButton from '../components/CopyButton';
import Spinner from '../components/Spinner';
import { generateNotes, summarizeText } from '../services/api';

export default function NotesPage() {
  const [input, setInput]     = useState('');
  const [notes, setNotes]     = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState('');
  const [activeTab, setActiveTab] = useState('notes');

  const handleNotes = async () => {
    if (!input.trim()) return toast.error('Paste some text first');
    setLoading('notes');
    try {
      const res = await generateNotes(input);
      setNotes(res.data.notes);
      setActiveTab('notes');
      toast.success('Notes generated');
    } catch (err) { toast.error(err.response?.data?.error || 'AI error'); }
    finally { setLoading(''); }
  };

  const handleSummary = async () => {
    if (!input.trim()) return toast.error('Paste some text first');
    setLoading('summary');
    try {
      const res = await summarizeText(input);
      setSummary(res.data.summary);
      setActiveTab('summary');
      toast.success('Summary ready');
    } catch (err) { toast.error(err.response?.data?.error || 'AI error'); }
    finally { setLoading(''); }
  };

  const output = activeTab === 'notes' ? notes : summary;

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 animate-fade-in">
      <PageHeader
        icon={BookOpen}
        title="Notes Generator"
        description="Convert text into structured notes or student summaries"
        action={
          <div className="flex gap-2">
            <button onClick={handleNotes} disabled={!!loading || !input.trim()} className="btn-primary">
              {loading === 'notes' ? <Spinner size={14} /> : <BookOpen size={15} />}
              {loading === 'notes' ? 'Generating...' : 'Smart Notes'}
            </button>
            <button onClick={handleSummary} disabled={!!loading || !input.trim()} className="btn-ghost">
              {loading === 'summary' ? <Spinner size={14} /> : <GraduationCap size={15} />}
              {loading === 'summary' ? 'Summarizing...' : 'Summarize'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-p">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">Input Text</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={18}
            placeholder="Paste your text here to generate notes or a summary..."
            className="textarea w-full"
          />
        </div>

        <div className="card-p flex flex-col gap-3">
          {/* Output tabs */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-surface-3/50 rounded-lg p-1">
              {[
                { id: 'notes', label: 'Notes', icon: BookOpen },
                { id: 'summary', label: 'Summary', icon: GraduationCap },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                    ${activeTab === id ? 'bg-surface-2 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
            <CopyButton text={output} />
          </div>

          <div className="flex-1 input overflow-auto min-h-[380px] prose prose-invert prose-sm max-w-none">
            {output
              ? <ReactMarkdown>{output}</ReactMarkdown>
              : <p className="text-slate-500 text-sm italic">Output will appear here...</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
