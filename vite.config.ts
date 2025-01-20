import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
//   部署目录为logMonitorWeb(norman.wang/logMonitorWeb/index.html)
    base: '/logMonitorWeb/',
})
