import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',   // Relative base for any mount location (/parentsaccess, /parent, or root)
  plugins: [react(), tailwindcss()],
  appType: 'spa', // Serves index.html for all 404 routes so BrowserRouter works on page refresh
})
