import path from 'node:path';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * Read-only smoke test against the real Zoho CRM (npm run test:zoho-live).
 * Uses the credentials in .env.local; never writes to the CRM.
 */
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname) },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.live.ts'],
    env: loadEnv('development', process.cwd(), ''),
    testTimeout: 60_000,
  },
});
