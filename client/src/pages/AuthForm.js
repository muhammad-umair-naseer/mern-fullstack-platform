import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VerificationStep from '../components/auth/VerificationStep';

const RESEND_COOLDOWN = 60;

/**
 * One component behind /login and /signup. Both can land on the same second
 * step: an account is unusable until its email is confirmed, so signing in with
 * an unverified address asks for the code rather than failing.
 */
const AuthForm = ({ mode }) => {
  const isSignup = mode === 'signup';
  const { login, register, verify, resend } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Second step
  const [pending, setPending] = useState(null); // { email, message, emailSent }
  const [code, setCode] = useState('');
  const [notice, setNotice] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const destination = location.state?.from || '/dashboard';

  useEffect(() => {
    if (!cooldown) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = isSignup
        ? await register(form.name, form.email, form.password)
        : await login(form.email, form.password);

      if (result?.needsVerification) {
        setPending({ email: result.email, message: result.message, emailSent: result.emailSent });
        setCooldown(RESEND_COOLDOWN);
      } else {
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setError(err.details?.[0]?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await verify(pending.email, code.trim());
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setNotice('');
    try {
      const res = await resend(pending.email);
      setNotice(res.message);
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.message);
    }
  };

  // The emailed-code screen is its own component; both sign-up and sign-in
  // can land on it, since an account is unusable until the code is confirmed.
  if (pending) {
    return (
      <VerificationStep
        pending={pending}
        code={code}
        setCode={setCode}
        error={error}
        notice={notice}
        busy={busy}
        cooldown={cooldown}
        onVerify={handleVerify}
        onResend={handleResend}
        onStartOver={() => {
          setPending(null);
          setCode('');
          setError('');
          setNotice('');
        }}
      />
    );
  }

  // ------------------------------------------------------------ credentials
  return (
    <main className="min-h-[80vh] grid place-items-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isSignup ? 'Create your free account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-slate-600">
            {isSignup
              ? 'Every course and certificate is free. We email a code to confirm your address.'
              : 'Sign in to pick up where you left off.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-cardLg p-6 md:p-8 space-y-5">
          {error && (
            <p role="alert" className="rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 px-4 py-3 text-sm">
              {error}
            </p>
          )}

          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                Full name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={update('name')}
                required
                minLength={2}
                autoComplete="name"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ali Raza"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={update('email')}
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
            {isSignup && (
              <p className="mt-1.5 text-xs text-slate-500">
                Use an address you can open. You&rsquo;ll need the code we send it.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={update('password')}
              required
              minLength={isSignup ? 8 : undefined}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-slate-600">
            {isSignup ? 'Already have an account? ' : 'New here? '}
            <Link to={isSignup ? '/login' : '/signup'} className="text-indigo-600 font-semibold hover:underline">
              {isSignup ? 'Sign in' : 'Create a free account'}
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export const Login = () => <AuthForm mode="login" />;
export const Signup = () => <AuthForm mode="signup" />;
export default AuthForm;
