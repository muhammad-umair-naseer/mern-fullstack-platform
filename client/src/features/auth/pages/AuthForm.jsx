import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import PageHero from '../../../components/PageHero.jsx';
import AuthFormVisual from '../../../components/heroes/AuthFormVisual.jsx';
import Seo from '../../../seo/Seo.jsx';

const RESEND_COOLDOWN = 60;

/**
 * One component behind /login and /signup. Both can land on the same second
 * step: an account is unusable until its email is confirmed, so signing in with
 * an unverified address asks for the code rather than failing.
 *
 * Both steps share the hero and its visual; only the headline and the card's
 * contents change. The hero is keyed on the step, so moving to the code
 * screen (or back) replays the entrance instead of swapping text in place.
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
  const codeRef = useRef(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const destination = location.state?.from || '/dashboard';

  useEffect(() => {
    if (!cooldown) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // The second step replaces the hero, so start it from the top (on a phone
  // the page is still scrolled to the old submit button, which would leave
  // the code field under the navbar), then put the cursor in the code field.
  // Instant, as ScrollToTop does for a new page: html is scroll-behavior
  // smooth, and an animated jump would fight the hero's entrance.
  useEffect(() => {
    if (!pending) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    codeRef.current?.focus({ preventScroll: true });
  }, [pending]);

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

  const startOver = () => {
    setPending(null);
    setCode('');
    setError('');
    setNotice('');
  };

  // Robots.txt already keeps both routes out of search; this gives the tab a
  // real title and marks the pages noindex for anything that ignores it.
  const seo = (
    <Seo
      title={isSignup ? 'Create your free account' : 'Sign in'}
      description={
        isSignup
          ? 'Create a free Cortexis account to take every course and earn its certificate.'
          : 'Sign in to your Cortexis account to pick up your courses where you left off.'
      }
      path={isSignup ? '/signup' : '/login'}
      noindex
    />
  );

  const errorAlert = error && (
    <p role="alert" className="lx-auth-alert lx-auth-alert--error">
      {error}
    </p>
  );

  // ------------------------------------------------------- emailed code
  // Both sign-up and sign-in can land here, since an account is unusable
  // until the code is confirmed.
  if (pending) {
    return (
      <main>
        {seo}
        <PageHero
          key="verify"
          label="Verify"
          lines={['Check your', <em key="em">email.</em>]}
          lede={
            <>
              Check your email for a 6-digit code: <strong className="lx-auth-email">{pending.email}</strong>.
            </>
          }
          visual={
            <AuthFormVisual mode="signup">
              <form onSubmit={handleVerify} className="lx-auth-form">
                {errorAlert}
                {notice && (
                  <p role="status" className="lx-auth-alert lx-auth-alert--ok">
                    {notice}
                  </p>
                )}


                <div>
                  <label htmlFor="code" className="lx-auth-label">
                    Verification code
                  </label>
                  <input
                    id="code"
                    ref={codeRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    required
                    className="lx-auth-input lx-auth-code"
                  />
                </div>

                <button type="submit" disabled={busy || code.length !== 6} className="btn lx-btn lx-auth-submit">
                  {busy ? 'Verifying…' : 'Verify and continue'}
                </button>

                <p className="lx-auth-switch">
                  Didn&rsquo;t get it?{' '}
                  <button type="button" onClick={handleResend} disabled={cooldown > 0} className="lx-auth-textbtn">
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send a new code'}
                  </button>
                </p>
                <p className="lx-auth-switch">
                  Wrong address?{' '}
                  <button type="button" onClick={startOver} className="lx-auth-textbtn">
                    Start over
                  </button>
                </p>
              </form>
            </AuthFormVisual>
          }
        />
      </main>
    );
  }

  // ------------------------------------------------------------ credentials
  return (
    <main>
      {seo}
      <PageHero
        key="credentials"
        label={isSignup ? 'Sign up' : 'Sign in'}
        lines={isSignup ? ['Your free', <em key="em">account.</em>] : ['Welcome', <em key="em">back.</em>]}
        lede={
          isSignup
            ? 'Every course and certificate is free. We email a code to confirm.'
            : 'Sign in to pick up where you left off.'
        }
        visual={
          <AuthFormVisual mode={mode}>
            <form onSubmit={handleSubmit} className="lx-auth-form">
              {errorAlert}

              {isSignup && (
                <div>
                  <label htmlFor="name" className="lx-auth-label">
                    Full name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={update('name')}
                    required
                    minLength={2}
                    autoComplete="name"
                    className="lx-auth-input"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="lx-auth-label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                  autoComplete="email"
                  className="lx-auth-input"
                  placeholder="you@example.com"
                />
                {isSignup && (
                  <p className="lx-auth-hint">
                    Use an address you can open. You&rsquo;ll need the code we send it.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="lx-auth-label">
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
                  className="lx-auth-input"
                  placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
                />
              </div>

              <button type="submit" disabled={busy} className="btn lx-btn lx-auth-submit">
                {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
              </button>

              <p className="lx-auth-switch">
                {isSignup ? 'Already have an account? ' : 'New here? '}
                <Link to={isSignup ? '/login' : '/signup'} className="lx-link">
                  {isSignup ? 'Sign in' : 'Create a free account'}
                </Link>
              </p>
            </form>
          </AuthFormVisual>
        }
      />
    </main>
  );
};

export const Login = () => <AuthForm mode="login" />;
export const Signup = () => <AuthForm mode="signup" />;
export default AuthForm;
