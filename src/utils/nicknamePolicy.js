export const NICKNAME_POLICY_MESSAGE =
  '닉네임은 한글, 영문, 숫자, 밑줄만 사용해 2~8자로 입력해 주세요.';

export const sanitizeNickname = value => value.replace(/[^가-힣A-Za-z0-9_]/g, '').slice(0, 8);

export const isNicknameValid = value => /^[가-힣A-Za-z0-9_]{2,8}$/.test(value);
