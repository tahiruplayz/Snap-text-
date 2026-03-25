import React, { useEffect, useState } from 'react';
import { History, Trash2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import { getScans, deleteScan } from '../lib/scans';

export default function HistoryPage() {
  const [scans, setScans]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getScans()
      .then(data => setScans(data || []))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteScan(id);
      setScans(p => p.filter(s => s.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Spinner size={32} />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 animate-fade-in">
      <PageHeader
        icon={History}
        title="Scan History"
        description="Your previously saved OCR scans"
        badge={`${scans.length} scans`}
      />

      {scans.length === 0 ? (
        <div className="card-p flex flex-col items-center justify-center py-20 gap-3">
          <History size={40} className="text-slate-600" />
          <p className="text-slate-400">No scans saved yet</p>
          <p className="text-slate-600 text-sm">Extract text and save it to see history here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* List */}
          <div className="xl:col-span-1 flex flex-col gap-2">
            {scans.map(scan => (
              <div
                key={scan.id}
                onClick={() => setSelected(scan)}
                className={`card-p cursor-pointer transition-all hover:border-brand-blue/40 group
                  ${selected?.id === scan.id ? 'border-brand-blue/60 bg-brand-blue/5' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {scan.image_name || 'Untitled Scan'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {scan.language && ` · ${scan.language}`}
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {scan.raw_text?.slice(0, 100) || 'No text'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={e => handleDelete(scan.id, e)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600
                        hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                    <ChevronRight size={14} className="text-slate-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="xl:col-span-2">
            {selected ? (
              <div className="card-p flex flex-col gap-4 animate-slide-up">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-white">{selected.image_name || 'Scan Detail'}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>
                  {selected.language && <span className="badge-blue">{selected.language}</span>}
                </div>

                {[
                  { label: 'Raw Text',    value: selected.raw_text },
                  { label: 'Cleaned Text', value: selected.cleaned_text },
                  { label: 'Notes',        value: selected.notes },
                  { label: `Translation (${selected.translation_lang})`, value: selected.translated_text },
                ].filter(s => s.value).map(({ label, value }) => (
                  <div key={label}>
                    <p className="section-label mb-1.5">{label}</p>
                    <pre className="input text-xs whitespace-pre-wrap max-h-40 overflow-auto leading-relaxed">
                      {value}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-p flex flex-col items-center justify-center h-64 gap-2">
                <ChevronRight size={24} className="text-slate-600" />
                <p className="text-slate-500 text-sm">Select a scan to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
