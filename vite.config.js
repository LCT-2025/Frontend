import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // слушать все интерфейсы (важно для доступа по IP)
    allowedHosts: true, // разрешённый домен ngrok
  },
})

