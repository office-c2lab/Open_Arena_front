import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Search,
  XCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import LearningBannerImage from '@/assets/images/learning_banner.png';

export const articles = [
  {
    id: 'ai-red-teaming',
    date: '2026-07-20',
    title: 'AI Red Teaming이란 무엇인가요?',
    visualTitle: 'AI RED TEAMING',
    summary:
      'AI 시스템이 악의적 입력, 우회 프롬프트, 정책 충돌에 어떻게 반응하는지 점검하는 기본 개념을 알아봅니다.',
    category: 'Red Teaming',
    readTime: '8분',
    sections: [
      {
        title: 'AI Red Teaming의 핵심',
        body: 'AI Red Teaming은 모델이 예상하지 못한 상황에서도 안전하게 동작하는지 확인하기 위한 공격적 검증 활동입니다. 일반적인 보안 점검이 코드와 인프라의 취약점을 찾는 데 집중한다면, AI Red Teaming은 모델의 판단, 거절 정책, 정보 노출 가능성, 위험한 지시 수행 여부를 함께 살펴봅니다.',
      },
      {
        title: '왜 필요한가요?',
        body: 'LLM은 자연어를 통해 동작하기 때문에 입력 방식에 따라 결과가 크게 달라질 수 있습니다. 겉보기에는 평범한 요청이라도 문맥을 쌓거나 역할을 바꾸거나 규칙을 재해석하게 만들면 안전 정책이 흔들릴 수 있습니다. 이런 실패 지점을 미리 찾는 것이 레드팀 평가의 목적입니다.',
      },
      {
        title: 'ARENA에서 배우는 방식',
        body: 'ARENA는 실제 공격 시나리오를 Path와 Challenge 형태로 나누어 제공합니다. 사용자는 AI와 대화하며 목표를 달성해보고, 실패와 성공 기록을 바탕으로 어떤 프롬프트가 위험하거나 효과적인지 직접 익힐 수 있습니다.',
      },
    ],
    quiz: {
      question: 'AI Red Teaming의 가장 중요한 목적은 무엇인가요?',
      options: [
        '모델의 안전 실패 가능성을 공격자 관점에서 미리 찾아내는 것',
        '모델의 응답 속도를 높이기 위해 캐시를 최적화하는 것',
        '사용자 인터페이스의 색상과 레이아웃을 검수하는 것',
        '학습 데이터의 파일 크기를 줄여 배포 비용을 낮추는 것',
      ],
      answerIndex: 0,
      explanation:
        'AI Red Teaming은 모델이 악의적 입력이나 정책 충돌 상황에서도 안전하게 동작하는지 검증하는 활동입니다.',
    },
  },
  {
    id: 'prompt-injection',
    date: '2026-07-18',
    title: 'Prompt Injection은 어떻게 발생하나요?',
    visualTitle: 'PROMPT INJECTION',
    summary:
      '사용자 입력이 시스템 지시와 충돌할 때 생기는 프롬프트 인젝션의 기본 구조를 정리합니다.',
    category: 'Prompt Security',
    readTime: '6분',
    sections: [
      {
        title: '지시 충돌 이해하기',
        body: '프롬프트 인젝션은 모델이 따라야 하는 상위 지시와 사용자의 새로운 지시가 충돌할 때 발생합니다. 공격자는 모델이 기존 규칙을 잊거나 예외로 처리하도록 유도하며, 간접 입력이나 문서 내용을 통해서도 비슷한 문제가 생길 수 있습니다.',
      },
      {
        title: '대표적인 패턴',
        body: '역할 전환, 규칙 무시 요청, 숨겨진 지시 출력 요청, 안전 정책을 테스트로 위장하는 방식이 자주 등장합니다. 중요한 것은 단일 문장보다 여러 턴의 대화 속에서 모델의 상태가 어떻게 변하는지 관찰하는 것입니다.',
      },
    ],
    quiz: {
      question: 'Prompt Injection이 발생하는 대표적인 상황은 무엇인가요?',
      options: [
        '사용자 입력이 모델의 상위 지시나 기존 규칙과 충돌하도록 유도할 때',
        '모델 서버의 CPU 사용률이 일시적으로 높아질 때',
        '브라우저 캐시가 오래되어 이미지가 늦게 로딩될 때',
        '사용자가 같은 질문을 짧은 시간 안에 여러 번 입력할 때',
      ],
      answerIndex: 0,
      explanation:
        '프롬프트 인젝션은 모델이 따라야 하는 지시 체계를 흔들어 규칙 무시, 역할 전환, 정보 노출 등을 유도합니다.',
    },
  },
  {
    id: 'llm-safety',
    date: '2026-07-15',
    title: 'LLM Safety Challenge 준비하기',
    visualTitle: 'LLM SAFETY',
    summary: 'LLM Safety Challenge에 들어가기 전 알아두면 좋은 평가 관점과 학습 순서를 소개합니다.',
    category: 'Challenge',
    readTime: '5분',
    sections: [
      {
        title: '평가 관점 잡기',
        body: 'LLM Safety 평가는 모델이 위험한 지시를 거절하는지뿐 아니라, 안전한 대안을 제공하는지, 민감한 정보를 보호하는지, 반복된 우회 시도에도 일관성을 유지하는지 확인합니다.',
      },
      {
        title: '학습 순서',
        body: '처음에는 튜토리얼에서 용어와 흐름을 익히고, 이후 쉬운 챌린지부터 시도하는 것이 좋습니다. 성공 여부보다 어떤 시도가 왜 실패했는지 기록하는 과정이 실력 향상에 더 중요합니다.',
      },
    ],
    quiz: {
      question: 'LLM Safety 평가에서 함께 살펴봐야 하는 요소로 가장 적절한 것은 무엇인가요?',
      options: [
        '위험한 지시 거절, 안전한 대안 제시, 민감 정보 보호의 일관성',
        '로고 크기, 버튼 색상, 페이지 전환 애니메이션의 화려함',
        '응답을 항상 가장 길게 생성하는 능력',
        '모든 요청에 예외 없이 순응하는 태도',
      ],
      answerIndex: 0,
      explanation:
        '안전성 평가는 단순 거절뿐 아니라 대안 제시와 민감 정보 보호가 반복 상황에서도 유지되는지 확인합니다.',
    },
  },
  {
    id: 'tokens',
    date: '2026-07-12',
    title: '토큰은 무엇이고 왜 중요한가요?',
    visualTitle: 'TOKENS',
    summary:
      'LLM이 텍스트를 처리하는 단위인 토큰의 개념과 보안 테스트에서 토큰이 중요한 이유를 설명합니다.',
    category: 'LLM Basics',
    readTime: '4분',
    sections: [
      {
        title: '토큰의 의미',
        body: '토큰은 모델이 텍스트를 읽고 생성하는 기본 단위입니다. 글자 하나일 수도 있고 단어의 일부일 수도 있습니다. 모델은 토큰 단위로 문맥을 기억하고 다음 출력을 예측합니다.',
      },
      {
        title: '보안 테스트와의 관계',
        body: '긴 문맥, 반복 지시, 숨겨진 규칙 삽입은 모두 토큰 제한과 문맥 관리에 영향을 받습니다. 공격자가 긴 입력을 이용해 중요한 지시를 밀어내거나 모델의 주의를 흐리게 하는 경우도 있습니다.',
      },
    ],
    quiz: {
      question: '보안 테스트에서 긴 입력과 반복 지시가 문제가 될 수 있는 이유는 무엇인가요?',
      options: [
        '문맥 관리에 영향을 주어 중요한 지시를 밀어내거나 주의를 흐릴 수 있기 때문',
        '토큰이 많을수록 모델이 자동으로 인터넷 검색을 수행하기 때문',
        '긴 입력은 항상 모델의 안전 정책을 삭제하기 때문',
        '반복 지시는 화면 배율을 바꾸어 UI를 깨뜨리기 때문',
      ],
      answerIndex: 0,
      explanation:
        'LLM은 토큰 단위로 문맥을 처리하므로 긴 입력과 반복 지시는 문맥 우선순위와 안전 지시 유지에 영향을 줄 수 있습니다.',
    },
  },
  {
    id: 'agents',
    date: '2026-07-10',
    title: 'AI Agent는 일반 챗봇과 무엇이 다른가요?',
    visualTitle: 'AI AGENTS',
    summary: '도구 사용과 행동 실행 권한을 가진 Agent형 AI의 특징과 보안상 주의점을 다룹니다.',
    category: 'Agent Security',
    readTime: '7분',
    sections: [
      {
        title: 'Agent의 특징',
        body: 'Agent는 단순히 답변을 생성하는 것을 넘어 도구를 호출하거나 파일을 읽고, 계획을 세우고, 외부 시스템과 상호작용할 수 있습니다. 이 때문에 잘못된 지시를 따랐을 때 피해 범위가 커질 수 있습니다.',
      },
      {
        title: '보안 포인트',
        body: '권한 분리, 실행 전 확인, 민감 정보 차단, 도구 호출 로그 검토가 중요합니다. 프롬프트 인젝션은 Agent 환경에서 더 직접적인 행동으로 이어질 수 있으므로 별도의 안전 장치가 필요합니다.',
      },
    ],
    quiz: {
      question: 'AI Agent 보안에서 특히 중요한 이유는 무엇인가요?',
      options: [
        '도구 호출이나 파일 접근처럼 실제 행동으로 이어질 수 있기 때문',
        '일반 챗봇보다 항상 더 짧은 답변만 생성하기 때문',
        'Agent는 프롬프트 인젝션의 영향을 전혀 받지 않기 때문',
        '모든 Agent가 별도 로그인 없이 관리자 권한을 갖기 때문',
      ],
      answerIndex: 0,
      explanation:
        'Agent는 외부 도구와 시스템을 사용할 수 있어 잘못된 지시를 따를 때 피해 범위가 커질 수 있습니다.',
    },
  },
  {
    id: 'jailbreak',
    date: '2026-07-08',
    title: 'Jailbreak 시도는 어떻게 분석하나요?',
    visualTitle: 'JAILBREAK',
    summary:
      '모델의 안전 정책을 우회하려는 Jailbreak 시도를 관찰하고 분류하는 기본 방법을 소개합니다.',
    category: 'Analysis',
    readTime: '6분',
    sections: [
      {
        title: '시도 분류하기',
        body: 'Jailbreak는 역할극, 가상 시나리오, 번역 요청, 규칙 재정의, 단계적 유도 등 다양한 형태로 나타납니다. 먼저 공격 의도와 사용된 기법을 분리해 기록하면 분석이 쉬워집니다.',
      },
      {
        title: '성공 여부 판단',
        body: '모델이 실제로 위험한 정보를 제공했는지, 단순히 안전한 설명에 머물렀는지, 거절 후 대안을 제시했는지를 기준으로 평가합니다. ARENA에서는 이런 판단 기준을 챌린지별 목표와 함께 익힐 수 있습니다.',
      },
    ],
    quiz: {
      question: 'Jailbreak 시도를 분석할 때 먼저 분리해 기록하면 좋은 것은 무엇인가요?',
      options: [
        '공격 의도와 사용된 우회 기법',
        '사용자의 브라우저 종류와 화면 해상도',
        '응답 글자 수와 줄바꿈 개수만',
        '모델 이름의 알파벳 순서',
      ],
      answerIndex: 0,
      explanation:
        '역할극, 가상 시나리오, 규칙 재정의 같은 기법과 공격 의도를 나누어 보면 성공 여부와 위험도를 더 명확히 판단할 수 있습니다.',
    },
  },
];

