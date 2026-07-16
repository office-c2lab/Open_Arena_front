import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/AppHeader/AppHeader';
import FooterSection from '@/pages/LandingPage/FooterSection';

export default function PublicLayout() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white pt-16">
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
}
