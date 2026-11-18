import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Il repository è GiuseppePuleri/ccoob.github.io: Pages pubblica sotto questo prefisso.
export default defineConfig({
  base: '/ccoob.github.io/',
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
