import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/


export default defineConfig({
  plugins: [react()],
  base: '/ogrenci-nobetv3/', // GitHub'daki repository adını tam olarak buraya yaz (Örn: /benim-uygulamam/)
})