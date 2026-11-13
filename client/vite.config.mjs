import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  return {
    // imagetools makes the srcset sizes of the photos, WebP and AVIF
    // (lib/srcSet.js). Its cache lives next to the build, not in
    // node_modules, so the server's npm ci does not wipe it: a deploy only
    // encodes photos that are new or changed.
    plugins: [react(), imagetools({ cache: { dir: '.imagetools-cache' } })],
    define: { 'process.env': JSON.stringify({ ...env, NODE_ENV: mode === 'production' ? 'production' : 'development', PUBLIC_URL: '' }) },
    build: { outDir: 'build', sourcemap: false, target: 'es2022' },
    server: { strictPort: true },
    test: { globals: true, environment: 'jsdom', setupFiles: ['./src/setupTests.js'], include: ['src/**/*.test.{js,jsx}'] },
  };
});
