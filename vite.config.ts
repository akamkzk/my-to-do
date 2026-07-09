import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/My-To-Do/', // GitHub Pages 仓库名路径
  plugins: [react()],
})
