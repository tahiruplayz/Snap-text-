import React, { useState } from 'react';
import { Shield, Check, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const ADMIN_EMAIL = 'tahiruplayz@gmail.com';

export default function AdminPage() {
  const { user } = useAuth();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
        <div className="card-p w-full max-w-sm text-center flex flex-col items-center gap-4">
          <Shield size={32} className="text-slate-600" />
          <p className="text-slate-400">Sign in as admin to access this page</p>
          <a href="/auth" className="btn-primary">Sign In</a>
        </div>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
        <div className="card-p w-full max-w-sm text-center flex flex-col items-center gap-4">
          <Shield size={32} className="text-red-500" />
          <p className="text-slate-400">Access denied.</p>
        </div>
      </div>
    );
  }

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Enter email');
    setLoading(true);
    setResult(null);
    try {
      const targetEmail = email.trim().toLowerCase();

      // Try to find in profiles first
      let { data: profile } = await supabase
        .from('profiles')
        .select('id, email, is_premium')
        .eq('email', targetEmail)
        .single();

      // If not in profiles, find in auth.users via admin and create profile
      if (!profile) {
        // Try upserting directly with email match from auth
        const { data: users } = await supabase
          .from('profiles')
          .select('id, email')
          .ilike('email', targetEmail);

        if (users && users.length > 0) {
          profile = users[0];
        }
      }

      if (!profile) {
        // Last resort: upsert by email directly
        const { data: upserted, error: upsertErr } = await supabase
          .from('profiles')
          .upsert({ email: targetEmail, is_premium: true, premium_activated_at: new Date().toISOString() }, { onConflict: 'email' })
          .select()
          .single();

        if (upsertErr) throw new Error('User not found. Make sure they have signed up first.');
        setResult({ email: targetEmail });
        toast.success(`Pro activated for ${targetEmail}`);
        setEmail('');
        setLoading(false);
        return;
      }

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ is_premium: true, premium_activated_at: new Date().toISOString() })
        .eq('id', profile.id);

      if (updateErr) throw updateErr;

      setResult({ email: profile.email });
      toast.success(`Pro activated for ${profile.email}`);
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
      await supabase.from('profiles').update({ is_premium: false, premium_activated_at: null }).eq('email', result.email);
      toast.success('Premium revoked');
      setResult(null);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Shield size={22} className="text-blue-400" />
          <h1 className="text-xl font-bold text-white">Snaplix Admin</h1>
          <span className="badge-blue">Premium Activation</span>
        </div>

        <div className="card-p flex flex-col gap-4">
          <p className="text-sm text-slate-400">Enter the email of a user who has paid to activate their Pro account instantly.</p>
          <form onSubmit={handleActivate} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="user@email.com" className="input pl-9" />
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
              <button onClick={handleRevoke} className="btn-danger btn-sm">Revoke</button>
            </div>
          )}
        </div>

        <div className="card-p">
          <p className="section-label mb-3">How to use</p>
          <ol className="text-sm text-slate-400 flex flex-col gap-2">
            <li>1. User pays via JazzCash / Easypaisa / Payoneer to <span className="text-white">0323-4109619</span></li>
            <li>2. They send payment screenshot on WhatsApp</li>
            <li>3. Come here, enter their email, click Activate Pro</li>
            <li>4. They refresh — premium is active immediately</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
