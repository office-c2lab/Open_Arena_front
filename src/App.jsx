import Sidebar from './components/Sidebar/Sidebar';
import AppRouter from './routes/AppRouter';
import AppInitializer from './AppInitializer'; // ← 이거 추가!
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { preloadAppImages } from '@/utils/preloadAppImages';

export default function App() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;
    preloadAppImages();
  }, [isLoggedIn]);

  return (
    <div className="relative w-screen h-screen bg-gray-100">
      <AppInitializer>
        {/* <Sidebar /> */}
        <AppRouter />
      </AppInitializer>
    </div>
  );
}
