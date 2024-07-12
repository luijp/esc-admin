import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    proxy:{
      '/api': {
        target: 'http://localhost:10086', // 代理目标地址
        changeOrigin: true,
      },
    }
  }
})
