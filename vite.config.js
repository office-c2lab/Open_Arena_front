import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const buildTimestamp = new Date().getTime(); // 💡 현재 시간으로 해시 강제 변경

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve('./src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 💡 매 빌드마다 새로운 파일명 생성
        entryFileNames: `assets/[name]-${buildTimestamp}.js`,
        chunkFileNames: `assets/[name]-${buildTimestamp}.js`,
        assetFileNames: `assets/[name]-${buildTimestamp}.[ext]`,
      },
    },
  },
});
