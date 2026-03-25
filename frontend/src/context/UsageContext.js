import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const LIMITS = { ocr: 5, clean: 2, translate: 2, pdf: 1 };
const STORAGE_KEY = 'snaplix_usage';

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function loadUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed.date !== getTodayKey()) return {};
    return parsed.counts || {};
  } catch { return {}; }
}

function saveUsage(counts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), counts }));
}

const UsageContext = createContext(null);

export function UsageProvider({ children }) {
  const { isPremium } = useAuth();
  const [counts, setCounts]           = useState(loadUsage);
  const [showPremium, setShowPremium] = useState(false);
  const [premiumReason, setPremiumReason] = useState('');

  // 5-minute periodic popup (only for non-premium users)
  useEffect(() => {
    if (isPremium) return;
    const timer = setInterval(() => {
      setShowPremium(true);
      setPremiumReason('');
    }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [isPremium]);

  const canUse = useCallback((action) => {
    if (isPremium) return true;
    const limit = LIMITS[action];
    if (!limit) return true;
    return (counts[action] || 0) < limit;
  }, [counts, isPremium]);

  const consume = useCallback((action) => {
    if (isPremium) return;
    setCounts(prev => {
      const next = { ...prev, [action]: (prev[action] || 0) + 1 };
      saveUsage(next);
      return next;
    });
  }, [isPremium]);

  const tryUse = useCallback((action) => {
    if (isPremium) return true;
    if (!canUse(action)) {
      const limit = LIMITS[action];
      setPremiumReason(`You've used all ${limit} free ${action} operations today. Upgrade to Pro for unlimited access.`);
      setShowPremium(true);
      return false;
    }
    consume(action);
    return true;
  }, [canUse, consume, isPremium]);

  const remaining = useCallback((action) => {
    if (isPremium) return '∞';
    const limit = LIMITS[action];
    if (!limit) return '∞';
    return Math.max(0, limit - (counts[action] || 0));
  }, [counts, isPremium]);

  return (
    <UsageContext.Provider value={{ tryUse, remaining, showPremium, setShowPremium, premiumReason, LIMITS, isPremium }}>
      {children}
    </UsageContext.Provider>
  );
}

export const useUsage = () => useContext(UsageContext);
