import React, { useState } from 'react';
import { Shield, Check, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import Spinner from '../components/Spinner';

// Simple admin password check — change this to something secret
const ADMIN_PASSWORD = 'snaplix-admin-2024';

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false);
  const [pass, setPass]         = useState('');
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);

  const handleAuth = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) setAuthed(true);
    else toast.error('Wrong password');
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Enter email');
    setLoading(true);
    setResult(null);
    try {
      // Find user by email in profiles table
      const { data: profile, error: findErr } = await supabase
        .from('profiles')
        .select('id, email, is_premium')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (findErr || !profile) {
        toast.error('User not found. Make sure they have signed up first.');
        setLoading(false);
        return;
      }

      // Activate premium
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ is_premium: true, premium_activated_at: new Date().toISOString() })
        .eq('id', profile.id);

      if (updateErr) throw updateErr;

      setResult({ email: profile.email, activated: true });
      toast.success(`Premium activated for ${profile.email}`);
      setEmail('');
    } catch (err) {
      toast.error(err.message || 'Activation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!result?.email) return;
    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({ is_premium: false, premium_activated_at: null })
        .eq('email', result.email);
      toast.success('Premium revoked');
      setResult(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="card-p w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={20} className="text-brand-blue" />
            <h1 className="text-lg font-bold text-white">Admin Access</h1>
          </div>
          <form onSubmit={handleAuth} className="flex flex-col gap-3">
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Admin password"
              className="input"
              autoFocus
            />
            <button type="submit" className="btn-primary w-full justify-center">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Shield size={22} className="text-brand-blue" />
          <h1 className="text-xl font-bold text-white">Snaplix Admin</h1>
          <span className="badge-blue">Premium Activation</span>
        </div>

        <div className="card-p flex flex-col gap-4">
          <p className="text-sm text-slate-400">
            Enter the email of a user who has paid. Their account will be upgraded to Pro instantly.
          </p>
          <form onSubmit={handleActivate} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@email.com"
                className="input pl-9"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
              {loading ? <Spinner size={14} /> : <Check size={15} />}
              Activate Pro
            </button>
          </form>

          {result && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-green-400 font-medium text-sm">✓ Premium activated</p>
                <p className="text-slate-400 text-xs mt-0.5">{result.email}</p>
              </div>
              <button onClick={handleRevoke} className="btn-danger btn-sm">
                Revoke
              </button>
            </div>
          )}
        </div>

        <div className="card-p">
          <p className="section-label mb-3">How to use</p>
          <ol className="text-sm text-slate-400 flex flex-col gap-2">
            <li>1. User pays via JazzCash/Easypaisa/Payoneer to <span className="text-white">0323-4109619</span></li>
            <li>2. They send payment screenshot on WhatsApp</li>
            <li>3. You come here, enter their email, click Activate Pro</li>
            <li>4. They refresh the page — premium is active immediately</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
