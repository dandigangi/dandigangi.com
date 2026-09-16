import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

/**
 * Only the local post editor and the frontmatter it writes are covered here.
 * The site itself is exercised by `yarn smoke` against a real build, which
 * catches the kind of breakage that matters there; these tests exist because
 * the editor can overwrite published posts and no HTTP check would notice.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(import.meta.dirname, '.') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['{app,lib,components}/**/*.test.{ts,tsx}'],
  },
})
