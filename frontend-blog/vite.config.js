import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // mantén este plugin

export default defineConfig({
  base: '/BlogTheChollos/',
  plugins: [
    tailwindcss(),
    react()
  ]
})
