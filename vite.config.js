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
          // 배포 Nginx의 `proxy_set_header Host $host`와 동일하게 프론트 Host를 유지한다.
          // Origin은 로컬인데 Host만 백엔드 IP로 바뀌면 CSRF 검증이 실패할 수 있다.
          changeOrigin: false,
          // 백엔드가 Domain을 명시하더라도 개발 origin에 쿠키가 저장되도록 한다.
          cookieDomainRewrite: '',
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
