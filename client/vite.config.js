import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const rawBasePath = process.env.VITE_BASE_PATH || "/";
const normalizedBasePath = `/${rawBasePath.replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");

export default defineConfig({
  plugins: [react()],
  base: normalizedBasePath,
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})