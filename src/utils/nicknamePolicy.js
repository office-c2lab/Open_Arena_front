export const NICKNAME_POLICY_MESSAGE =
  '닉네임은 한글, 영문, 숫자, 밑줄만 사용해 2~8자로 입력해 주세요.';

// 한글 입력기 조합 중에는 완성형 글자 대신 자모가 잠시 전달될 수 있다.
// 자모를 입력 단계에서 제거하지 않고, 완성된 값은 NFC로 정규화한다.
export const sanitizeNickname = value =>
  value
    .normalize('NFC')
    .replace(/[^\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7A3\uD7B0-\uD7FFA-Za-z0-9_]/g, '')
    .slice(0, 8);

export const isNicknameValid = value => /^[가-힣A-Za-z0-9_]{2,8}$/.test(value.normalize('NFC'));
