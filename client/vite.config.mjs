import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  return {
    // imagetools makes the srcset sizes of the photos (lib/srcSet.js).
    plugins: [react(), imagetools()],
    define: { 'process.env': JSON.stringify({ ...env, NODE_ENV: mode === 'production' ? 'production' : 'development', PUBLIC_URL: '' }) },
    build: { outDir: 'build', sourcemap: false, target: 'es2022' },
    server: { strictPort: true },
    test: { globals: true, environment: 'jsdom', setupFiles: ['./src/setupTests.js'], include: ['src/**/*.test.{js,jsx}'] },
  };
});
