import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

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
  }), viteTsconfigPaths()],
  server: {    
    open: true,
    port: 3000,
  },
})