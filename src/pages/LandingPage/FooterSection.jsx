import c2LabLogo from '@/assets/images/C2Lab_logo.svg';

import { Container } from './LandingPage.primitives';

export default function FooterSection() {
  return (
    <footer className="relative mt-4 overflow-hidden border-t border-[#E5E7EB] bg-[#F2F4F6] px-5 py-8 text-[#171717] sm:mt-6 sm:px-12 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF4854]/45 to-transparent"
      />
      <Container className="grid items-center gap-8 md:grid-cols-[220px_1fr]">
        <a
          href="https://c2lab.kr/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit"
        >
          <img src={c2LabLogo} alt="C2LAB" className="h-auto w-[180px] sm:w-[210px]" />
        </a>

        <div className="space-y-3 text-[15px] leading-6 text-[#303030]">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <a
              href="https://c2lab.kr/"
              target="_blank"
              rel="noreferrer"
              className="text-[17px] font-semibold text-[#171717] transition hover:text-[#FF4854]"
            >
              (주)씨투랩
            </a>
            <div className="text-sm text-[#57534e]">© 2026 C2LAB. All rights reserved.</div>
          </div>
          <p className="text-[#303030]">
            씨투랩 C2Lab은 신뢰할 수 있는 AI 보안을 만드는 AI 보안 전문 기업입니다.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>대표이사 정미심</span>
            <span>|</span>
            <span>서울 구로구 디지털로31길 20 에이스테크노타워5차 3층 310호 (08380)</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              이메일 <span className="text-[#FF4854]">info@aictl.kr</span>
            </span>
            <span>|</span>
            <span>전화번호 02-6956-7950</span>
            <span>|</span>
            <span>FAX 02-2247-7001</span>
          </div>
        </div>

      </Container>
    </footer>
  );
}
