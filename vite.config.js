import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import process from 'node:process';

const buildTimestamp = new Date().getTime(); // 💡 현재 시간으로 해시 강제 변경

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@': path.resolve('./src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://3.34.62.133',
          changeOrigin: true,
        },
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
  };
});
