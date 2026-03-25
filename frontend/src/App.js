import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UsageProvider } from './context/UsageContext';
import AppShell from './components/AppShell';
import LandingPage from './pages/LandingPage';

const OCRPage       = lazy(() => import('./pages/OCRPage'));
const CleanPage     = lazy(() => import('./pages/CleanPage'));
const NotesPage     = lazy(() => import('./pages/NotesPage'));
const PDFPage       = lazy(() => import('./pages/PDFPage'));
const TranslatePage = lazy(() => import('./pages/TranslatePage'));
const HistoryPage   = lazy(() => import('./pages/HistoryPage'));
const AuthPage      = lazy(() => import('./pages/Auth'));
const AdminPage     = lazy(() => import('./pages/AdminPage'));

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" replace />;
}

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
    </div>
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
                background: '#0f172a',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '13px',
              },
            }}
          />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth */}
              <Route path="/auth"  element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />

              {/* App shell with tools */}
              <Route path="/app" element={<AppShell />}>
                <Route index element={<OCRPage />} />
                <Route path="clean"     element={<CleanPage />} />
                <Route path="notes"     element={<NotesPage />} />
                <Route path="pdf"       element={<PDFPage />} />
                <Route path="translate" element={<TranslatePage />} />
                <Route path="history"   element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </UsageProvider>
    </AuthProvider>
  );
}
