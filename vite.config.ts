/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// TODO: Move to @vitejs/plugin-react-swc?

export default defineConfig({
  base: '/',
  define: {
    global: 'globalThis',
  },
  plugins: [react({
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: ['@emotion/babel-plugin'],
    },
  })],
  resolve: {
    tsconfigPaths: true,
    dedupe: ["@emotion/react", "@emotion/styled"]
  },
  server: {
    open: true,
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})