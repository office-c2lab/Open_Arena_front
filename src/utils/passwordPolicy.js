export const getPasswordPolicyState = password => {
  return {
    hasValidLength: password.length >= 8 && password.length <= 128,
    hasLetter: /[A-Za-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialCharacter: /[^A-Za-z0-9\s]/u.test(password),
  };
};

export const isPasswordValid = password =>
  Object.values(getPasswordPolicyState(password)).every(Boolean);

export const PASSWORD_POLICY_MESSAGE =
  '비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다.';
