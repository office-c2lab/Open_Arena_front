import { Bell, ChevronLeft, LogOut, Menu, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import ArenaLogo from '@/assets/icons/Arena.svg';
import ArenaTextLogo from '@/assets/icons/ArenaText.svg';
import UserIcon from '@/assets/icons/user.svg';
import { getChallengeStats, getTodayUsage } from '@/api/accountApi';
import { getMe, logoutApi } from '@/api/auth';
import { getPublicNotice, getPublicNotices } from '@/api/noticesApi';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { label: '홈', path: '/dashboard', match: ['/dashboard'] },
  { label: '학습', path: '/education', match: ['/education'] },
  { label: '튜토리얼', path: '/tutorial', match: ['/tutorial'] },
  { label: '챌린지', path: '/kategorie', match: ['/kategorie', '/challenge'] },
  { label: '랭킹', path: '/leaderboard', match: ['/leaderboard'] },
];

const isNavItemActive = (item, pathname) => item.match.some(path => pathname.startsWith(path));
const formatNumber = value => Number(value ?? 0).toLocaleString('ko-KR');

const getUsageText = metric =>
  metric ? `${formatNumber(metric.used)} / ${formatNumber(metric.base_limit)}` : '-';
const formatNotificationTime = value => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function AppHeader({ isHidden = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, login, logout, teamInfo } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  const accountMeQuery = useQuery({
    queryKey: ['account', 'me'],
    queryFn: getMe,
    enabled: false,
    staleTime: 0,
  });
  const profileInfo = accountMeQuery.data ?? teamInfo;
  const displayName =
    profileInfo?.teamname || profileInfo?.username || profileInfo?.login_id || 'ARENA 유저';
  const displayEmail = profileInfo?.login_id || profileInfo?.email || 'arena@example.com';
  const membershipLabel = profileInfo?.membershipLabel || '무료 회원';
  const membership = String(
    profileInfo?.membershipType || profileInfo?.membership || ''
  ).toLowerCase();
  const isPaidMember = ['paid', 'premium', 'pro', '유료'].includes(membership);
  const profileImage = profileInfo?.profileImage || UserIcon;
  const hasProfileImage = Boolean(profileInfo?.profileImage);
  const noticesQuery = useQuery({
    queryKey: ['publicNotices', { offset: 0, limit: 100 }],
    queryFn: () => getPublicNotices({ offset: 0, limit: 100 }),
    enabled: isLoggedIn,
    staleTime: 60_000,
  });
  const noticeDetailQuery = useQuery({
    queryKey: ['publicNotice', selectedNoticeId],
    queryFn: () => getPublicNotice(selectedNoticeId),
    enabled: isLoggedIn && Boolean(selectedNoticeId),
    staleTime: 60_000,
  });
  const challengeStatsQuery = useQuery({
    queryKey: ['account', 'challenge-stats'],
    queryFn: getChallengeStats,
    enabled: false,
    staleTime: 0,
  });
  const todayUsageQuery = useQuery({
    queryKey: ['account', 'usage', 'today'],
    queryFn: getTodayUsage,
    enabled: false,
    staleTime: 0,
  });
  const challengeStats = challengeStatsQuery.data;
  const todayUsage = todayUsageQuery.data;
  const problemUnlockUsage = getUsageText(todayUsage?.problem_unlocks);
  const submissionUsage = getUsageText(todayUsage?.submissions);
  const tokenUsage = getUsageText(todayUsage?.tokens);
  const notifications = noticesQuery.data?.items ?? [];

  useEffect(() => {
    if (accountMeQuery.data) login(accountMeQuery.data);
  }, [accountMeQuery.data, login]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsNotificationOpen(false);
    setSelectedNoticeId(null);
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
    setIsNotificationOpen(false);
    navigate('/login');
  };

  const handleNotificationToggle = () => {
    setIsProfileOpen(false);
    setIsNotificationOpen(current => {
      if (current) setSelectedNoticeId(null);
      return !current;
    });
  };

  const handleProfileToggle = async () => {
    setIsNotificationOpen(false);
    if (isProfileOpen) {
      setIsProfileOpen(false);
      return;
    }

    setIsProfileOpen(true);
    const accountResult = await accountMeQuery.refetch();
    const latestProfile = accountResult.data ?? profileInfo;
    const latestMembership = String(
      latestProfile?.membershipType || latestProfile?.membership || ''
    ).toLowerCase();
    const isLatestPaidMember = ['paid', 'premium', 'pro', '유료'].includes(latestMembership);

    if (isLatestPaidMember) await challengeStatsQuery.refetch();
    else await todayUsageQuery.refetch();
  };

  const openNotification = notificationId => {
    setSelectedNoticeId(notificationId);
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
            <>
              <div className="relative">
                <button
                  type="button"
                  aria-label="알림"
                  aria-expanded={isNotificationOpen}
                  onClick={handleNotificationToggle}
                  className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#FF4854] text-white shadow-[0_3px_10px_rgba(255,72,84,0.18)] transition hover:-translate-y-0.5 hover:bg-[#FF4854]/90"
                >
                  <Bell className="h-6 w-6" strokeWidth={2} />
                </button>

                {isNotificationOpen ? (
                  <>
                    <button
                      type="button"
                      aria-label="알림 창 닫기"
                      className="fixed inset-0 z-[75] cursor-default"
                      onClick={() => {
                        setIsNotificationOpen(false);
                        setSelectedNoticeId(null);
                      }}
                    />
                    <section
                      className="absolute right-0 top-[calc(100%+12px)] z-[90] w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-[10px] border border-[#E3E6EB] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.16)]"
                      aria-label={selectedNoticeId ? '공지사항 상세' : '알림 목록'}
                    >
                      <div className="flex items-center justify-between border-b border-[#ECEFF3] px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {selectedNoticeId ? (
                            <button
                              type="button"
                              onClick={() => setSelectedNoticeId(null)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-[#697586] transition hover:bg-[#F4F6F8] hover:text-[#202832]"
                              aria-label="알림 목록으로 돌아가기"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                          ) : null}
                          <h2 className="text-card-title font-bold text-[#202832]">
                            {selectedNoticeId ? '공지사항' : '알림'}
                          </h2>
                        </div>
                      </div>

                      {selectedNoticeId ? (
                        <div className="max-h-[520px] overflow-y-auto px-5 py-5">
                          {noticeDetailQuery.isLoading ? (
                            <p className="py-12 text-center text-body font-strong text-[#9AA3AF]">
                              공지사항을 불러오는 중...
                            </p>
                          ) : noticeDetailQuery.isError ? (
                            <p className="rounded-lg bg-[#FFF0F1] px-4 py-4 text-body font-strong text-[#D83A45]">
                              {noticeDetailQuery.error.message}
                            </p>
                          ) : noticeDetailQuery.data ? (
                            <article>
                              {noticeDetailQuery.data.is_pinned ? (
                                <span className="inline-flex rounded-full bg-[#FFF0F1] px-2.5 py-1 text-caption font-bold text-[#FF4854]">
                                  중요 공지
                                </span>
                              ) : null}
                              <h3 className="mt-3 break-words text-card-title font-bold leading-7 text-[#202832]">
                                {noticeDetailQuery.data.title}
                              </h3>
                              <time className="mt-2 block text-caption font-strong text-[#9AA3AF]">
                                {formatNotificationTime(noticeDetailQuery.data.published_at)}
                              </time>
                              <div className="mt-5 border-t border-[#ECEFF3] pt-5">
                                <p className="whitespace-pre-wrap break-words text-body font-strong leading-6 text-[#596575]">
                                  {noticeDetailQuery.data.body}
                                </p>
                              </div>
                            </article>
                          ) : null}
                        </div>
                      ) : noticesQuery.isLoading ? (
                        <div className="flex min-h-[220px] items-center justify-center text-body font-strong text-[#9AA3AF]">
                          알림을 불러오는 중...
                        </div>
                      ) : noticesQuery.isError ? (
                        <div className="m-4 rounded-lg bg-[#FFF0F1] px-4 py-4 text-body font-strong text-[#D83A45]">
                          {noticesQuery.error.message}
                        </div>
                      ) : notifications.length ? (
                        <div className="max-h-[420px] overflow-y-auto" role="list">
                          {notifications.map(notification => (
                            <button
                              key={notification.id}
                              type="button"
                              role="listitem"
                              onClick={() => openNotification(notification.id)}
                              className="flex w-full cursor-pointer gap-3 border-b border-[#F0F2F5] bg-white px-4 py-4 text-left transition last:border-b-0 hover:bg-[#F8F9FA]"
                            >
                              <span className="min-w-0 flex-1">
                                <strong className="block truncate text-body font-bold text-[#303740]">
                                  {notification.is_pinned ? '[중요] ' : ''}
                                  {notification.title}
                                </strong>
                                <span className="mt-2 block text-caption font-strong text-[#9AA3AF]">
                                  {formatNotificationTime(notification.published_at)}
                                </span>
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex min-h-[220px] flex-col items-center justify-center px-6 py-10 text-center">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F6F8] text-[#A0A8B3]">
                            <Bell className="h-6 w-6" />
                          </span>
                          <p className="mt-4 text-body font-bold text-[#596575]">
                            새로운 알림이 없습니다.
                          </p>
                          <p className="mt-1.5 text-label font-strong text-[#9AA3AF]">
                            새로운 소식이 도착하면 여기에 표시됩니다.
                          </p>
                        </div>
                      )}
                    </section>
                  </>
                ) : null}
              </div>

              <div className="relative">
                <button
                  type="button"
                  aria-label="프로필 메뉴"
                  aria-expanded={isProfileOpen}
                  onClick={handleProfileToggle}
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

                      {accountMeQuery.isError ||
                      (isPaidMember ? challengeStatsQuery : todayUsageQuery).isError ? (
                        <div className="mt-4 rounded-[4px] border border-[#F2C8CC] bg-[#FFF7F8] px-4 py-3 text-center text-body font-medium text-[#D83A45]">
                          프로필 정보를 불러오지 못했습니다.
                        </div>
                      ) : isPaidMember ? (
                        <>
                          <p className="mt-4 text-label font-strong text-[#76787a]">챌린지 현황</p>
                          <div className="mt-4 rounded-[4px] border border-[#e7e8eb] px-4 py-3 text-center text-body font-medium text-[#76787a]">
                            성공한 챌린지{' '}
                            <span className="font-strong text-[#1ec186]">
                              {challengeStats
                                ? `${formatNumber(challengeStats.successful_challenges)}개`
                                : '-'}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-body font-medium text-[#76787a]">
                              랭킹{' '}
                              <span className="font-strong text-[#FFB155]">
                                {challengeStats?.rank == null
                                  ? '-'
                                  : `${formatNumber(challengeStats.rank)}위`}
                              </span>
                            </div>
                            <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-body font-medium text-[#76787a]">
                              총 성공{' '}
                              <span className="font-strong text-[#A8AAFF]">
                                {challengeStats
                                  ? `${formatNumber(challengeStats.total_successes)}회`
                                  : '-'}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mt-4 text-label font-strong text-[#76787a]">
                            오늘 무료 사용량
                          </p>
                          <div className="mt-4 rounded-[4px] border border-[#e7e8eb] px-4 py-3 text-center text-body font-medium text-[#76787a]">
                            문제 열람{' '}
                            <span className="font-strong text-[#1ec186]">{problemUnlockUsage}</span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-body font-medium text-[#76787a]">
                              답안 제출{' '}
                              <span className="font-strong text-[#A8AAFF]">{submissionUsage}</span>
                            </div>
                            <div className="rounded-[4px] border border-[#e7e8eb] px-3 py-3 text-center text-body font-medium text-[#76787a]">
                              AI 토큰{' '}
                              <span className="font-strong text-[#FFB155]">{tokenUsage}</span>
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
            </>
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
