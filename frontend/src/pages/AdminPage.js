import React, { useState, useEffect } from 'react';
import { Shield, Check, Search, Crown, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const ADMIN_EMAIL = 'tahiruplayz@gmail.com';

export default function AdminPage() {
  const { user } = useAuth();
  const [email, setEmail]         = useState('');
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [allUsers, setAllUsers]   = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, email, is_premium, premium_activated_at, created_at')
      .order('created_at', { ascending: false });
    setAllUsers(data || []);
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) fetchUsers();
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="card-p w-full max-w-sm text-center flex flex-col items-center gap-4">
        <Shield size={32} className="text-slate-600" />
        <p className="text-slate-400">Sign in as admin to access this page</p>
        <a href="/auth" className="btn-primary">Sign In</a>
      </div>
    </div>
  );

  if (user.email !== ADMIN_EMAIL) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="card-p w-full max-w-sm text-center flex flex-col items-center gap-4">
        <Shield size={32} className="text-red-500" />
        <p className="text-slate-400">Access denied.</p>
      </div>
    </div>
  );

  const handleActivate = async (e, targetEmail) => {
    e?.preventDefault();
    const activateEmail = (targetEmail || email).trim().toLowerCase();
    if (!activateEmail) return toast.error('Enter email');
    setLoading(true);
    setResult(null);
    try {
      // Try update first
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', activateEmail)
        .single();

      if (existing) {
        await supabase.from('profiles')
          .update({ is_premium: true, premium_activated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase.from('profiles')
          .insert({ email: activateEmail, is_premium: true, premium_activated_at: new Date().toISOString() });
      }

      setResult({ email: activateEmail });
      toast.success(`Pro activated for ${activateEmail}`);
      setEmail('');
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Activation failed');
    } finally { setLoading(false); }
  };

  const handleRevoke = async (targetEmail) => {
    try {
      await supabase.from('profiles')
        .update({ is_premium: false, premium_activated_at: null })
        .eq('email', targetEmail);
      toast.success('Premium revoked');
      setResult(null);
      fetchUsers();
    } catch (err) { toast.error(err.message); }
  };

  const premiumUsers = allUsers.filter(u => u.is_premium);
  const filteredUsers = allUsers.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Shield size={22} className="text-blue-400" />
          <h1 className="text-xl font-bold text-white">Scanlix Admin</h1>
          <span className="badge-blue">Panel</span>
          <span className="badge-gold ml-auto">{premiumUsers.length} Pro Users</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: User list */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <div className="card-p flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <span className="text-sm font-semibold text-white">All Users</span>
                <span className="badge-blue ml-auto">{allUsers.length}</span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="input pl-9 text-xs py-2"
                />
              </div>

              {/* User list */}
              <div className="flex flex-col gap-1.5 max-h-[500px] overflow-y-auto">
                {loadingUsers ? (
                  <div className="flex justify-center py-4"><Spinner size={20} /></div>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-4">No users found</p>
                ) : filteredUsers.map(u => (
                  <div key={u.id} className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-colors
                    ${u.is_premium ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {u.is_premium && <Crown size={11} className="text-yellow-400 flex-shrink-0" />}
                        <p className="text-xs text-slate-300 truncate">{u.email}</p>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {u.is_premium ? (
                      <button
                        onClick={() => handleRevoke(u.email)}
                        className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors flex-shrink-0"
                        title="Revoke Pro"
                      >
                        <Trash2 size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleActivate(e, u.email)}
                        className="p-1 rounded-lg hover:bg-yellow-500/20 text-yellow-400 transition-colors flex-shrink-0"
                        title="Activate Pro"
                      >
                        <Crown size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Activation panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="card-p flex flex-col gap-4">
              <p className="text-sm font-semibold text-white">Activate Pro by Email</p>
              <p className="text-xs text-slate-400">Enter email manually or click the crown icon next to any user on the left.</p>

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
                  <button onClick={() => handleRevoke(result.email)} className="btn-danger btn-sm">Revoke</button>
                </div>
              )}
            </div>

            {/* Pro users summary */}
            <div className="card-p flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Crown size={16} className="text-yellow-400" />
                <span className="text-sm font-semibold text-white">Pro Users ({premiumUsers.length})</span>
              </div>
              {premiumUsers.length === 0 ? (
                <p className="text-slate-500 text-sm">No pro users yet</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {premiumUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Crown size={12} className="text-yellow-400 flex-shrink-0" />
                        <p className="text-xs text-slate-300 truncate">{u.email}</p>
                      </div>
                      <button onClick={() => handleRevoke(u.email)} className="text-red-400 hover:text-red-300 flex-shrink-0">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-p">
              <p className="section-label mb-3">Payment Instructions</p>
              <ol className="text-sm text-slate-400 flex flex-col gap-2">
                <li>1. User pays $5 via JazzCash / Easypaisa / Payoneer to <span className="text-white font-medium">0323-4109619</span></li>
                <li>2. They send screenshot on WhatsApp</li>
                <li>3. Enter their email above or click 👑 next to their name</li>
                <li>4. They refresh — Pro is active immediately</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
