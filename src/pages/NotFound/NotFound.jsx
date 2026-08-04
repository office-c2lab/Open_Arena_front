import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-x-hidden overflow-y-auto bg-[#FFF7F8] px-5 py-6 text-[#151A21] sm:py-8">
      <div
        aria-hidden="true"
        className="absolute left-[12%] top-[14%] h-24 w-24 opacity-45"
        style={{
          backgroundImage: 'radial-gradient(#FFB8BE 1.2px, transparent 1.2px)',
          backgroundSize: '10px 10px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute right-[13%] bottom-[26%] h-28 w-28 opacity-35"
        style={{
          backgroundImage: 'radial-gradient(#FFB8BE 1.2px, transparent 1.2px)',
          backgroundSize: '10px 10px',
        }}
      />

      <section className="relative z-10 flex w-full max-w-[41.5rem] flex-col items-center rounded-[24px] border border-white bg-white px-8 py-10 text-center shadow-[0_24px_70px_rgba(255,72,84,0.14)] sm:px-14 sm:py-12 [@media(max-height:720px)]:max-w-[38rem] [@media(max-height:720px)]:py-8">
        <h1 className="bg-gradient-to-b from-[#FF4854] to-[#FF9AA3] bg-clip-text text-metric-lg font-bold text-transparent">
          404
        </h1>
        <p className="mt-4 text-section-title font-bold text-[#151A21] [@media(max-height:720px)]:mt-3">
          페이지를 찾을 수 없습니다.
        </p>
        <p className="mt-5 text-body font-strong text-[#667085] sm:text-body-lg [@media(max-height:720px)]:mt-3">
          요청하신 페이지가 존재하지 않거나,
          <br />
          접근 가능한 주소가 변경되었을 수 있습니다.
        </p>
        <p className="mt-2 text-body font-strong text-[#667085] sm:text-body-lg">
          입력한 주소를 다시 확인해 주세요.
        </p>

        <Link to="/" className="btn btn-primary btn-md btn-block mt-8 max-w-[360px]">
          홈으로 돌아가기
        </Link>

        <div className="mt-8 h-px w-full bg-[#FFE0E3] [@media(max-height:720px)]:mt-5" />

        <p className="mt-6 inline-flex items-center justify-center gap-2 text-label font-strong text-[#8A94A6] sm:text-body [@media(max-height:720px)]:mt-4">
          <Info className="h-4 w-4 shrink-0 text-[#FF4854]" aria-hidden="true" strokeWidth={2} />
          문제가 계속되면 관리자에게 문의해 주세요.
        </p>
      </section>
    </main>
  );
}
