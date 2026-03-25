import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ScanText, Sparkles, BookOpen, FileText, Languages,
  History, ChevronLeft, ChevronRight, LogOut, LogIn, User, Zap, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/',          icon: ScanText,   label: 'Extract' },
  { to: '/clean',     icon: Sparkles,   label: 'Clean' },
  { to: '/notes',     icon: BookOpen,   label: 'Notes' },
  { to: '/pdf',       icon: FileText,   label: 'PDF' },
  { to: '/translate', icon: Languages,  label: 'Translate' },
  { to: '/history',   icon: History,    label: 'History' },
];

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setMobileMenuOpen(false); };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">

      {/* ── Desktop Sidebar ── */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 bg-surface-2 border-r border-surface-3
        transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-56'}`}>

        {/* Logo */}
        <div className="h-16 flex items-center border-b border-surface-3 px-4 gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-brand-blue" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-base tracking-tight whitespace-nowrap">
              Snaplix
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1">
          {!collapsed && <p className="section-label px-2 mb-2">Tools</p>}
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `${isActive ? 'nav-item-active' : 'nav-item'} ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + collapse */}
        <div className="border-t border-surface-3 p-2 flex flex-col gap-1">
          {user ? (
            <>
              {!collapsed && (
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-brand-purple/30 flex items-center justify-center flex-shrink-0">
                    <User size={12} className="text-brand-purple" />
                  </div>
                  <span className="text-xs text-slate-400 truncate">{userName}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className={`nav-item text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <LogOut size={16} />
                {!collapsed && <span>Logout</span>}
              </button>
            </>
          ) : (
            <Link to="/auth" className={`nav-item ${collapsed ? 'justify-center px-0' : ''}`}>
              <LogIn size={16} />
              {!collapsed && <span>Sign In</span>}
            </Link>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`nav-item justify-center mt-1 ${collapsed ? 'px-0' : ''}`}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="h-14 flex-shrink-0 bg-surface-2/80 backdrop-blur-sm border-b border-surface-3
          flex items-center px-4 gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-3 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center">
              <Zap size={14} className="text-brand-blue" />
            </div>
            <span className="font-bold text-white text-sm">Snaplix</span>
          </div>

          <div className="flex-1" />

          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-purple/30 border border-brand-purple/30 flex items-center justify-center">
                <User size={13} className="text-brand-purple" />
              </div>
              <span className="text-sm text-slate-300 hidden sm:block">{userName}</span>
            </div>
          ) : (
            <Link to="/auth" className="btn-ghost btn-sm">Sign In</Link>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-2 border-t border-surface-3
        flex items-center justify-around px-1 h-16 safe-area-pb">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-0
              ${isActive ? 'text-brand-blue' : 'text-slate-500 hover:text-slate-300'}`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Mobile Slide-out Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-64 bg-surface-2 h-full flex flex-col shadow-2xl animate-slide-in">
            <div className="h-14 flex items-center justify-between px-4 border-b border-surface-3">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-brand-blue" />
                <span className="font-bold text-white">Snaplix</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-3 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
              <p className="section-label px-2 mb-2">Tools</p>
              {NAV.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-surface-3 p-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-2 py-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-brand-purple/30 flex items-center justify-center">
                      <User size={13} className="text-brand-purple" />
                    </div>
                    <span className="text-sm text-slate-300 truncate">{userName}</span>
                  </div>
                  <button onClick={handleLogout} className="nav-item text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="nav-item w-full">
                  <LogIn size={16} /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
