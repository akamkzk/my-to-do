import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detect if deploying to GitHub Pages
const repoName = 'my-to-do'

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [react()],
})
