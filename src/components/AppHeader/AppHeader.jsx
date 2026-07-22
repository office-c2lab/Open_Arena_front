import { LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import ArenaLogo from '@/assets/icons/Arena.svg';
import ArenaTextLogo from '@/assets/icons/ArenaText.svg';
import UserIcon from '@/assets/icons/user.svg';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { label: '홈', path: '/dashboard', match: ['/dashboard'] },
  { label: '학습', path: '/education', match: ['/education'] },
  { label: '튜토리얼', path: '/tutorial', match: ['/tutorial'] },
  { label: '챌린지', path: '/kategorie', match: ['/kategorie', '/challenge'] },
  { label: '랭킹', path: '/leaderboard', match: ['/leaderboard'] },
];

const isNavItemActive = (item, pathname) =>
  item.match.some(path => pathname.startsWith(path));

export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, teamInfo } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const displayName = teamInfo?.teamname || teamInfo?.username || teamInfo?.login_id || 'ARENA 유저';
  const displayEmail = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const membershipLabel = teamInfo?.membershipLabel || '무료 회원';
  const isPaidMember = teamInfo?.membershipType === 'paid';
  const profileStats = teamInfo?.profileStats || {};
  const profileImage = teamInfo?.profileImage || UserIcon;
  const hasProfileImage = Boolean(teamInfo?.profileImage);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
      navigate('/login');
      return;
    }

    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 w-full border-b border-[#ece7e1] bg-[rgba(255,255,255,0.88)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,255,255,0.78)]">
      <div className="flex h-full w-full items-center px-4 sm:px-12">
        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
          className="mr-4 flex h-8 w-8 items-center justify-center rounded-full text-[#57534e] transition hover:bg-white hover:text-[#171717] min-[1080px]:hidden"
        >
          <Menu className="h-6 w-6" strokeWidth={2.2} />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2.5 no-underline">
          <img src={ArenaLogo} alt="" className="h-10 w-10" aria-hidden="true" />
          <img src={ArenaTextLogo} alt="ARENA" className="h-[24px] w-auto" />
        </Link>

        <nav className="ml-10 hidden items-center gap-6 min-[1080px]:flex">
          {navItems.map(item => {
            const isActive = isNavItemActive(item, location.pathname);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`text-sm transition ${
                  isActive
                    ? 'font-700 text-[#171717]'
                    : 'font-500 text-[#57534e] hover:text-[#171717]'
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          {isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                aria-label="프로필 메뉴"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen(current => !current)}
                className={`flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full shadow-[0_3px_10px_rgba(255,72,84,0.18)] transition hover:-translate-y-0.5 ${hasProfileImage ? 'bg-[#F2F4F6]' : 'bg-[#FF4854] hover:bg-[#FF4854]/90'}`}
              >
                <img src={profileImage} alt="" className={hasProfileImage ? 'h-full w-full object-cover' : 'h-6 w-6'} aria-hidden="true" />
              </button>

              {isProfileOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="프로필 메뉴 닫기"
                    className="fixed inset-0 z-[75] cursor-default"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-[calc(100%+12px)] z-[90] w-[326px] rounded-[3px] border border-[#ece7e1] bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F2F4F6]">
                        {hasProfileImage ? (
                          <img src={profileImage} alt="" className="h-full w-full object-cover" aria-hidden="true" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF4854]">
                            <img src={UserIcon} alt="" className="h-6 w-6" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-lg font-700 text-[#303030]">{displayName}</div>
                          <div className="shrink-0 text-xs font-700 text-[#FF4854]">{membershipLabel}</div>
                        </div>
                        <div className="truncate text-sm font-500 text-[#76787a]">{displayEmail}</div>
                      </div>
                    </div>

                    <Link
                      to="/settings"
                      className="mt-4 flex h-10 w-full items-center justify-center rounded-[4px] bg-[#FF4854] text-sm font-700 text-white shadow-[0_3px_8px_rgba(255,72,84,0.16)] transition hover:-translate-y-0.5 hover:bg-[#FF4854]/90"
                    >
                      계정 설정
                    </Link>

                    {isPaidMember ? (
                      <>
                        <div className="mt-4 rounded-[4px] border border-[#e7e8eb] px-4 py-3 text-center text-sm font-500 text-[#76787a]">
                          성공한 챌린지{' '}
                          <span className="font-700 text-[#1ec186]">{profileStats.solvedChallenges || 0} 개</span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-sm font-500 text-[#76787a]">
                            총 성공 갯수{' '}
                            <span className="font-700 text-[#A8AAFF]">{profileStats.totalSuccesses || 0} 개</span>
                          </div>
                          <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-sm font-500 text-[#76787a]">
                            랭킹 <span className="font-700 text-[#FFB155]">{profileStats.rank || '-'} 위</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-4 rounded-[4px] border border-[#e7e8eb] px-4 py-3 text-center text-sm font-500 text-[#76787a]">
                          무료 도전 횟수 <span className="font-700 text-[#1ec186]">1 / 6</span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-sm font-500 text-[#76787a]">
                            무료 제출 <span className="font-700 text-[#A8AAFF]">2/10</span>
                          </div>
                          <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-sm font-500 text-[#76787a]">
                            무료 토큰 <span className="font-700 text-[#FFB155]">1000</span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="mt-4 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex cursor-pointer items-center gap-3 rounded-[4px] px-2 py-2 text-left text-sm font-500 text-[#76787a] transition hover:bg-[#F7F8F8] hover:text-[#303030]"
                      >
                        <LogOut className="h-5 w-5 text-[#AAACB0]" />
                        로그아웃
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAuthClick}
              className="group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[16px] bg-[#FF4854] px-5 text-sm font-700 text-white shadow-[0_3px_8px_rgba(255,72,84,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)] focus:outline-none focus-visible:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#FF4854] focus-visible:ring-offset-2"
            >
              로그인
            </button>
          )}

        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-[80] min-[1080px]:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            className="absolute inset-0 bg-black/35"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <aside className="relative flex h-full w-[min(20rem,calc(100vw-3rem))] flex-col border-r border-[#ece7e1] bg-[rgba(255,255,255,0.96)] shadow-2xl backdrop-blur">
            <div className="flex h-16 items-center justify-between border-b border-[#ece7e1] px-5">
              <Link to="/" className="flex items-center gap-2.5 no-underline">
                <img src={ArenaLogo} alt="" className="h-10 w-10" aria-hidden="true" />
                <img src={ArenaTextLogo} alt="ARENA" className="h-[24px] w-auto" />
              </Link>

              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#57534e] transition hover:bg-white hover:text-[#171717]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col px-3 py-4">
              {navItems.map(item => {
                const isActive = isNavItemActive(item, location.pathname);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`rounded-xl px-4 py-3 text-base ${
                      isActive
                        ? 'bg-[#fff1f2] font-700 text-[#FF4854]'
                        : 'font-500 text-[#57534e] hover:bg-white hover:text-[#171717]'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-[#ece7e1] p-4">
              <Link
                to="/kategorie"
                className="block rounded-xl px-4 py-3 text-base font-700 text-[#FF4854] hover:bg-white hover:text-[#e63d48]"
              >
                대회 살펴보기
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