function EducationListItem({ article, onOpen }) {
  return (
    <article className="border-b border-[#E1E6EE] first:border-t">
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full cursor-pointer items-start gap-5 px-1 py-6 text-left transition sm:px-4 sm:py-7"
      >
        <div className="relative hidden h-[104px] w-[190px] shrink-0 items-center overflow-hidden bg-[#0B0D18] px-4 md:flex">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#120F1D_0%,#250B13_52%,#FF4854_220%)]" />
          <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full border border-[#FF4854]/30" />
          <div className="absolute -bottom-12 right-5 h-28 w-28 rounded-full border border-[#FF4854]/20" />
          <strong className="relative z-10 text-[20px] font-900 leading-[22px] text-white [text-shadow:0_3px_14px_rgba(255,72,84,0.32)]">
            {article.visualTitle}
          </strong>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-700 text-[#8A93A5]">
            <span>{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {article.date}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime} 읽기</span>
          </div>
          <h2 className="mt-2 text-[19px] font-900 leading-[26px] text-[#151A21] transition group-hover:text-[#FF4854] sm:text-[21px]">
            {article.title}
          </h2>
          <p className="mt-2 text-[14px] font-500 leading-[23px] text-[#66717E]">{article.summary}</p>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#A4ADB8] transition group-hover:translate-x-1 group-hover:text-[#FF4854]" />
      </button>
    </article>
  );
}

function EducationList() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');

  const filteredArticles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return articles;

    return articles.filter(article =>
      [article.title, article.summary, article.category]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword)
    );
  }, [keyword]);

  const handleSearch = event => {
    event.preventDefault();
    setKeyword(searchInput);
  };

  return (
    <div className="w-full bg-white pb-16">
      <section className="relative mb-9 h-[220px] overflow-hidden rounded-[6px] bg-black md:h-[320px]">
        <img
          src={LearningBannerImage}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/24 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-left sm:px-10 md:px-14">
          <h1 className="whitespace-nowrap text-[24px] font-900 leading-tight text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.8)] sm:text-[36px] md:text-[46px]">
            <span className="text-[#FF4854]">LLM Safety</span> 학습 자료로 시작하세요
          </h1>
          <p className="mt-3 text-[15px] font-800 leading-tight text-white/72 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-[20px] md:text-[24px]">
            AI Red Teaming을 더 깊게 이해하고 싶다면
          </p>
        </div>
      </section>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[18px] font-700 text-black]">
          학습 자료
        </h2>
        <form onSubmit={handleSearch} className="flex w-full gap-3 sm:w-[min(100%,440px)]">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
            <input
              type="search"
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              placeholder="관심 있는 교육 자료를 검색해보세요."
              className="h-11 w-full rounded-[3px] border border-[#D8DDE4] bg-white pl-11 pr-4 text-[13px] outline-none transition focus:border-[#FF4854]"
            />
          </label>
          <button
            type="submit"
            className="flex h-11 cursor-pointer items-center justify-center rounded-[3px] bg-[#FF4854] px-6 text-[13px] font-900 text-white transition hover:bg-[#E73541]"
          >
            검색
          </button>
        </form>
      </div>

      <section>
        {filteredArticles.map(article => (
          <EducationListItem
            key={article.id}
            article={article}
            onOpen={() => navigate(`/education/${article.id}`)}
          />
        ))}
      </section>
    </div>
  );
}

