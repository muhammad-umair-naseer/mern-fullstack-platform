import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../learn/ProgressBar';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api('/learn/my');
        if (!cancelled) {
          setCourses(data);
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">
        Welcome back, {user?.name?.split(' ')[0]}
      </h1>
      <p className="mt-2 text-slate-600">Your enrolled courses and progress.</p>

      {status === 'loading' && (
        <div className="mt-16 grid place-items-center">
          <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
        </div>
      )}

      {status === 'error' && (
        <p className="mt-10 text-slate-600">Could not load your courses. Please refresh.</p>
      )}

      {status === 'ready' && courses.length === 0 && (
        <div className="mt-10 bg-white rounded-2xl shadow-card p-10 text-center">
          <p className="text-lg font-semibold text-slate-900">You have not enrolled yet</p>
          <p className="mt-2 text-slate-600">Every course is free, including the certificate.</p>
          <Link
            to="/courses"
            className="mt-6 inline-block px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Browse courses
          </Link>
        </div>
      )}

      {status === 'ready' && courses.length > 0 && (
        <div className="mt-8 space-y-4">
          {courses.map((c) => (
            <article key={c.id} className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900">{c.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {c.category} · {c.duration}
                  </p>
                </div>
                {c.certificate ? (
                  <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300">
                    Certified · {c.certificate.score}%
                  </span>
                ) : (
                  <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300">
                    In progress
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>
                    {c.completed}/{c.total} lessons
                  </span>
                  <span className="font-semibold">{c.percent}%</span>
                </div>
                <ProgressBar percent={c.percent} />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={`/learn/${c.slug}`}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                >
                  {c.percent === 100 ? 'Review course' : 'Continue learning'}
                </Link>
                {c.certificate && (
                  <Link
                    to={`/certificate/${c.certificate.code}`}
                    className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-white/5"
                  >
                    View certificate
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
