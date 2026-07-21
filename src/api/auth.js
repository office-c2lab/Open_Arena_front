// src/api/auth.js
// 임시 프론트 인증: 실제 인증 API가 연결되면 이 목업을 교체합니다.
export const MOCK_MEMBERSHIP = Object.freeze({
  '1111': { type: 'free', label: '무료 회원', nickname: '1번회원입니다잉' },
  '2222': { type: 'paid', label: '유료 회원', nickname: '2번회원' },
});

export const login = async credentials => {
  const loginId = credentials?.login_id?.trim() || credentials?.username?.trim();
  const membership = MOCK_MEMBERSHIP[credentials?.password];

  if (!loginId || !membership) {
    throw new Error('Invalid mock credentials');
  }

  return {
    id: `local-${membership.type}-${loginId}`,
    login_id: loginId,
    username: membership.nickname,
    teamname: membership.nickname,
    membershipType: membership.type,
    membershipLabel: membership.label,
  };
};

export const logoutApi = async () => ({ ok: true });

export const getMe = async () => {
  throw new Error('Backend auth is disabled.');
};

export const refreshToken = async () => {
  throw new Error('Backend auth is disabled.');
};

export const adminLogin = async payload => ({
  id: 'local-admin',
  username: payload?.username || 'local-admin',
});

export const adminLogoutApi = async () => ({ ok: true });

export const getAdminMe = async () => {
  throw new Error('Backend auth is disabled.');
};

export const adminRefreshToken = async () => {
  throw new Error('Backend auth is disabled.');
};