function EducationQuiz({ quiz }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const hasAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === quiz.answerIndex;

  return (
    <section className="overflow-hidden border-y border-[#e7e1d9] bg-white">
      <div className="border-b border-[#e7e1d9] bg-white px-5 py-5 sm:px-6">
        <p className="text-[13px] font-900 uppercase tracking-[0.22em] text-[#FF4854]">Quiz</p>
        <h2 className="mt-3 text-[16px] font-900 leading-[26px] text-[#30343b] sm:text-[18px]">
          Q. {quiz.question}
        </h2>
      </div>

      <div className="grid gap-0 bg-white">
        {quiz.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isAnswer = quiz.answerIndex === index;
          const showCorrect = hasAnswered && isAnswer;
          const showWrong = hasAnswered && isSelected && !isAnswer;

          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={[
                'group flex w-full cursor-pointer items-center justify-between gap-4 border-b border-[#f0ece7] px-5 py-4 text-left transition last:border-b-0 sm:px-6',
                showCorrect
                  ? 'bg-[#FFF7F7] text-[#FF4854]'
                  : showWrong
                    ? 'bg-[#F7F8FA] text-[#8A93A5]'
                    : 'bg-white text-[#4D5968] hover:bg-[#fff7f7] hover:text-[#FF4854]',
              ].join(' ')}
            >
              <span className="flex min-w-0 items-center gap-3 text-[14px] font-800 leading-[23px] sm:text-[15px]">
                <span
                  className={[
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-900 transition',
                    showCorrect || isSelected
                      ? 'border-[#FF4854] bg-[#FF4854] text-white'
                      : 'border-[#e7e1d9] bg-white text-[#8A93A5] group-hover:border-[#FF4854] group-hover:text-[#FF4854]',
                  ].join(' ')}
                >
                  {index + 1}
                </span>
                {option}
              </span>

              {showCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-[#FF4854]" /> : null}
              {showWrong ? <XCircle className="h-5 w-5 shrink-0 text-[#A4ADB8]" /> : null}
            </button>
          );
        })}
      </div>

      {hasAnswered ? (
        <div className="border-t border-[#f0ece7] bg-[#fafafa] px-5 py-5 sm:px-6">
          <p className="text-[15px] font-800 text-[#30343b]">
            {isCorrect ? '정답입니다.' : '아쉽지만 정답을 다시 확인해보세요.'}
          </p>
          <p className="mt-2 text-[14px] font-500 leading-7 text-[#6b6f76]">{quiz.explanation}</p>
        </div>
      ) : null}
    </section>
  );
}

