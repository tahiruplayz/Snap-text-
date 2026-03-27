import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ScanText, Sparkles, BookOpen, FileText, Languages, History,
  Zap, Shield, Globe, ArrowRight, Check, Star, LogOut, User, Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAIL = 'tahiruplayz@gmail.com';

const TOOLS = [
  { icon: ScanText,  label: 'OCR Extract',    desc: 'Extract text from any image with AI-powered OCR',          to: '/app',           grad: 'from-blue-500/20 to-blue-600/5',    border: 'border-blue-500/20',    ic: 'text-blue-400' },
  { icon: Sparkles,  label: 'AI Text Cleaner', desc: 'Fix grammar, spacing and OCR noise automatically',        to: '/app/clean',     grad: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20',  ic: 'text-purple-400' },
  { icon: BookOpen,  label: 'Notes Generator', desc: 'Convert raw text into structured notes and summaries',    to: '/app/notes',     grad: 'from-cyan-500/20 to-cyan-600/5',    border: 'border-cyan-500/20',    ic: 'text-cyan-400' },
  { icon: FileText,  label: 'Image to PDF',    desc: 'Extract text and export as PDF, DOCX or TXT instantly',  to: '/app/pdf',       grad: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20', ic: 'text-emerald-400' },
  { icon: Languages, label: 'AI Translator',   desc: 'Translate text into 14+ languages with high accuracy',   to: '/app/translate', grad: 'from-orange-500/20 to-orange-600/5', border: 'border-orange-500/20',  ic: 'text-orange-400' },
  { icon: History,   label: 'Scan History',    desc: 'Access all your previous scans and extractions',         to: '/app/history',   grad: 'from-pink-500/20 to-pink-600/5',    border: 'border-pink-500/20',    ic: 'text-pink-400' },
];

const WHY = [
  { icon: Zap,    title: 'Lightning Fast',   desc: 'Optimized AI models deliver results in seconds',          color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: Shield, title: 'Private & Secure', desc: 'Files processed instantly, never stored permanently',     color: 'text-green-400',  bg: 'bg-green-500/10' },
  { icon: Globe,  title: 'Multi-Language',   desc: 'Supports 8+ languages including Urdu, Arabic, Chinese',  color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  { icon: Star,   title: 'Free to Start',    desc: 'Core features free forever, upgrade when you need more', color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export default function LandingPage() {
  const { user, userName, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0b1220' }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-4"
        style={{ background: 'rgba(11,18,32,0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow-blue">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Scan<span className="gradient-text">lix</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/app" className="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5">Tools</Link>
            {user ? (
              <>
                {user.email === ADMIN_EMAIL && (
                  <Link to="/admin" className="btn-ghost btn-sm text-yellow-400 border-yellow-500/20 hover:border-yellow-500/40">
                    <Shield size={13} /> Admin
                  </Link>
                )}
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300 px-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User size={12} className="text-white" />
                  </div>
                  {userName}
                </div>
                <Link to="/app" className="btn-ghost btn-sm">Dashboard</Link>
                <button onClick={handleLogout} className="btn-ghost btn-sm text-red-400 hover:text-red-300">
                  <LogOut size={13} />
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn-ghost btn-sm">Sign In</Link>
                <Link to="/app" className="btn-primary btn-sm">Get Started <ArrowRight size={13} /></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 px-4 sm:px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 bg-grad-hero pointer-events-none" />
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none animate-glow-pulse" />
        <div className="absolute top-32 right-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 badge-blue mb-8 text-sm px-4 py-2">
            <span className="glow-dot" />
            AI-Powered Text Extraction Tools
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Turn Images into
            <br />
            <span className="gradient-text">Smart Digital Notes</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Extract text from any image, clean it with AI, translate, generate structured notes and export to PDF — all in seconds. Free to use.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/app" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto shadow-glow-blue">
              Try Now — It's Free <ArrowRight size={18} />
            </Link>
            <Link to="/auth" className="btn-ghost text-base px-8 py-3.5 w-full sm:w-auto">
              Create Account
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[['8+', 'Languages Supported'], ['5', 'AI-Powered Tools'], ['Free', 'No Credit Card']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold gradient-text">{val}</p>
                <p className="text-slate-500 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools Grid ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-4">What We Offer</p>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Powerful AI tools wrapped in a simple, beautiful interface.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map(({ icon: Icon, label, desc, to, grad, border, ic }) => (
              <Link key={to} to={to}
                className={`group relative bg-gradient-to-br ${grad} border ${border} rounded-2xl p-6
                  hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 overflow-hidden`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03), transparent 70%)' }} />
                <div className={`w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5 ${ic} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                <div className={`mt-5 flex items-center gap-1.5 text-xs font-semibold ${ic} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1`}>
                  Open tool <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Scanlix ── */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Why Choose Us</p>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 tracking-tight">Built for Speed & Simplicity</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">No complicated setup. No bloat. Just tools that work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card card-hover p-6 text-center group">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-5 ${color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing CTA ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative card p-10 sm:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="badge-gold mb-5 mx-auto w-fit text-sm px-4 py-1.5">
                <Crown size={13} /> Pro Plan
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Unlock Unlimited Access</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">Remove all daily limits and get priority processing.</p>
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {['Unlimited OCR', 'Unlimited AI', 'All Languages', 'Priority Speed', 'Scan History'].map(f => (
                  <span key={f} className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    <Check size={13} className="text-green-400" /> {f}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/app" className="btn-primary text-base px-10 py-3.5">
                  Get Pro — $5/month
                </Link>
                <Link to="/app" className="btn-ghost text-base px-10 py-3.5">
                  Try Free First
                </Link>
              </div>
              <p className="text-slate-500 text-sm mt-5">Pay via JazzCash · Easypaisa · Payoneer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-4 py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap size={13} className="text-white" />
                </div>
                <span className="font-bold text-white">Scan<span className="gradient-text">lix</span></span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">Fast, free, AI-powered tools for everyday text and image tasks.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Tools</p>
              <ul className="flex flex-col gap-2.5">
                {TOOLS.map(t => (
                  <li key={t.to}>
                    <Link to={t.to} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{t.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Company</p>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-500">
                <li><Link to="/auth" className="hover:text-slate-300 transition-colors">Sign Up Free</Link></li>
                <li><a href="https://wa.me/923234109619" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">Contact Us</a></li>
                <li><span>Privacy Policy</span></li>
              </ul>
            </div>
          </div>
          <div className="divider pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-sm">© 2024 Scanlix. All rights reserved.</p>
            <p className="text-slate-600 text-sm">Made with ❤️ for productivity</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
