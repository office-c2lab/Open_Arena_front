import BackBtn from '@/assets/icons/backbtn.svg';
import PasswordToggle from '@/assets/icons/passwordtoggle.svg';

export default function Login() {
  return (
    <div className="relative w-[675px] h-[1024px] bg-white rounded-[16px] mx-auto my-0">
      {/* 상단 백 버튼 */}
      <img src={BackBtn} alt="back" className="absolute w-[17px] h-[34px] left-[28px] top-[34px]" />

      {/* 상단 제목 */}
      <h1 className="absolute left-[55px] top-[37px] font-medium text-[20px] leading-[26px] text-black">
        로그인
      </h1>

      {/* 상단 구분선 */}
      <div className="absolute top-[78px] left-0 w-full border-t border-[#D9DADB]" />

      {/* 로그인 안내 문구 */}
      <h2 className="absolute left-[31px] top-[140px] font-medium text-[24px] leading-[36px] text-black">
        로그인 정보를 입력해 주세요.
      </h2>

      {/* 아이디 입력 */}
      <div className="absolute top-[271px] left-[calc(50%-304.5px)] w-[609px] h-[79px]">
        <label className="block font-medium text-[20px] leading-[26px] text-[#6B6B6B] mb-[6px]">
          아이디
        </label>
        <input
          type="text"
          className="w-full border-b border-[#D9DADB] text-[20px] leading-[26px] outline-none"
          placeholder="이메일"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="absolute top-[427px] left-[calc(50%-300.5px)] w-[601px] h-[80px]">
        <label className="block font-medium text-[20px] leading-[26px] text-[#6B6B6B] mb-[6px]">
          비밀번호
        </label>
        <div className="relative">
          <input
            type="password"
            className="w-full border-b border-[#D9DADB] text-[20px] leading-[26px] outline-none pr-[30px]"
            placeholder="비밀번호"
          />
          <img
            src={PasswordToggle}
            alt="toggle"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[20px] h-[20px]"
          />
        </div>
      </div>

      {/* 아이디 저장, 아이디/비밀번호 찾기 */}
      <div className="absolute top-[376px] left-[calc(50%-97px/2+254px)] font-medium text-[20px] leading-[26px] text-[#6B6B6B]">
        아이디 저장
      </div>
      <div className="absolute top-[561px] left-[calc(50%-187px/2+10px)] font-medium text-[20px] leading-[26px] text-[#6B6B6B]">
        아이디 / 비밀번호 찾기
      </div>

      {/* 회원가입 */}
      <div className="absolute top-[609px] left-[calc(50%-74px/2-0.5px)] font-medium text-[20px] leading-[26px] text-[#6B6B6B]">
        회원가입
      </div>

      {/* 로그인 버튼 */}
      <button className="absolute top-[896px] left-[calc(50%-310px)] w-[620px] h-[58px] bg-[#FF4854] rounded-[16px] text-white font-medium text-[20px] leading-[26px]">
        로그인
      </button>
    </div>
  );
}
