import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';
import App from './App.jsx';

const queryClient = new QueryClient({
  // (선택 사항) 기본 옵션 설정 예시
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 비활성화
      staleTime: 1000 * 60 * 5, // 5분 동안 "신선한" 데이터로 간주
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
