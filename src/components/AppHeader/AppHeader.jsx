import { LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import ArenaLogo from '@/assets/icons/Arena.svg';
import ArenaTextLogo from '@/assets/icons/ArenaText.svg';
import UserIcon from '@/assets/icons/user.svg';
import { logoutApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { label: '홈', path: '/dashboard', match: ['/dashboard'] },
  { label: '학습', path: '/education', match: ['/education'] },
  { label: '튜토리얼', path: '/tutorial', match: ['/tutorial'] },
  { label: '챌린지', path: '/kategorie', match: ['/kategorie', '/challenge'] },
  { label: '랭킹', path: '/leaderboard', match: ['/leaderboard'] },
];

const isNavItemActive = (item, pathname) => item.match.some(path => pathname.startsWith(path));

export default function AppHeader({ isHidden = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, teamInfo } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const displayName =
    teamInfo?.teamname || teamInfo?.username || teamInfo?.login_id || 'ARENA 유저';
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

  const handleAuthClick = async () => {
    if (isLoggedIn) {
      await logoutApi().catch(() => undefined);
      logout();
      navigate('/login');
      return;
    }

    navigate('/login');
  };

  const handleLogout = async () => {
    await logoutApi().catch(() => undefined);
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header
      aria-hidden={isHidden}
      inert={isHidden}
      className={`glass-subtle fixed inset-x-0 top-0 z-50 h-16 w-full border-x-0 border-t-0 border-b-[#ece7e1] transition-[transform,opacity] duration-300 ease-out ${
        isHidden ? 'pointer-events-none -translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
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
                className={`text-body transition ${
                  isActive
                    ? 'font-strong text-[#171717]'
                    : 'font-medium text-[#57534e] hover:text-[#171717]'
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
                <img
                  src={profileImage}
                  alt=""
                  className={hasProfileImage ? 'h-full w-full object-cover' : 'h-6 w-6'}
                  aria-hidden="true"
                />
              </button>

              {isProfileOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="프로필 메뉴 닫기"
                    className="fixed inset-0 z-[75] cursor-default"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-[calc(100%+12px)] z-[90] w-[326px] rounded-[8px] border border-[#ece7e1] bg-white p-4 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F2F4F6]">
                        {hasProfileImage ? (
                          <img
                            src={profileImage}
                            alt=""
                            className="h-full w-full object-cover"
                            aria-hidden="true"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF4854]">
                            <img src={UserIcon} alt="" className="h-6 w-6" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-card-title font-strong text-[#303030]">
                            {displayName}
                          </div>
                          <div className="shrink-0 text-label font-strong text-[#FF4854]">
                            {membershipLabel}
                          </div>
                        </div>
                        <div className="truncate text-body font-medium text-[#76787a]">
                          {displayEmail}
                        </div>
                      </div>
                    </div>

                    <Link to="/settings" className="btn btn-primary btn-md btn-block mt-4">
                      계정 설정
                    </Link>

                    {isPaidMember ? (
                      <>
                        <div className="mt-4 rounded-[4px] border border-[#e7e8eb] px-4 py-3 text-center text-body font-medium text-[#76787a]">
                          성공한 챌린지{' '}
                          <span className="font-strong text-[#1ec186]">
                            {profileStats.solvedChallenges || 0} 개
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-body font-medium text-[#76787a]">
                            랭킹{' '}
                            <span className="font-strong text-[#FFB155]">
                              {profileStats.rank || '-'} 위
                            </span>
                          </div>
                          <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-body font-medium text-[#76787a]">
                            총 포인트{' '}
                            <span className="font-strong text-[#A8AAFF]">
                              {profileStats.totalPoints ?? 188}점
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-4 rounded-[4px] border border-[#e7e8eb] px-4 py-3 text-center text-body font-medium text-[#76787a]">
                          무료 도전 횟수 <span className="font-strong text-[#1ec186]">1 / 6</span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-body font-medium text-[#76787a]">
                            무료 제출 <span className="font-strong text-[#A8AAFF]">2/10</span>
                          </div>
                          <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-body font-medium text-[#76787a]">
                            무료 토큰 <span className="font-strong text-[#FFB155]">1000</span>
                          </div>
                        </div>
                      </>
                    )}

                    <nav
                      className="mt-4 border-t border-[#ece7e1] pt-3"
                      aria-label="프로필 정책 링크"
                    >
                      <Link
                        to="/terms"
                        className="flex rounded-[4px] px-2 py-2 text-body font-medium text-[#76787a] transition hover:bg-[#F7F8F8] hover:text-[#303030]"
                      >
                        이용약관
                      </Link>
                      <Link
                        to="/privacy"
                        className="flex rounded-[4px] px-2 py-2 text-body font-medium text-[#76787a] transition hover:bg-[#F7F8F8] hover:text-[#303030]"
                      >
                        개인정보 수집 및 이용
                      </Link>
                    </nav>

                    <div className="mt-2 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex cursor-pointer items-center gap-3 rounded-[4px] px-2 py-2 text-left text-body font-medium text-[#76787a] transition hover:bg-[#F7F8F8] hover:text-[#303030]"
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
            <button type="button" onClick={handleAuthClick} className="btn btn-primary btn-md">
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

          <aside className="glass-overlay relative flex h-full w-[min(20rem,calc(100vw-3rem))] flex-col rounded-none border-y-0 border-l-0 border-r-[#ece7e1]">
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
                    className={`rounded-xl px-4 py-3 text-body-lg ${
                      isActive
                        ? 'bg-[#fff1f2] font-strong text-[#FF4854]'
                        : 'font-medium text-[#57534e] hover:bg-white hover:text-[#171717]'
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
                className="block rounded-xl px-4 py-3 text-body-lg font-strong text-[#FF4854] hover:bg-white hover:text-[#e63d48]"
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
