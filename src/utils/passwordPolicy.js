export const getPasswordPolicyState = password => {
  const englishLetterCount = password.match(/[A-Za-z]/g)?.length || 0;

  return {
    hasEightLetters: englishLetterCount >= 8,
    hasNumber: /\d/.test(password),
    hasSpecialCharacter: /[^A-Za-z0-9\s]/u.test(password),
    withinMaxLength: password.length <= 128,
  };
};

export const isPasswordValid = password =>
  Object.values(getPasswordPolicyState(password)).every(Boolean);

export const PASSWORD_POLICY_MESSAGE =
  '비밀번호는 영문 8자 이상, 숫자 1자 이상, 특수문자 1자 이상을 포함해야 합니다.';
