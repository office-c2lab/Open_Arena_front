import AppRouter from './routes/AppRouter';
import AppInitializer from './AppInitializer';
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const resetScroll = () => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = 'auto';
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.querySelectorAll('[data-route-scroll-container]').forEach(element => {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      });

      root.style.scrollBehavior = previousScrollBehavior;
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="relative w-screen h-screen bg-white">
      <ScrollToTopOnRouteChange />
      <AppInitializer>
        <AppRouter />
      </AppInitializer>
    </div>
  );
}
