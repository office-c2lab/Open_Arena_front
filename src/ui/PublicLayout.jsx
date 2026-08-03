import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from '@/components/AppHeader/AppHeader';
import FooterSection from '@/pages/LandingPage/FooterSection';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const shouldShowFooter = pathname !== '/';

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white pt-16">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      {shouldShowFooter ? <FooterSection /> : null}
    </div>
  );
}
