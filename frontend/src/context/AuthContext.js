import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading]   = useState(true);

  const loadProfile = async (userId) => {
    if (!userId) { setIsPremium(false); return; }
    const { data } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .single();
    setIsPremium(data?.is_premium || false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user?.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signup = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsPremium(false);
  };

  const refreshPremium = () => loadProfile(user?.id);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <AuthContext.Provider value={{ user, userName, isPremium, login, signup, logout, loading, refreshPremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