function EducationDetail({ article }) {
  const navigate = useNavigate();

  return (
    <article className="mx-auto w-full max-w-[900px] bg-white pb-16">
      <button
        type="button"
        onClick={() => navigate('/education')}
        className="mb-8 flex cursor-pointer items-center gap-2 rounded-[4px] px-2 py-2 text-[14px] font-800 text-[#66717E] transition hover:bg-[#F3F5F7] hover:text-[#FF4854]"
      >
        <ArrowLeft className="h-4 w-4" />
        교육 목록으로
      </button>

      <header className="text-center">
        <p className="text-[13px] font-900 uppercase tracking-[0.14em] text-[#FF4854]">
          {article.category}
        </p>
        <h1 className="mt-3 text-[38px] font-900 leading-tight text-[#151A21] md:text-[48px]">
          {article.title}
        </h1>
        <p className="mt-4 text-[14px] font-700 text-[#8A93A5]">
          {article.date} · {article.readTime} 읽기
        </p>
      </header>

      <div className="mx-auto mt-10 max-w-[760px] space-y-9">
        <p className="text-[18px] font-700 leading-[32px] text-[#3D4754]">{article.summary}</p>

        {article.sections.map(section => (
          <section key={section.title}>
            <h2 className="text-[25px] font-900 text-[#151A21]">{section.title}</h2>
            <p className="mt-4 text-[16px] font-500 leading-[31px] text-[#4D5968]">
              {section.body}
            </p>
          </section>
        ))}

        <EducationQuiz key={article.id} quiz={article.quiz} />

        <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-[#E3E6EB] pt-7">
          <div className="w-full">
            <h2 className="text-[20px] font-900 text-[#151A21]">다음 단계</h2>
            <p className="mt-3 text-[15px] font-600 leading-[27px] text-[#596575]">
              개념을 이해했다면 튜토리얼에서 기본 흐름을 익히고, 챌린지에서 직접 AI Red Teaming
              시나리오를 실습해보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/tutorial')}
            className="group flex cursor-pointer items-center gap-3 text-[20px] font-900 text-[#151A21] transition hover:text-[#FF4854]"
          >
            튜토리얼 풀기
            <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Education() {
  const { articleId } = useParams();
  const article = articles.find(item => item.id === articleId);

  if (articleId && article) {
    return <EducationDetail article={article} />;
  }

  if (articleId && !article) {
    return <EducationList />;
  }

  return <EducationList />;
}
