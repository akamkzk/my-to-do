import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/my-to-do/', // GitHub Pages 仓库名（全小写）
  plugins: [react()],
})
