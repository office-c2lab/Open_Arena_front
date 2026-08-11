import { CalendarDays } from 'lucide-react';
import UserIcon from '@/assets/icons/user.svg';
import HomeMyBgImage from '@/assets/images/homemybg.png';
import { useAuthStore } from '@/stores/authStore';

const defaultDashboardSummaryStats = [
  { label: '현재 순위', value: '24위', subText: '전체 참가자 기준' },
  { label: '해결한 문제', value: '2문제', subText: '전체 6문제 중' },
  { label: '보유 포인트', value: '188점', subText: '이번 주 기준' },
  { label: '다음 순위까지', value: '12점', subText: '23위 추월까지' },
];

export default function DashboardProfileSummaryCard({ profile, summaryStats, showEmail = true }) {
  const authenticatedTeamInfo = useAuthStore(state => state.teamInfo);
  const teamInfo = profile || authenticatedTeamInfo;
  const displayName =
    teamInfo?.teamname || teamInfo?.username || teamInfo?.nickname || 'ARENA 유저';
  const displayEmail = teamInfo?.login_id || teamInfo?.email || 'arena@example.com';
  const membershipType =
    teamInfo?.membershipType ||
    teamInfo?.membership ||
    teamInfo?.plan ||
    teamInfo?.member_type ||
    teamInfo?.subscription_type;
  const membershipLabel =
    teamInfo?.membershipLabel ||
    teamInfo?.membership_label ||
    (['paid', 'premium', 'pro', '유료'].includes(String(membershipType).toLowerCase())
      ? '유료 회원'
      : '무료 회원');
  const joinedAtValue =
    teamInfo?.created_at || teamInfo?.createdAt || teamInfo?.joined_at || teamInfo?.joinedAt;
  const joinedAt = joinedAtValue
    ? String(joinedAtValue).slice(0, 10).replaceAll('-', '.')
    : '2026.07.01';
  const savedProfileImage =
    teamInfo?.profileImage || teamInfo?.profile_image || teamInfo?.profile_image_url;
  const profileImage = savedProfileImage || UserIcon;
  const hasProfileImage = Boolean(savedProfileImage);
  const profileMessage = (teamInfo?.profileMessage || teamInfo?.profile_message)?.trim();
  const profileBackgroundImage =
    teamInfo?.profileBackgroundImage ||
    teamInfo?.profile_background_image ||
    teamInfo?.profile_background_url ||
    HomeMyBgImage;
  const profileTextTheme =
    teamInfo?.profileTextTheme || teamInfo?.profile_text_theme || teamInfo?.theme;
  const usesWhiteProfileText = profileTextTheme === 'white';
  const displayedSummaryStats = summaryStats || defaultDashboardSummaryStats;

  return (
    <section
      className="relative isolate flex min-h-[286px] w-full flex-col justify-between overflow-hidden rounded-[10px] border border-[#E3E8EF] bg-[#FFF8F9] px-5 py-4 shadow-[0_4px_18px_rgba(18,24,40,0.06)] sm:px-6 lg:flex-1"
      style={{
        backgroundImage: `url(${profileBackgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="relative z-10 max-w-[390px]">
        <div className="mt-5 flex items-center gap-4">
          <div
            className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_5px_14px_rgba(15,23,42,0.12)] ${
              hasProfileImage ? 'bg-[#F2F4F6]' : 'bg-[#FF4854]'
            }`}
          >
            <img
              src={profileImage}
              alt=""
              className={hasProfileImage ? 'h-full w-full object-cover' : 'h-12 w-12'}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2
                className={`truncate text-page-title font-bold ${
                  usesWhiteProfileText ? 'text-white' : 'text-[#202832]'
                }`}
              >
                {displayName}
              </h2>
              <span className="shrink-0 rounded-full bg-[#FF4854] px-2.5 py-1 text-caption font-bold text-white">
                {membershipLabel}
              </span>
            </div>
            {showEmail ? (
              <p
                className={`mt-2 truncate text-body font-strong ${
                  usesWhiteProfileText ? 'text-white/80' : 'text-[#7B8491]'
                }`}
              >
                {displayEmail}
              </p>
            ) : null}
            <p
              className={`mt-1.5 flex items-center gap-1.5 text-label font-strong ${
                usesWhiteProfileText ? 'text-white/80' : 'text-[#7B8491]'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              가입일 {joinedAt}
            </p>
          </div>
        </div>

        <p
          className={`mt-6 whitespace-pre-wrap break-words text-body-lg font-bold leading-7 ${
            usesWhiteProfileText ? 'text-white/90' : 'text-[#7B8491]'
          }`}
        >
          {profileMessage || (
            <>
              꾸준함이 경험이 됩니다.
              <br />
              지금의 흐름을 유지해보세요!
            </>
          )}
        </p>
      </div>

      <div className="relative z-10 mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {displayedSummaryStats.map(stat => (
          <DashboardProfileStatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}

function DashboardProfileStatCard({ stat }) {
  return (
    <div className="min-h-[104px] rounded-[8px] border border-white/95 bg-white/90 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_26px_rgba(15,23,42,0.10)] backdrop-blur-md">
      <p className="text-label font-bold text-[#3D4754]">{stat.label}</p>
      <strong className="mt-4 block text-section-title font-bold text-[#111827]">
        {stat.value}
      </strong>
      <p className="mt-2 truncate text-caption font-bold text-[#596575]">{stat.subText}</p>
    </div>
  );
}
