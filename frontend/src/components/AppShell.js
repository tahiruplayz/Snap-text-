import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ScanText, Sparkles, BookOpen, FileText, Languages,
  History, ChevronLeft, ChevronRight, LogOut, LogIn,
  User, Zap, Menu, X, Crown, Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';
import PremiumModal from './PremiumModal';

const NAV = [
  { to: '/app',           icon: ScanText,   label: 'OCR Extract',    color: 'text-blue-400' },
  { to: '/app/clean',     icon: Sparkles,   label: 'Clean Text',     color: 'text-purple-400' },
  { to: '/app/notes',     icon: BookOpen,   label: 'Notes',          color: 'text-cyan-400' },
  { to: '/app/pdf',       icon: FileText,   label: 'Image to PDF',   color: 'text-emerald-400' },
  { to: '/app/translate', icon: Languages,  label: 'Translate',      color: 'text-orange-400' },
  { to: '/app/history',   icon: History,    label: 'History',        color: 'text-pink-400' },
];

const ADMIN_EMAIL = 'tahiruplayz@gmail.com';

export default function AppShell() {
  const [collapsed, setCollapsed]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userName, isPremium, logout } = useAuth();
  const { showPremium, setShowPremium, premiumReason } = useUsage();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setMobileMenuOpen(false); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0b1220' }}>
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} reason={premiumReason} />}

      {/* ── Desktop Sidebar ── */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 border-r border-surface-4
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}`}
        style={{ background: '#111827' }}>

        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-surface-4 px-4 gap-3 flex-shrink-0`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-glow-blue">
            <Zap size={15} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-base tracking-tight whitespace-nowrap">
              Scan<span className="gradient-text">lix</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
          {!collapsed && <p className="section-label px-3 mb-3">Tools</p>}
          {NAV.map(({ to, icon: Icon, label, color }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              className={({ isActive }) =>
                `${isActive ? 'nav-item-active' : 'nav-item'} ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className={`flex-shrink-0 ${color}`} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-surface-4 p-2 flex flex-col gap-1">
          {user ? (
            <>
              {!collapsed && (
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <User size={11} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 truncate font-medium">{userName}</p>
                    {isPremium && <p className="text-[10px] text-yellow-400">Pro</p>}
                  </div>
                </div>
              )}
              {user.email === ADMIN_EMAIL && (
                <Link to="/admin" className={`nav-item text-yellow-400 hover:bg-yellow-500/10 ${collapsed ? 'justify-center px-0' : ''}`}>
                  <Shield size={15} />
                  {!collapsed && <span>Admin</span>}
                </Link>
              )}
              {!isPremium && (
                <button onClick={() => setShowPremium(true)}
                  className={`nav-item text-yellow-400 hover:bg-yellow-500/10 ${collapsed ? 'justify-center px-0' : ''}`}>
                  <Crown size={15} />
                  {!collapsed && <span>Upgrade Pro</span>}
                </button>
              )}
              <button onClick={handleLogout}
                className={`nav-item text-red-400 hover:bg-red-500/10 ${collapsed ? 'justify-center px-0' : ''}`}>
                <LogOut size={15} />
                {!collapsed && <span>Logout</span>}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowPremium(true)}
                className={`nav-item text-yellow-400 hover:bg-yellow-500/10 ${collapsed ? 'justify-center px-0' : ''}`}>
                <Crown size={15} />
                {!collapsed && <span>Upgrade Pro</span>}
              </button>
              <Link to="/auth" className={`nav-item ${collapsed ? 'justify-center px-0' : ''}`}>
                <LogIn size={15} />
                {!collapsed && <span>Sign In</span>}
              </Link>
            </>
          )}
          <button onClick={() => setCollapsed(c => !c)}
            className={`nav-item justify-center mt-1 ${collapsed ? 'px-0' : ''}`}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 flex-shrink-0 border-b border-surface-4 flex items-center px-4 gap-3"
          style={{ background: 'rgba(17,24,39,0.8)', backdropFilter: 'blur(12px)' }}>
          <button onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">Scan<span className="gradient-text">lix</span></span>
          </div>
          <div className="flex-1" />
          {isPremium && (
            <span className="badge-gold hidden sm:flex"><Crown size={11} /> Pro</span>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm text-slate-300 hidden sm:block">{userName}</span>
            </div>
          ) : (
            <Link to="/auth" className="btn-ghost btn-sm">Sign In</Link>
          )}
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Bottom Tabs ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-surface-4 flex items-center justify-around px-1 h-16"
        style={{ background: 'rgba(17,24,39,0.95)', backdropFilter: 'blur(12px)' }}>
        {NAV.map(({ to, icon: Icon, label, color }) => (
          <NavLink key={to} to={to} end={to === '/app'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all
              ${isActive ? `${color} scale-105` : 'text-slate-500 hover:text-slate-300'}`
            }>
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 h-full flex flex-col shadow-2xl animate-slide-in border-r border-surface-4"
            style={{ background: '#111827' }}>
            <div className="h-14 flex items-center justify-between px-4 border-b border-surface-4">
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-blue-400" />
                <span className="font-bold text-white">Scan<span className="gradient-text">lix</span></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
              {NAV.map(({ to, icon: Icon, label, color }) => (
                <NavLink key={to} to={to} end={to === '/app'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}>
                  <Icon size={16} className={color} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-surface-4 p-3 flex flex-col gap-1">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-2 py-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User size={13} className="text-white" />
                    </div>
                    <span className="text-sm text-slate-300 truncate">{userName}</span>
                    {isPremium && <Crown size={12} className="text-yellow-400 ml-auto" />}
                  </div>
                  {!isPremium && (
                    <button onClick={() => { setShowPremium(true); setMobileMenuOpen(false); }}
                      className="nav-item text-yellow-400 hover:bg-yellow-500/10 w-full">
                      <Crown size={15} /> Upgrade to Pro
                    </button>
                  )}
                  <button onClick={handleLogout} className="nav-item text-red-400 hover:bg-red-500/10 w-full">
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setShowPremium(true); setMobileMenuOpen(false); }}
                    className="nav-item text-yellow-400 hover:bg-yellow-500/10 w-full">
                    <Crown size={15} /> Upgrade to Pro
                  </button>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="nav-item w-full">
                    <LogIn size={15} /> Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
