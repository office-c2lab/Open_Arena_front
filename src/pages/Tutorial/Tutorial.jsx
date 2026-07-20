import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Check,
  CircleHelp,
  Clock3,
  Database,
  Flag,
  FlaskConical,
  ListChecks,
  Lock,
  Star,
  TableOfContents,
} from 'lucide-react';
import TutorialImage from '@/assets/images/tutorial.png';

const tutorial = {
  title: 'Prompt Injection Basics',
  rating: '10.0',
  reviews: 12,
  tier: 'Tier 0',
  difficulty: 'Beginner',
  tags: ['Tutorial', 'AI Security'],
  description:
    'AI 어시스턴트가 따르는 보안 규칙을 이해하고, 프롬프트 인젝션이 어떤 방식으로 발생하는지 단계적으로 학습합니다. 튜토리얼을 따라가며 기본 공격 시나리오와 방어 관점을 함께 익힐 수 있습니다.',
};

const sections = [
  {
    icon: '◆',
    title: '이런 이유로 이 Tutorial을 추천해요',
    items: [
      'AI 보안 학습을 처음 시작하는 분도 부담 없이 따라올 수 있도록 기본 개념부터 구성했습니다.',
      '프롬프트 인젝션의 원리, 위험한 입력 패턴, 모델 응답을 관찰하는 방법을 실습 흐름으로 익힙니다.',
      '이후 챌린지에 도전하기 전에 필요한 사고방식과 기본 용어를 자연스럽게 정리할 수 있습니다.',
    ],
  },
  {
    icon: '▣',
    title: '이런 내용을 배워요',
    items: [
      '시스템 프롬프트와 사용자 입력이 충돌하는 구조',
      '민감 정보 유출을 유도하는 대표적인 프롬프트 인젝션 패턴',
      '모델 응답을 분석하고 우회 시도를 반복적으로 개선하는 방법',
      '안전한 AI 서비스 설계를 위해 고려해야 할 기본 방어 관점',
    ],
  },
  {
    icon: '◎',
    title: '이런 분께 추천해요',
    items: [
      'AI 보안과 레드팀 평가를 처음 접하는 분',
      'ARENA 챌린지를 시작하기 전에 기본 실습 흐름을 익히고 싶은 분',
    ],
  },
  {
    icon: '◇',
    title: '이런 선수 지식이 필요해요',
    items: [
      '기본적인 웹 서비스 사용 경험',
      'AI 챗봇과 프롬프트에 대한 기초적인 이해',
      '보안 실습을 차근차근 따라가려는 태도',
    ],
  },
];

const units = [
  '프롬프트 인젝션 개요',
  '보안 규칙과 역할 이해',
  '우회 입력 작성하기',
  '응답 관찰과 반복 개선',
  '기본 방어 전략',
];

function PathPreview() {
  return (
    <div className="relative h-[210px] overflow-hidden rounded-[4px] bg-[#FFF0F2]">
      <div className="absolute inset-0 opacity-90">
        <div className="absolute -left-12 top-12 h-44 w-44 rounded-full border border-[#FF7A85]/55" />
        <div className="absolute left-[36%] -top-16 h-52 w-52 rounded-full border border-[#FF7A85]/55" />
        <div className="absolute right-7 bottom-5 h-36 w-36 rounded-full border border-[#FF7A85]/55" />
        <div className="absolute left-14 top-4 h-64 w-[1px] rotate-[29deg] border-l border-[#FF7A85]/55" />
        <div className="absolute left-[53%] top-[-40px] h-80 w-[1px] rotate-[29deg] border-l border-[#FF7A85]/55" />
        <div className="absolute right-12 top-0 h-64 w-[1px] rotate-[29deg] border-l border-[#FF7A85]/55" />
      </div>
      <div className="absolute right-6 top-0 h-14 w-10 bg-[#FF4854]">
        <Bookmark className="mx-auto mt-2 h-5 w-5 fill-white text-white" strokeWidth={1.8} />
        <div className="absolute bottom-[-1px] left-0 h-0 w-0 border-l-[20px] border-r-[20px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/90" />
      </div>
      <h1 className="relative z-10 max-w-[78%] p-6 text-[32px] font-500 leading-[40px] text-[#46464D]">
        {tutorial.title}
      </h1>
    </div>
  );
}

