import React, { useEffect, useRef } from 'react';

/**
 * Second step of sign-up and sign-in: an account is unusable until its emailed
 * code is confirmed, so both flows can land here.
 */
const VerificationStep = ({
  pending,
  code,
  setCode,
  error,
  notice,
  busy,
  cooldown,
  onVerify,
  onResend,
  onStartOver,
}) => {
  const codeRef = useRef(null);

  useEffect(() => {
    codeRef.current?.focus();
  }, []);

  return (
    <main className="min-h-[80vh] grid place-items-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Check your email</h1>
          <p className="mt-2 text-slate-600">
            We sent a 6-digit code to <span className="font-semibold">{pending.email}</span>.
            Enter it below to activate your account.
          </p>
        </div>

        <form onSubmit={onVerify} className="bg-white rounded-2xl shadow-cardLg p-6 md:p-8 space-y-5">
          {error && (
            <p role="alert" className="rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 px-4 py-3 text-sm">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-4 py-3 text-sm">
              {notice}
            </p>
          )}
          {pending.emailSent === false && (
            <p className="rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 px-4 py-3 text-sm">
              Email delivery is not configured yet, so the code was written to the server log.
            </p>
          )}

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1.5">
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
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-center text-2xl tracking-[0.4em] font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {busy ? 'Verifying…' : 'Verify and continue'}
          </button>

          <div className="text-center text-sm text-slate-600">
            Didn&rsquo;t get it?{' '}
            <button
              type="button"
              onClick={onResend}
              disabled={cooldown > 0}
              className="text-indigo-600 font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send a new code'}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500">
            Wrong address?{' '}
            <button
              type="button"
              onClick={onStartOver}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Start over
            </button>
          </p>
        </form>
      </div>
    </main>
  );
};

export default VerificationStep;
