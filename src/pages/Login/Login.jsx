import BackBtn from '@/assets/icons/backbtn.svg';
import PasswordToggle from '@/assets/icons/passwordtoggle.svg';

export default function Login() {
  // 반응형 스타일 변수 정의 (md:mb-4는 모바일에서는 mb-2만 사용하도록 유지)
  const inputLabelStyle = 'text-xl font-medium text-[#6B6B6B] mb-2 md:mb-4';
  const inputFieldStyle =
    'w-full text-xl leading-[26px] outline-none border-b border-[#D9DADB] focus:border-[#6B6B6B] pb-2 text-[#6B6B6B] bg-transparent placeholder:text-[#D9DADB]';
  const linkStyle =
    'text-xl font-medium text-[#6B6B6B] hover:text-black transition-colors duration-200 no-underline';

  return (
    // **화면 중앙 정렬을 위한 외부 래퍼**
    <div className="min-h-screen flex justify-center items-center">
      {/* 메인 컨테이너: max-w-[675px], shadow-xl, overflow-hidden, rounded-[16px] 적용 */}
      {/* min-h-screen은 모바일에서만 적용하고, PC에서는 md:min-h-0로 콘텐츠 높이만큼만 잡습니다. */}
      <div
        className="max-w-[675px] w-full bg-white rounded-[16px] shadow-xl flex flex-col 
                   min-h-screen md:min-h-0 md:my-10 overflow-hidden font-notosans"
      >
        {/* 1. Header Area: 상단 라운딩 적용 */}
        <header className="px-8 pt-8 pb-4 border-b border-[#D9DADB] rounded-t-[16px]">
          <div className="flex items-center">
            <img src={BackBtn} alt="back" className="w-[17px] h-[34px] cursor-pointer" />
            <h1 className="text-[20px] font-medium text-black ml-4">로그인</h1>
          </div>
        </header>

        {/* 2. Main Content Area: flex-grow 제거 -> 높이가 콘텐츠만큼 줄어듭니다. */}
        <main className="flex flex-col p-8 md:p-10">
          {/* 로그인 정보를 입력해 주세요. (줄바꿈 반영) */}
          <h2 className="text-[24px] font-medium text-black mt-8 mb-12">
            로그인 정보를
            <br /> 입력해 주세요.
          </h2>

          {/* 폼 요소 그룹 */}
          <form className="flex flex-col space-y-6">
            {/* 아이디 입력 그룹 */}
            <div className="flex flex-col">
              <label htmlFor="id-input" className={inputLabelStyle}>
                아이디
              </label>
              <input id="id-input" type="text" className={inputFieldStyle} placeholder="이메일" />
            </div>

            {/* 아이디 저장 (우측 정렬) */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="save-id"
                  className="w-5 h-5 border border-[#6B6B6B] rounded-[2px] appearance-none 
                                 checked:bg-[#6B6B6B] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="save-id" className={linkStyle}>
                  아이디 저장
                </label>
              </div>
            </div>

            {/* 비밀번호 입력 그룹 */}
            <div className="flex flex-col">
              <label htmlFor="pw-input" className={inputLabelStyle}>
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="pw-input"
                  type="password"
                  className={`${inputFieldStyle} pr-8`}
                  placeholder="비밀번호"
                />
                {/* Password Toggle */}
                <img
                  src={PasswordToggle}
                  alt="toggle"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B] cursor-pointer"
                />
              </div>
            </div>
          </form>

          {/* 옵션 및 링크 그룹 */}
          <div className="flex flex-col mt-8 items-center space-y-4">
            {/* 아이디 / 비밀번호 찾기 그룹 */}
            <div className="flex flex-col items-center">
              <a href="#" className={linkStyle}>
                아이디 / 비밀번호 찾기
              </a>
              <div className="w-[182px] border-t border-[#6B6B6B] mt-[4px]"></div>
            </div>

            {/* 회원가입 그룹 */}
            <div className="flex flex-col items-center mt-4">
              <a href="#" className={linkStyle}>
                회원가입
              </a>
              <div className="w-[75px] border-t border-[#6B6B6B] mt-1"></div>
            </div>
          </div>
        </main>

        {/* 3. Footer: 로그인 버튼 - mt-8로 링크 그룹 바로 아래 위치시키고, pb-8로 하단 여백 축소 */}
        <footer className="px-8 pt-4 pb-8 mt-8">
          {' '}
          {/* **mt-8로 버튼을 위로 올리고, pb-8로 하단 여백을 줄임** */}
          <button
            className="w-full h-[58px] bg-[#FF4854] rounded-[16px] 
                       text-white text-[20px] font-medium leading-[26px] hover:bg-red-600 transition-colors"
          >
            로그인
          </button>
        </footer>
      </div>
    </div>
  );
}