function Tag({ children, tone = 'gray' }) {
  const classes = {
    blue: 'border-[#C9D8FF] text-[#5578EA]',
    green: 'border-[#9CDE7B] text-[#4FAF2F]',
    gray: 'border-[#D7DDE6] text-[#677281]',
  };

  return (
    <span className={`rounded-[3px] border px-2 py-1 text-[11px] font-600 leading-none ${classes[tone]}`}>
      {children}
    </span>
  );
}

function InfoSection({ section }) {
  return (
    <section className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-[4px] border border-[#DDE3EA] bg-[#F7F9FC] px-3 py-2 text-[13px] font-800 text-[#2E3338]">
        <span>{section.icon}</span>
        {section.title}
      </div>
      <ul className="space-y-2 text-[15px] leading-[28px] text-[#26313D]">
        {section.items.map(item => (
          <li key={item} className="flex gap-2">
            <Check className="mt-1.5 h-4 w-4 shrink-0 text-[#9BA4B0]" strokeWidth={2} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SidePanel() {
  const navigate = useNavigate();
  const progressItems = [
    { icon: TableOfContents, label: '강의', value: '0 / 12', locked: 6, extra: '제외' },
    { icon: Flag, label: '실습', value: '0 / 5', locked: 2 },
    { icon: CircleHelp, label: '퀴즈', value: '0 / 4', locked: 1 },
  ];

  return (
    <aside className="space-y-4">
      <div className="rounded-[3px] border border-[#DDE3EA] bg-[#F8FAFC]">
        <div className="space-y-3 p-5">
          <label className="block cursor-pointer rounded-[3px] border border-[#FF8A93] bg-[#FFF0F2] p-4">
            <div className="flex items-center gap-3">
              <input type="radio" name="tutorial-purchase" defaultChecked className="accent-[#FF4854]" />
              <strong className="text-[19px] font-800 text-[#151A21]">무료 튜토리얼</strong>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-9 text-[12px] font-600 text-[#FF4854]">
              <li>기초 학습 콘텐츠 무제한 수강</li>
              <li>기본 실습 포함</li>
            </ul>
            <div className="mt-4 pl-9">
              <strong className="text-[26px] font-900 text-black">무료</strong>
            </div>
          </label>

          <button
            type="button"
            onClick={() => navigate('/challenge/44/play')}
            className="h-12 w-full cursor-pointer rounded-[4px] bg-[#FF4854] text-[15px] font-800 text-white transition hover:bg-[#E73541]"
          >
            튜토리얼 시작하기
          </button>
        </div>

        <div className="border-t border-[#DDE3EA] p-5">
          <h3 className="mb-4 text-[14px] font-800 text-[#2E3338]">Tutorial 상세</h3>
          <dl className="space-y-3 text-[13px] font-600 text-[#596575]">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />약 1시간 30분
            </div>
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />12개의 강의
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />5개의 실습
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />4개의 퀴즈
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Beginner, 입문 난이도
            </div>
          </dl>
        </div>
      </div>

      <div className="rounded-[3px] border border-[#DDE3EA] bg-white p-6">
        <div className="flex items-center gap-5">
          <div className="h-[74px] w-[74px] rounded-full border-[4px] border-[#E8EAEE]" />
          <div>
            <strong className="text-[24px] font-900 text-[#111827]">0% 진행중</strong>
            <p className="mt-1 text-[14px] font-600 text-[#7B8491]">총 0개 항목 완료</p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {progressItems.map(item => {
            const Icon = item.icon;

            return (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[18px] font-800 text-[#2E3338]">
                    <Icon className="h-5 w-5 text-[#606B78]" />
                    {item.label} <span className="text-[#7B8491]">{item.value}</span>
                    {item.extra && (
                      <span className="rounded-[3px] bg-[#EEF1F5] px-1.5 py-0.5 text-[13px] font-800 text-[#9AA3AF]">
                        {item.extra}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[14px] font-700 text-[#A0A8B3]">
                    <Lock className="h-4 w-4 fill-[#A0A8B3] text-[#A0A8B3]" />
                    {item.locked}
                  </div>
                </div>
                <div className="mt-4 h-1 rounded-full bg-[#ECEFF3]" />
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[16px] font-800 text-[#66717E]">
            <TableOfContents className="h-4 w-4" />
            프롬프트 인젝션 개요
          </div>
          <button
            type="button"
            onClick={() => navigate('/challenge/44/play')}
            className="h-[52px] w-full cursor-pointer rounded-[4px] bg-[#4A4A4A] text-[18px] font-900 text-white transition hover:bg-[#333333]"
          >
            이어서 학습하기
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function Tutorial() {
  return (
    <div className="w-full bg-white pb-16">
      <section className="relative mb-8 h-[220px] overflow-hidden rounded-[8px] bg-black md:h-[300px]">
        <img src={TutorialImage} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/28 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 text-left sm:px-10 md:px-14">
          <h1 className="max-w-[680px] text-[24px] font-800 leading-tight text-white sm:text-[34px] md:text-[46px]">
            튜토리얼로 <span className="text-[#FF4854]">ARENA</span>를 시작하세요
          </h1>
          <p className="mt-3 max-w-[560px] text-[14px] font-600 leading-relaxed text-white/72 sm:text-[17px] md:mt-4 md:text-[22px]">
            기초 개념부터 실전 흐름까지,
            <br />
            단계별 학습으로 보안 감각을 익혀보세요.
          </p>
          <button
            type="button"
            onClick={() => document.getElementById('tutorial-detail-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group mt-7 flex cursor-pointer items-center gap-4 text-[18px] font-800 text-white transition-colors hover:text-[#FF4854] sm:text-[24px] md:mt-9"
          >
            지금 바로 확인하기
            <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1 sm:h-8 sm:w-8" strokeWidth={1.8} />
          </button>
        </div>
      </section>

      <section id="tutorial-detail-section" className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <PathPreview />
        <div className="pt-1">
          <h1 className="text-[28px] font-900 leading-tight text-black">{tutorial.title}</h1>
          <div className="mt-3 flex items-center gap-1 text-[14px] font-700 text-[#2E3338]">
            <Star className="h-4 w-4 fill-[#2E3338] text-[#2E3338]" />
            {tutorial.rating} <span className="text-[#66717E]">({tutorial.reviews})</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag tone="blue">{tutorial.tier}</Tag>
            <Tag tone="green">{tutorial.difficulty}</Tag>
            {tutorial.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <p className="mt-16 text-[15px] leading-[26px] text-[#3D4754]">{tutorial.description}</p>
        </div>
      </section>

      <div className="mt-8 border-b border-[#DDE3EA]">
        <div className="flex gap-8">
          {['학습목표', 'Unit 구성', '수강 후기 12'].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`cursor-pointer border-b-2 pb-3 text-[16px] font-800 ${
                index === 0
                  ? 'border-[#FF4854] text-[#2E3338]'
                  : 'border-transparent text-[#7B8491] hover:text-[#FF4854]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="space-y-8">
          {sections.map(section => (
            <InfoSection key={section.title} section={section} />
          ))}

          <section className="pt-4">
            <h2 className="mb-5 text-[26px] font-900 text-black">Unit 구성</h2>
            <div className="divide-y divide-[#E5E9EF] rounded-[4px] border border-[#DDE3EA]">
              {units.map((unit, index) => (
                <div key={unit} className="flex items-center justify-between px-5 py-4">
                  <span className="text-[15px] font-800 text-[#2E3338]">
                    {index + 1}. {unit}
                  </span>
                  <span className="text-[12px] font-700 text-[#9AA3AF]">무료 미리보기</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        <SidePanel />
      </div>
    </div>
  );
}
