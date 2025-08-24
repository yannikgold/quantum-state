import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ssllabs': {
        target: 'https://api.ssllabs.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ssllabs/, ''),
        headers: {
          'Accept': 'application/json',
        }
      }
    }
  }
})
