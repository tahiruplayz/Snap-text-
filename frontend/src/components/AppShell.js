import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { ScanText, Sparkles, BookOpen, FileText, Languages, History, Zap, LogOut, LogIn, User, Crown, Shield, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';
import PremiumModal from './PremiumModal';

const NAV = [
  { to: '/app',           icon: ScanText,   label: 'OCR Extract',  color: '#60a5fa' },
  { to: '/app/clean',     icon: Sparkles,   label: 'Clean Text',   color: '#a78bfa' },
  { to: '/app/notes',     icon: BookOpen,   label: 'Notes',        color: '#22d3ee' },
  { to: '/app/pdf',       icon: FileText,   label: 'Image to PDF', color: '#34d399' },
  { to: '/app/translate', icon: Languages,  label: 'Translate',    color: '#fb923c' },
  { to: '/app/history',   icon: History,    label: 'History',      color: '#f472b6' },
];

const ADMIN = 'tahiruplayz@gmail.com';

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, userName, isPremium, logout } = useAuth();
  const { showPremium, setShowPremium, premiumReason } = useUsage();
  const navigate = useNavigate();

  const doLogout = () => { logout(); navigate('/'); setMobileOpen(false); };

  const Sidebar = ({ mobile = false }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d1526', borderRight: '1px solid #1f2937' }}>
      {/* Logo */}
      <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: collapsed && !mobile ? '0 12px' : '0 16px', gap: 10, borderBottom: '1px solid #1f2937', flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
          <Zap size={15} color="#fff" />
        </div>
        {(!collapsed || mobile) && (
          <span style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Scan<span className="gradient-text">lix</span>
          </span>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} style={{ marginLeft: 'auto' }} className="s-btn-icon">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(!collapsed || mobile) && <p className="s-label" style={{ padding: '4px 8px 8px' }}>Tools</p>}
        {NAV.map(({ to, icon: Icon, label, color }) => (
          <NavLink key={to} to={to} end={to === '/app'}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            style={collapsed && !mobile ? { justifyContent: 'center', padding: '8px 0' } : {}}
            title={collapsed && !mobile ? label : undefined}
          >
            <Icon size={16} style={{ color, flexShrink: 0 }} />
            {(!collapsed || mobile) && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid #1f2937', padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {user ? (
          <>
            {(!collapsed || mobile) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', marginBottom: 2 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={13} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</p>
                  {isPremium && <p style={{ fontSize: 10, color: '#fbbf24' }}>Pro</p>}
                </div>
              </div>
            )}
            {user.email === ADMIN && (
              <Link to="/admin" onClick={() => mobile && setMobileOpen(false)}
                className="nav-link" style={{ color: '#fbbf24', ...(collapsed && !mobile ? { justifyContent: 'center', padding: '8px 0' } : {}) }}>
                <Shield size={15} style={{ color: '#fbbf24', flexShrink: 0 }} />
                {(!collapsed || mobile) && <span>Admin</span>}
              </Link>
            )}
            {!isPremium && (
              <button onClick={() => { setShowPremium(true); mobile && setMobileOpen(false); }}
                className="nav-link" style={{ color: '#fbbf24', background: 'none', border: 'none', width: '100%', textAlign: 'left', ...(collapsed && !mobile ? { justifyContent: 'center', padding: '8px 0' } : {}) }}>
                <Crown size={15} style={{ color: '#fbbf24', flexShrink: 0 }} />
                {(!collapsed || mobile) && <span>Upgrade Pro</span>}
              </button>
            )}
            <button onClick={doLogout} className="nav-link" style={{ color: '#f87171', background: 'none', border: 'none', width: '100%', textAlign: 'left', ...(collapsed && !mobile ? { justifyContent: 'center', padding: '8px 0' } : {}) }}>
              <LogOut size={15} style={{ color: '#f87171', flexShrink: 0 }} />
              {(!collapsed || mobile) && <span>Logout</span>}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => { setShowPremium(true); mobile && setMobileOpen(false); }}
              className="nav-link" style={{ color: '#fbbf24', background: 'none', border: 'none', width: '100%', textAlign: 'left', ...(collapsed && !mobile ? { justifyContent: 'center', padding: '8px 0' } : {}) }}>
              <Crown size={15} style={{ color: '#fbbf24', flexShrink: 0 }} />
              {(!collapsed || mobile) && <span>Upgrade Pro</span>}
            </button>
            <Link to="/auth" onClick={() => mobile && setMobileOpen(false)}
              className="nav-link" style={collapsed && !mobile ? { justifyContent: 'center', padding: '8px 0' } : {}}>
              <LogIn size={15} style={{ flexShrink: 0 }} />
              {(!collapsed || mobile) && <span>Sign In</span>}
            </Link>
          </>
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(c => !c)} className="nav-link" style={{ justifyContent: 'center', marginTop: 4 }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0b1220' }}>
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} reason={premiumReason} />}

      {/* Desktop sidebar */}
      <div className="hidden md:block" style={{ width: collapsed ? 64 : 220, flexShrink: 0, transition: 'width 0.25s ease' }}>
        <Sidebar />
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, borderBottom: '1px solid #1f2937', background: 'rgba(13,21,38,0.8)', backdropFilter: 'blur(12px)' }}>
          <button className="md:hidden s-btn-icon" onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>
          <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={14} color="#3b82f6" />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>Scan<span className="gradient-text">lix</span></span>
          </div>
          <div style={{ flex: 1 }} />
          {isPremium && <span className="s-badge s-badge-gold"><Crown size={10} /> Pro</span>}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={14} color="#fff" />
              </div>
              <span style={{ fontSize: 13, color: '#94a3b8', display: 'none' }} className="sm:block">{userName}</span>
            </div>
          ) : (
            <Link to="/auth" className="s-btn s-btn-ghost s-btn-sm">Sign In</Link>
          )}
        </div>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <div className="md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 60, borderTop: '1px solid #1f2937', background: 'rgba(13,21,38,0.95)', backdropFilter: 'blur(12px)' }}>
        {NAV.map(({ to, icon: Icon, label, color }) => (
          <NavLink key={to} to={to} end={to === '/app'}
            style={({ isActive }) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 8px', borderRadius: 10, color: isActive ? color : '#475569', transition: 'all 0.15s', textDecoration: 'none' })}>
            <Icon size={20} />
            <span style={{ fontSize: 9, fontWeight: 600 }}>{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'relative', width: 260, height: '100%' }} className="animate-slide-in">
            <Sidebar mobile />
          </div>
        </div>
      )}
    </div>
  );
}
