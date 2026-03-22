import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE được set trong workflow tương ứng
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  plugins: [react()],
  base,
})
