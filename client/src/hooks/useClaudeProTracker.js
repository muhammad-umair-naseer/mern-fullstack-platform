import { useEffect, useRef, useState, useCallback } from 'react';
import { api, getToken } from '../lib/api';
import { useAuth } from '../context/AuthContext';

/**
 * Tracks active learning time on a course and communicates heartbeats to the server.
 * High-performance, debounced, and handles page visibility / tab switching to count only active study time.
 */
export function useClaudeProTracker(courseSlug) {
  const { user } = useAuth();
  const [statusData, setStatusData] = useState({
    applied: false,
    status: 'in_progress',
    score: 0,
    timeSpentSeconds: 0,
    timeSpentMinutes: 0,
  });

  const accruedSecondsRef = useRef(0);
  const lastActiveRef = useRef(Date.now());
  const intervalRef = useRef(null);

  // Fetch current status
  const fetchStatus = useCallback(async () => {
    if (!courseSlug || !getToken()) return;
    try {
      const res = await api(`/learn/claude-pro/status/${courseSlug}`);
      if (res?.data) {
        setStatusData(res.data);
      }
    } catch {
      // Ignored for unauthenticated or guests
    }
  }, [courseSlug]);

  // Send heartbeat
  const flushHeartbeat = useCallback(async () => {
    const secondsToSend = accruedSecondsRef.current;
    if (secondsToSend <= 0 || !courseSlug || !getToken()) return;

    accruedSecondsRef.current = 0;
    try {
      const res = await api('/learn/claude-pro/heartbeat', {
        method: 'POST',
        keepalive: true,
        body: { courseSlug, seconds: secondsToSend },
      });
      if (res?.data) {
        setStatusData((prev) => ({
          ...prev,
          timeSpentSeconds: res.data.timeSpentSeconds,
          timeSpentMinutes: Math.round(res.data.timeSpentSeconds / 60),
          status: res.data.status,
          applied: res.data.status === 'applied' || res.data.status === 'awarded',
        }));
      }
    } catch {
      // Re-add unsent seconds if network fails temporarily
      accruedSecondsRef.current += secondsToSend;
    }
  }, [courseSlug]);

  useEffect(() => {
    if (!courseSlug || !user) return;

    fetchStatus();

    // 1-second interval to accumulate active time when document is visible
    intervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        // Avoid jumps if laptop wakes from sleep
        if (now - lastActiveRef.current < 3000) {
          accruedSecondsRef.current += 1;
        }
        lastActiveRef.current = now;

        // Flush every 30 seconds
        if (accruedSecondsRef.current >= 30) {
          flushHeartbeat();
        }
      }
    }, 1000);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushHeartbeat();
      } else {
        lastActiveRef.current = Date.now();
      }
    };

    const onBeforeUnload = () => {
      flushHeartbeat();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
      flushHeartbeat();
    };
  }, [courseSlug, user, fetchStatus, flushHeartbeat]);

  return {
    ...statusData,
    refetch: fetchStatus,
  };
}
