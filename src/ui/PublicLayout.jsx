import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from '@/components/AppHeader/AppHeader';
import FooterSection from '@/pages/LandingPage/FooterSection';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isLandingPage = pathname === '/';
  const shouldShowFooter = !isLandingPage;
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!isLandingPage) {
      setHasScrolled(false);
      return undefined;
    }

    const updateHeaderVisibility = event => {
      const eventTargetScrollTop = event?.target instanceof Element ? event.target.scrollTop : 0;
      const scrollTop = Math.max(
        window.scrollY,
        document.scrollingElement?.scrollTop ?? 0,
        document.documentElement.scrollTop,
        document.body.scrollTop,
        eventTargetScrollTop
      );

      setHasScrolled(scrollTop > 0);
    };

    updateHeaderVisibility();
    window.addEventListener('scroll', updateHeaderVisibility, { passive: true });
    document.addEventListener('scroll', updateHeaderVisibility, { capture: true, passive: true });

    return () => {
      window.removeEventListener('scroll', updateHeaderVisibility);
      document.removeEventListener('scroll', updateHeaderVisibility, { capture: true });
    };
  }, [isLandingPage]);

  return (
    <div
      data-route-scroll-container
      className={`flex min-h-screen w-full flex-col overflow-x-hidden bg-white ${isLandingPage ? '' : 'pt-16'}`}
    >
      <AppHeader isHidden={isLandingPage && !hasScrolled} />
      <main className="flex-1">
        <Outlet />
      </main>
      {shouldShowFooter ? <FooterSection /> : null}
    </div>
  );
}
