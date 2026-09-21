import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || '/floresia-app/',
    server: { watch: { ignored: ['**/.tmp/**', '**/coverage/**'] } },
  }
})