import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy su Vercel: asset dalla root del dominio.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
})
