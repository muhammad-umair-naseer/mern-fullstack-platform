import React, { useState } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';

// Fake Turnstile: records each render() call's options so the test can fire callbacks.
const renders = [];
beforeEach(() => {
  renders.length = 0;
  window.turnstile = {
    render: (_el, opts) => { renders.push(opts); return renders.length; },
    reset: vi.fn(),
    remove: vi.fn(),
  };
  // loadScript resolves when the script tag loads; fire onload as soon as it is added.
  vi.spyOn(document.head, 'appendChild').mockImplementation((el) => { setTimeout(() => el.onload?.()); return el; });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); vi.resetModules(); vi.restoreAllMocks(); });

async function mount() {
  vi.stubEnv('REACT_APP_TURNSTILE_SITE_KEY', '0xTEST');
  const { default: Turnstile } = await import('./Turnstile.jsx');
  let token = '';
  function Host() { const [, set] = useState(''); return <Turnstile action="login" onToken={(t) => { token = t; set(t); }} />; }
  render(<Host />);
  await act(() => vi.advanceTimersByTimeAsync(0));
  return { token: () => token };
}

test('starts invisible; after 8 s without a token shows the checkbox and a retry link', async () => {
  vi.useFakeTimers();
  await mount();
  expect(renders.at(-1).appearance).toBe('interaction-only');
  expect(screen.queryByText(/tap here to retry/)).toBeNull();
  await act(() => vi.advanceTimersByTimeAsync(8000));
  expect(screen.getByText(/tap here to retry/)).toBeTruthy();
  expect(renders.at(-1).appearance).toBe('always');
  fireEvent.click(screen.getByText(/tap here to retry/));
  await act(() => vi.advanceTimersByTimeAsync(0));
  expect(screen.queryByText(/tap here to retry/)).toBeNull();
  expect(renders.at(-1).appearance).toBe('always');
});

test('a token in time hides nothing extra; one error retries quietly, a second offers retry', async () => {
  vi.useFakeTimers();
  const host = await mount();
  act(() => renders.at(-1).callback('tok'));
  expect(host.token()).toBe('tok');
  await act(() => vi.advanceTimersByTimeAsync(9000));
  expect(screen.queryByText(/tap here to retry/)).toBeNull();
  act(() => { renders.at(-1)['error-callback'](); });
  expect(window.turnstile.reset).toHaveBeenCalledTimes(1);
  expect(screen.queryByText(/tap here to retry/)).toBeNull();
  await act(async () => { renders.at(-1)['error-callback'](); });
  expect(screen.getByText(/tap here to retry/)).toBeTruthy();
});
