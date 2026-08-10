import toast from 'react-hot-toast';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

const variants = {
  success: {
    Icon: CircleCheck,
    label: '완료',
    iconClass: 'bg-[#E9F9F0] text-[#169B62]',
    barClass: 'bg-[#27B579]',
  },
  error: {
    Icon: CircleAlert,
    label: '오류',
    iconClass: 'bg-[#FFF0F2] text-[#E33E52]',
    barClass: 'bg-[#FF4854]',
  },
  info: {
    Icon: Info,
    label: '안내',
    iconClass: 'bg-[#FFF4E8] text-[#E6812A]',
    barClass: 'bg-[#FF9A45]',
  },
};

export default function ArenaToast({ toastItem, variant, message }) {
  const { Icon, label, iconClass, barClass } = variants[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={`pointer-events-auto relative flex w-[calc(100vw-32px)] max-w-[430px] items-start gap-3 overflow-hidden rounded-2xl border border-[#ECEEF2] bg-white px-4 py-3.5 shadow-[0_16px_40px_rgba(34,39,52,0.16)] transition-all duration-200 ${
        toastItem.visible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${barClass}`} aria-hidden="true" />
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        aria-hidden="true"
      >
        <Icon size={20} strokeWidth={2.3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-label font-strong text-[#2D3035]">{label}</span>
        <span className="mt-0.5 block whitespace-pre-line break-words text-body font-medium leading-5 text-[#606773]">
          {message}
        </span>
      </span>
      <button
        type="button"
        onClick={() => toast.dismiss(toastItem.id)}
        aria-label="알림 닫기"
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#9298A2] transition hover:bg-[#F4F5F7] hover:text-[#2D3035]"
      >
        <X size={17} />
      </button>
    </div>
  );
}
