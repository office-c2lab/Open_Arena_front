import { Globe2, LogOut, Search } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import ArenaLogo from '@/assets/icons/Arena.svg';
import ArenaTextLogo from '@/assets/icons/ArenaText.svg';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { label: '대시보드', path: '/dashboard', match: ['/dashboard'] },
  { label: '챌린지', path: '/kategorie', match: ['/kategorie', '/challenge'] },
  { label: '튜토리얼', path: '/tutorial', match: ['/tutorial'] },
  { label: '랭킹', path: '/leaderboard', match: ['/leaderboard'] },
];

export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthStore();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
      navigate('/login');
      return;
    }

    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-t-2 border-[#202124] border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-full max-w-[1840px] items-center px-6 lg:px-12">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 no-underline">
          <img src={ArenaLogo} alt="" className="h-10 w-10" aria-hidden="true" />
          <img src={ArenaTextLogo} alt="ARENA" className="h-[24px] w-auto" />
        </Link>

        <nav className="ml-10 hidden items-center gap-7 md:flex">
          {navItems.map(item => {
            const isActive = item.match.some(path => location.pathname.startsWith(path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`text-[15px] font-500 leading-none transition-colors ${
                  isActive ? 'text-[#FF4854]' : 'text-[#7B8190] hover:text-[#252525]'
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <button
            type="button"
            aria-label="검색"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#9AA0A6] transition hover:bg-[#F4F6FA] hover:text-[#252525] sm:flex"
          >
            <Search className="h-6 w-6" strokeWidth={2.2} />
          </button>

          <button
            type="button"
            aria-label="언어"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#9AA0A6] transition hover:bg-[#F4F6FA] hover:text-[#252525] sm:flex"
          >
            <Globe2 className="h-6 w-6" strokeWidth={2.1} />
          </button>

          <button
            type="button"
            onClick={handleAuthClick}
            className={`inline-flex h-10 items-center justify-center rounded-[4px] px-5 text-sm font-700 transition ${
              isLoggedIn
                ? 'gap-2 border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#FF4854] hover:text-[#FF4854]'
                : 'bg-[#6478F6] text-white hover:bg-[#5669E8]'
            }`}
          >
            {isLoggedIn ? (
              <>
                <LogOut className="h-4 w-4" />
                로그아웃
              </>
            ) : (
              '로그인'
            )}
          </button>

          <div className="hidden h-4 w-px bg-[#D7DBE2] lg:block" />

          <Link
            to="/admin/login"
            className="hidden text-[15px] font-700 text-[#9AA0A6] transition hover:text-[#252525] lg:inline"
          >
            관리자
          </Link>
        </div>
      </div>
    </header>
  );
}
