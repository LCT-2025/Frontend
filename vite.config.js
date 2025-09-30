import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
     allowedHosts: ["http://144.21.39.77", "http://144.21.39.77:8080", "xn--80adsi2a0f.xn--b1agjiduva.xn--p1ai", "эврика.великосс.рф"],
 }
})

