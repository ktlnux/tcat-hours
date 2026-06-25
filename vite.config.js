import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/tcat-hours/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
