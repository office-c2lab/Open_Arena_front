import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Search, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import ChallengeBannerImage from '@/assets/images/chalbenner.png';
import TutorialBannerImage from '@/assets/images/tutorial_banner.png';
import LlmSafetyBannerImage from '@/assets/images/LLMSAFETY_banner.png';
import ArenaBannerImage from '@/assets/images/banner.svg';
import AiPosterImage from '@/assets/application/ai01.png';
import AiRecruitImage from '@/assets/application/ai02.png';

const articles = [
  {
    id: 'ai-red-teaming',
    date: '2026-07-20',
    title: 'AI Red Teaming이란 무엇인가요?',
    summary: 'AI 시스템이 악의적 입력, 우회 프롬프트, 정책 충돌에 어떻게 반응하는지 점검하는 기본 개념을 알아봅니다.',
    category: 'Red Teaming',
    image: ChallengeBannerImage,
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
  },
  {
    id: 'prompt-injection',
    date: '2026-07-18',
    title: 'Prompt Injection은 어떻게 발생하나요?',
    summary: '사용자 입력이 시스템 지시와 충돌할 때 생기는 프롬프트 인젝션의 기본 구조를 정리합니다.',
    category: 'Prompt Security',
    image: TutorialBannerImage,
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
  },
  {
    id: 'llm-safety',
    date: '2026-07-15',
    title: 'LLM Safety Challenge 준비하기',
    summary: 'LLM Safety Challenge에 들어가기 전 알아두면 좋은 평가 관점과 학습 순서를 소개합니다.',
    category: 'Challenge',
    image: LlmSafetyBannerImage,
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
  },
  {
    id: 'tokens',
    date: '2026-07-12',
    title: '토큰은 무엇이고 왜 중요한가요?',
    summary: 'LLM이 텍스트를 처리하는 단위인 토큰의 개념과 보안 테스트에서 토큰이 중요한 이유를 설명합니다.',
    category: 'LLM Basics',
    image: ArenaBannerImage,
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
  },
  {
    id: 'agents',
    date: '2026-07-10',
    title: 'AI Agent는 일반 챗봇과 무엇이 다른가요?',
    summary: '도구 사용과 행동 실행 권한을 가진 Agent형 AI의 특징과 보안상 주의점을 다룹니다.',
    category: 'Agent Security',
    image: AiPosterImage,
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
  },
  {
    id: 'jailbreak',
    date: '2026-07-08',
    title: 'Jailbreak 시도는 어떻게 분석하나요?',
    summary: '모델의 안전 정책을 우회하려는 Jailbreak 시도를 관찰하고 분류하는 기본 방법을 소개합니다.',
    category: 'Analysis',
    image: AiRecruitImage,
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
  },
];

