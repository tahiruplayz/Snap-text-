import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LIMITS = { ocr: 5, clean: 2, translate: 2, pdf: 1 };
const STORAGE_KEY = 'snaplix_usage';

function getTodayKey() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function loadUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Reset if it's a new day
    if (parsed.date !== getTodayKey()) return {};
    return parsed.counts || {};
  } catch { return {}; }
}

function saveUsage(counts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), counts }));
}

const UsageContext = createContext(null);

export function UsageProvider({ children }) {
  const [counts, setCounts] = useState(loadUsage);
  const [showPremium, setShowPremium] = useState(false);
  const [premiumReason, setPremiumReason] = useState('');

  // 5-minute periodic popup
  useEffect(() => {
    const INTERVAL = 5 * 60 * 1000; // 5 minutes
    const timer = setInterval(() => {
      setShowPremium(true);
      setPremiumReason('');
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const canUse = useCallback((action) => {
    const limit = LIMITS[action];
    if (!limit) return true; // no limit for this action
    return (counts[action] || 0) < limit;
  }, [counts]);

  const consume = useCallback((action) => {
    setCounts(prev => {
      const next = { ...prev, [action]: (prev[action] || 0) + 1 };
      saveUsage(next);
      return next;
    });
  }, []);

  const tryUse = useCallback((action) => {
    if (!canUse(action)) {
      const limit = LIMITS[action];
      setPremiumReason(`You've used all ${limit} free ${action} operations for today. Upgrade to Pro for unlimited access.`);
      setShowPremium(true);
      return false;
    }
    consume(action);
    return true;
  }, [canUse, consume]);

  const remaining = useCallback((action) => {
    const limit = LIMITS[action];
    if (!limit) return Infinity;
    return Math.max(0, limit - (counts[action] || 0));
  }, [counts]);

  return (
    <UsageContext.Provider value={{ tryUse, remaining, showPremium, setShowPremium, premiumReason, LIMITS }}>
      {children}
    </UsageContext.Provider>
  );
}

export const useUsage = () => useContext(UsageContext);
