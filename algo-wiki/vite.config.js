import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 정적 배포(상대 경로) + file:// 호환을 위해 base를 './'로 둔다.
export default defineConfig({
  base: './',
  plugins: [react()],
})