function EducationCard({ article, onOpen }) {
  return (
    <article className="flex min-h-[396px] flex-col overflow-hidden rounded-[6px] border border-[#E1E6EE] bg-white transition hover:-translate-y-1 hover:border-[#FFB8BE] hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
      <button type="button" onClick={onOpen} className="block h-[150px] w-full cursor-pointer overflow-hidden bg-[#0B0D18]">
        <img src={article.image} alt="" className="h-full w-full object-cover object-center transition duration-300 hover:scale-[1.03]" />
      </button>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[12px] font-700 text-[#8A93A5]">
          <CalendarDays className="h-3.5 w-3.5" />
          {article.date}
          <span className="rounded-full bg-[#FFF0F2] px-2 py-0.5 text-[#FF4854]">{article.category}</span>
        </div>
        <h2 className="mt-3 text-[20px] font-900 leading-[26px] text-[#151A21]">{article.title}</h2>
        <p className="mt-3 flex-1 text-[14px] font-500 leading-[23px] text-[#66717E]">{article.summary}</p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-[#FF4854] text-[14px] font-900 text-white transition hover:bg-[#E73541]"
        >
          더 읽기
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function EducationList() {
  const navigate = useNavigate();
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

  return (
    <div className="w-full bg-white pb-16">
      <section className="mb-9 rounded-[6px] border border-[#F0C8CD] bg-[#FFF7F8] px-6 py-8 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[13px] font-900 uppercase tracking-normal text-[#FF4854]">Learn</p>
            <h1 className="mt-2 text-[44px] font-900 leading-none text-[#151A21] md:text-[58px]">교육</h1>
            <p className="mt-5 max-w-[780px] text-[16px] font-600 leading-[28px] text-[#596575]">
              AI Red Teaming, 프롬프트 보안, LLM Safety를 이해하는 데 필요한 학습 자료를 모았습니다.
              튜토리얼과 챌린지에 들어가기 전 핵심 개념을 먼저 확인해보세요.
            </p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#F0C8CD] rounded-[4px] border border-[#F0C8CD] bg-white">
            {[
              [articles.length, '자료'],
              ['6', '주제'],
              ['무료', '열람'],
            ].map(([value, label]) => (
              <div key={label} className="min-w-[88px] px-4 py-3 text-center">
                <p className="text-[18px] font-900 text-[#FF4854]">{value}</p>
                <p className="mt-1 text-[11px] font-800 text-[#7B8491]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <label className="relative mb-7 block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4ADB8]" />
        <input
          type="search"
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
          placeholder="관심 있는 교육 자료를 검색해보세요."
          className="h-11 w-full rounded-[3px] border border-[#D8DDE4] bg-white pl-11 pr-4 text-[13px] outline-none transition focus:border-[#FF4854]"
        />
      </label>

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[18px] font-900 text-[#151A21]">
          학습 자료 <span className="text-[#FF4854]">{filteredArticles.length}</span>
        </h2>
        <div className="flex items-center gap-2 text-[13px] font-800 text-[#7B8491]">
          <BookOpen className="h-4 w-4" />
          ARENA Knowledge Base
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredArticles.map(article => (
          <EducationCard
            key={article.id}
            article={article}
            onOpen={() => navigate(`/education/${article.id}`)}
          />
        ))}
      </section>
    </div>
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
        <p className="inline-flex items-center gap-2 rounded-full bg-[#FFF0F2] px-3 py-1 text-[13px] font-900 text-[#FF4854]">
          <ShieldCheck className="h-4 w-4" />
          {article.category}
        </p>
        <h1 className="mt-5 text-[38px] font-900 leading-tight text-[#151A21] md:text-[48px]">{article.title}</h1>
        <p className="mt-4 text-[14px] font-700 text-[#8A93A5]">{article.date} · {article.readTime} 읽기</p>
      </header>

      <div className="mt-8 overflow-hidden rounded-[8px] border border-[#E1E6EE] bg-[#0B0D18]">
        <img src={article.image} alt="" className="h-[240px] w-full object-cover object-center md:h-[360px]" />
      </div>

      <div className="mx-auto mt-10 max-w-[760px] space-y-9">
        <p className="text-[18px] font-700 leading-[32px] text-[#3D4754]">{article.summary}</p>

        {article.sections.map(section => (
          <section key={section.title}>
            <h2 className="text-[25px] font-900 text-[#151A21]">{section.title}</h2>
            <p className="mt-4 text-[16px] font-500 leading-[31px] text-[#4D5968]">{section.body}</p>
          </section>
        ))}

        <div className="rounded-[6px] border border-[#F0C8CD] bg-[#FFF7F8] p-6">
          <h2 className="text-[20px] font-900 text-[#151A21]">다음 단계</h2>
          <p className="mt-3 text-[15px] font-600 leading-[27px] text-[#596575]">
            개념을 이해했다면 튜토리얼에서 기본 흐름을 익히고, 챌린지에서 직접 AI Red Teaming 시나리오를 실습해보세요.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/tutorial')}
              className="h-10 cursor-pointer rounded-[4px] bg-[#FF4854] px-5 text-[14px] font-900 text-white transition hover:bg-[#E73541]"
            >
              튜토리얼 보기
            </button>
            <button
              type="button"
              onClick={() => navigate('/kategorie')}
              className="h-10 cursor-pointer rounded-[4px] border border-[#FFB8BE] bg-white px-5 text-[14px] font-900 text-[#FF4854] transition hover:bg-[#FFF0F2]"
            >
              챌린지 보기
            </button>
          </div>
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
