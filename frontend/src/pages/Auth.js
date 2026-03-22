import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Auth() {
  const [mode, setMode]     = useState('login');
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, signup }   = useAuth();
  const navigate            = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        if (!form.name.trim()) return toast.error('Name is required');
        await signup(form.name, form.email, form.password);
        toast.success('Account created! Check your email to confirm.');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-surface flex items-center justify-center px-4"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.06) 0%, transparent 60%)',
      }}
    >
      <div className="w-full max-w-sm animate-slide-up">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to app
        </Link>

        <div className="card-p">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center">
              <Zap size={18} className="text-brand-blue" />
            </div>
            <span className="font-bold text-white text-lg">
              Snaplix
            </span>
          </div>

          <h1 className="text-xl font-semibold text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            {mode === 'login' ? 'Sign in to save your scan history' : 'Join Snaplix today'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={form.name} onChange={set('name')}
                  placeholder="Your name" className="input pl-9" required />
              </div>
            )}
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="email" value={form.email} onChange={set('email')}
                placeholder="Email address" className="input pl-9" required />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" value={form.password} onChange={set('password')}
                placeholder="Password" className="input pl-9" required minLength={6} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-2.5 justify-center">
              {loading && <Spinner size={14} />}
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-4">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-brand-blue hover:underline">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
