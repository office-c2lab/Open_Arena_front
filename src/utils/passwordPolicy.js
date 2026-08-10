export const getPasswordPolicyState = password => {
  return {
    hasValidLength: password.length >= 8 && password.length <= 128,
    hasLetter: /[A-Za-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialCharacter: /[^A-Za-z0-9\s]/u.test(password),
    usesAllowedCharacters: [...password].every(character => {
      const characterCode = character.charCodeAt(0);
      return characterCode >= 33 && characterCode <= 126;
    }),
  };
};

export const isPasswordValid = password =>
  Object.values(getPasswordPolicyState(password)).every(Boolean);

export const PASSWORD_POLICY_MESSAGE =
  '비밀번호는 한글과 공백 없이 영문 키보드 문자만 사용하고, 8자 이상의 숫자와 특수문자를 포함해야 합니다.';

export const sanitizePassword = password =>
  [...password]
    .filter(character => {
      const characterCode = character.charCodeAt(0);
      return characterCode >= 33 && characterCode <= 126;
    })
    .join('');
