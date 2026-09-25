import { defineConfig } from 'vite'   // ← THIS LINE WAS MISSING!
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',  // ✅ Your local Spring Boot port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})