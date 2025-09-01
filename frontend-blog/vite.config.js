import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // mantén este plugin

export default defineConfig({
  base: '/BlogTheChollos/',
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // <-- Cambia al puerto donde corre backend
    },
    // Habilitar fallback para SPA, para evitar 404 en reload
    historyApiFallback: true
  }
})
