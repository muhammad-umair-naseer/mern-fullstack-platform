import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setToken, getToken } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // `loading` starts true so guarded routes wait for the token check instead of
  // bouncing a signed-in learner to the login page on first paint.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await api('/auth/me');
        if (!cancelled) setUser(user);
      } catch {
        setToken(null); // expired or revoked
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const applySession = useCallback(({ token, user }) => {
    setToken(token);
    setUser(user);
    return user;
  }, []);

  // Registration no longer returns a session: the account stays unusable until
  // the emailed code is confirmed, so this resolves to a "needs verification"
  // instruction for the UI rather than a signed-in user.
  const register = useCallback(async (name, email, password) => {
    const res = await api('/auth/register', {
      method: 'POST',
      body: { name, email, password },
      auth: false,
    });
    return { needsVerification: true, email: res.email, emailSent: res.emailSent, message: res.message };
  }, []);

  const login = useCallback(
    async (email, password) => {
      try {
        const res = await api('/auth/login', { method: 'POST', body: { email, password }, auth: false });
        return { user: applySession(res) };
      } catch (err) {
        // Correct password, unconfirmed address — surface it as a step to take
        // rather than as a failure.
        if (err.status === 403 && err.body?.needsVerification) {
          return { needsVerification: true, email: err.body.email, message: err.message };
        }
        throw err;
      }
    },
    [applySession]
  );

  const verify = useCallback(
    async (email, code) => {
      const res = await api('/auth/verify', { method: 'POST', body: { email, code }, auth: false });
      return { user: applySession(res) };
    },
    [applySession]
  );

  const resend = useCallback(
    (email) => api('/auth/resend', { method: 'POST', body: { email }, auth: false }),
    []
  );

  const logout = useCallback(() => {
    // Revoke existing tokens server-side; local logout remains available offline.
    void api('/auth/logout', { method: 'POST' }).catch(() => {});
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verify, resend, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
