import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UsageProvider, useUsage } from './context/UsageContext';
import PremiumModal from './components/PremiumModal';
import AppShell from './components/AppShell';

const OCRPage      = lazy(() => import('./pages/OCRPage'));
const CleanPage    = lazy(() => import('./pages/CleanPage'));
const NotesPage    = lazy(() => import('./pages/NotesPage'));
const PDFPage      = lazy(() => import('./pages/PDFPage'));
const TranslatePage = lazy(() => import('./pages/TranslatePage'));
const HistoryPage  = lazy(() => import('./pages/HistoryPage'));
const AuthPage     = lazy(() => import('./pages/Auth'));

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" replace />;
}

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-surface-4 border-t-brand-blue rounded-full animate-spin" />
    </div>
  );
}

function AppRoutes() {
  const { showPremium, setShowPremium, premiumReason } = useUsage();
  return (
    <Suspense fallback={<PageLoader />}>
      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          reason={premiumReason}
        />
      )}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<AppShell />}>
          <Route path="/"          element={<OCRPage />} />
          <Route path="/clean"     element={<CleanPage />} />
          <Route path="/notes"     element={<NotesPage />} />
          <Route path="/pdf"       element={<PDFPage />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/history"   element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UsageProvider>
        <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
      </UsageProvider>
    </AuthProvider>
  );
}
