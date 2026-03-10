import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/QR-pro-/',   // IMPORTANT for GitHub Pages
  plugins: [react()]
})
