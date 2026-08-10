import { Check, Circle } from 'lucide-react';

import { getPasswordPolicyState } from '@/utils/passwordPolicy';

export default function PasswordPolicyChecklist({ password }) {
  const policy = getPasswordPolicyState(password);
  const items = [
    ['영문 8자 이상', policy.hasEightLetters],
    ['숫자 1자 이상', policy.hasNumber],
    ['특수문자 1자 이상', policy.hasSpecialCharacter],
  ];

  return (
    <div
      className="mt-3 flex flex-nowrap items-center gap-4 overflow-x-auto pb-1"
      aria-label="비밀번호 조건"
    >
      {items.map(([label, isValid]) => {
        const Icon = isValid ? Check : Circle;

        return (
          <span
            key={label}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap text-label font-medium transition-colors ${
              isValid ? 'text-[#169B62]' : 'text-[#9AA0AA]'
            }`}
          >
            <Icon size={14} strokeWidth={isValid ? 2.8 : 1.8} aria-hidden="true" />
            {label}
          </span>
        );
      })}
    </div>
  );
}
