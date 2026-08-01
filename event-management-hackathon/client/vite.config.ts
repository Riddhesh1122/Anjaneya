import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  build: {
    outDir: path.resolve(__dirname, '../public'),
    emptyOutDir: false,
    sourcemap: false,
  },
  server: {
    port: 5173,
  },
})
