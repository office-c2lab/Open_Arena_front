import AppRouter from './routes/AppRouter';
import AppInitializer from './AppInitializer'; // ← 이거 추가!
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTopOnDetailRoute() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const shouldResetScroll = /^\/(tutorial|education)\/[^/]+/.test(pathname);
    if (!shouldResetScroll) return undefined;

    const resetScroll = () => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      document.scrollingElement?.scrollTo?.(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.getElementById('root')?.scrollTo?.(0, 0);
      document
        .querySelectorAll('main, [class*="overflow-auto"], [class*="overflow-y-auto"]')
        .forEach(element => {
          element.scrollTop = 0;
          element.scrollLeft = 0;
        });

      root.style.scrollBehavior = previousScrollBehavior;
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);
    const timeoutIds = [
      window.setTimeout(resetScroll, 0),
      window.setTimeout(resetScroll, 50),
      window.setTimeout(resetScroll, 150),
    ];

    return () => {
      window.cancelAnimationFrame(frameId);
      timeoutIds.forEach(timeoutId => window.clearTimeout(timeoutId));
    };
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="relative w-screen h-screen bg-white">
      <ScrollToTopOnDetailRoute />
      <AppInitializer>
        <AppRouter />
      </AppInitializer>
    </div>
  );
}
