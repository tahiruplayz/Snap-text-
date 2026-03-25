import React from 'react';
import { Link } from 'react-router-dom';
import {
  ScanText, Sparkles, BookOpen, FileText, Languages, History,
  Zap, Shield, Globe, ArrowRight, Check, Star,
} from 'lucide-react';

const TOOLS = [
  { icon: ScanText,  label: 'OCR Extract',      desc: 'Extract text from any image instantly with AI-powered OCR',       to: '/',          color: 'from-blue-500/20 to-blue-600/10',   border: 'border-blue-500/20',   iconColor: 'text-blue-400' },
  { icon: Sparkles,  label: 'AI Text Cleaner',   desc: 'Fix grammar, spacing and OCR noise using advanced AI',            to: '/clean',     color: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/20', iconColor: 'text-violet-400' },
  { icon: BookOpen,  label: 'Notes Generator',   desc: 'Convert raw text into structured notes and summaries',            to: '/notes',     color: 'from-cyan-500/20 to-cyan-600/10',   border: 'border-cyan-500/20',   iconColor: 'text-cyan-400' },
  { icon: FileText,  label: 'Image to PDF',      desc: 'Extract text from images and export as PDF, DOCX or TXT',        to: '/pdf',       color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', iconColor: 'text-emerald-400' },
  { icon: Languages, label: 'AI Translator',     desc: 'Translate text into 14+ languages with high accuracy',           to: '/translate', color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20', iconColor: 'text-orange-400' },
  { icon: History,   label: 'Scan History',      desc: 'Access all your previous scans and extractions anytime',         to: '/history',   color: 'from-pink-500/20 to-pink-600/10',   border: 'border-pink-500/20',   iconColor: 'text-pink-400' },
];

const WHY = [
  { icon: Zap,    title: 'Lightning Fast',    desc: 'Powered by optimized AI models for instant results',    color: 'text-yellow-400' },
  { icon: Shield, title: 'Private & Secure',  desc: 'Your files are processed and never stored permanently', color: 'text-green-400' },
  { icon: Globe,  title: 'Multi-Language',    desc: 'Supports 8+ languages including Urdu, Arabic, Chinese', color: 'text-blue-400' },
  { icon: Star,   title: 'Free to Start',     desc: 'Use core features for free, upgrade when you need more', color: 'text-violet-400' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0a0f1e]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Snaplix</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/app" className="hidden sm:block text-slate-400 hover:text-white text-sm transition-colors">Tools</Link>
            <Link to="/auth" className="btn-ghost btn-sm">Sign In</Link>
            <Link to="/app" className="btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 badge-blue mb-6 text-sm px-4 py-1.5">
            <Zap size={13} /> AI-Powered Text Tools
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
            All-in-One{' '}
            <span className="gradient-text">Online Tools</span>
            <br />for Everyday Tasks
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Extract text from images, clean with AI, translate, generate notes and export to PDF — all in one place. Fast, free, and no signup required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app" className="btn-primary text-base px-8 py-3 w-full sm:w-auto">
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/auth" className="btn-ghost text-base px-8 py-3 w-full sm:w-auto">
              Create Account
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-14">
            {[['8+', 'Languages'], ['5', 'AI Tools'], ['Free', 'To Start']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold gradient-text">{val}</p>
                <p className="text-slate-500 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools Grid ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Tools, Simple Interface</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Everything you need to work with text and images, powered by the latest AI technology.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map(({ icon: Icon, label, desc, to, color, border, iconColor }) => (
              <Link
                key={to}
                to={`/app${to === '/' ? '' : to}`}
                className={`group relative bg-gradient-to-br ${color} border ${border} rounded-2xl p-6
                  hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/3 transition-colors duration-300 rounded-2xl" />
                <div className={`w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-4 ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  Try it now <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Snaplix ── */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built for Speed & Simplicity</h2>
            <p className="text-slate-400 max-w-xl mx-auto">No complicated setup. No bloat. Just tools that work.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card-p text-center hover:border-white/20 transition-colors duration-300 group">
                <div className={`w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center mx-auto mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>
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
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative card-p p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="badge-gold mb-4 mx-auto w-fit">👑 Pro Plan</div>
              <h2 className="text-3xl font-bold text-white mb-3">Unlock Unlimited Access</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Remove all daily limits and get priority processing for just $5/month.</p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['Unlimited OCR', 'Unlimited AI', 'All Languages', 'Priority Speed', 'Scan History'].map(f => (
                  <span key={f} className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                    <Check size={12} className="text-green-400" /> {f}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/app" className="btn-primary text-base px-8 py-3">
                  Get Pro — $5/month
                </Link>
                <Link to="/app" className="btn-ghost text-base px-8 py-3">
                  Try Free First
                </Link>
              </div>
              <p className="text-slate-500 text-xs mt-4">Pay via JazzCash · Easypaisa · Payoneer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="font-bold text-white">Snaplix</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">Fast, free, AI-powered tools for everyday text and image tasks.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-3 text-sm">Tools</p>
              <ul className="flex flex-col gap-2">
                {TOOLS.map(t => (
                  <li key={t.to}>
                    <Link to={`/app${t.to === '/' ? '' : t.to}`} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-3 text-sm">Company</p>
              <ul className="flex flex-col gap-2 text-sm text-slate-500">
                <li><Link to="/auth" className="hover:text-slate-300 transition-colors">Sign Up Free</Link></li>
                <li><a href="https://wa.me/923234109619" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">Contact Us</a></li>
                <li><span className="cursor-default">Privacy Policy</span></li>
              </ul>
            </div>
          </div>
          <div className="divider pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-sm">© 2024 Snaplix. All rights reserved.</p>
            <p className="text-slate-600 text-sm">Made with ❤️ for productivity</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
