import React from 'react';
import {
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

const path = {
  title: 'System Hacking Basics',
  rating: '10.0',
  reviews: 7,
  tier: 'Tier 2',
  difficulty: 'Easy',
  tags: ['Skill Path', 'System Hacking'],
  description:
    '시스템 해킹에서 다루는 다양한 메모리 관련 취약점의 기초 및 원리를 이해하고 단계적으로 학습합니다. 모든 과정을 마치면 시스템 해킹 상 취약점 및 공격 시나리오를 명확히 이해할 수 있으며, 바이너리를 대상으로 한 기본적인 취약점 공격 역량을 갖추게 됩니다.',
};

const sections = [
  {
    icon: '💎',
    title: '이런 이유로 이 Path를 추천해요',
    items: [
      '시스템 보안 학습은 처음에 어렵게 느껴질 수 있지만, 기초부터 차근차근 접근하면 충분히 도전할 만한 분야입니다.',
      '이 Path는 시스템 해킹에 관심 있는 학습자들이 스택 버퍼 오버플로 같은 기본적인 취약점부터 시작해, 단계적으로 지식과 실력을 키워나갈 수 있도록 설계되었습니다.',
      '과정을 따라 실습하고 고민하며 스스로 문제를 해결해나가는 경험을 쌓다 보면, 어느새 시스템 보안의 핵심 개념과 원리를 자연스럽게 이해하게 될 것입니다.',
    ],
  },
  {
    icon: '🐱',
    title: '이런 내용을 배워요',
    items: [
      '익스플로잇 도구(pwntools)를 활용한 취약점 분석과 공격 방법',
      '스택 버퍼 오버플로(Stack Buffer Overflow) 등 주요 메모리 취약점 실습',
      'NX, ASLR, PIE, RELRO 등 보호 기법 분석 및 이를 우회하는 실전 공격 기술',
      '명령 주입(Command Injection), 경로 탐색(Path Traversal), 타입 에러(Type Error) 등 로직 버그 취약점 학습',
    ],
  },
  {
    icon: '🐯',
    title: '이런 분께 추천해요',
    items: [
      '시스템 해킹과 보안의 원리를 명확히 이해하고 싶은 분',
      '화이트 해커, 보안 엔지니어, 취약점 분석가 등 보안 전문가로 나아가고 싶은 분',
    ],
  },
  {
    icon: '🐑',
    title: '이런 선수 지식이 필요해요',
    items: [
      '기본적인 컴퓨터 사용 능력',
      '컴퓨터 구성 부품 및 컴퓨터의 동작 방식에 대한 기초적인 이해',
      'C/C++를 통한 프로그래밍 경험',
    ],
  },
];

const units = [
  '시스템 해킹 개요',
  '메모리 구조와 스택',
  'Buffer Overflow',
  'Return Address Overwrite',
  'pwntools 기초',
  '보호 기법 우회',
];

function PathPreview() {
  return (
    <div className="relative h-[210px] overflow-hidden rounded-[4px] bg-[#FFF0F7]">
      <div className="absolute inset-0 opacity-90">
        <div className="absolute -left-12 top-12 h-44 w-44 rounded-full border border-[#FF87BA]/55" />
        <div className="absolute left-[36%] -top-16 h-52 w-52 rounded-full border border-[#FF87BA]/55" />
        <div className="absolute right-7 bottom-5 h-36 w-36 rounded-full border border-[#FF87BA]/55" />
        <div className="absolute left-14 top-4 h-64 w-[1px] rotate-[29deg] border-l border-[#FF87BA]/55" />
        <div className="absolute left-[53%] top-[-40px] h-80 w-[1px] rotate-[29deg] border-l border-[#FF87BA]/55" />
        <div className="absolute right-12 top-0 h-64 w-[1px] rotate-[29deg] border-l border-[#FF87BA]/55" />
      </div>
      <div className="absolute right-6 top-0 h-14 w-10 bg-[#FF45A2]">
        <Bookmark className="mx-auto mt-2 h-5 w-5 fill-white text-white" strokeWidth={1.8} />
        <div className="absolute bottom-[-1px] left-0 h-0 w-0 border-l-[20px] border-r-[20px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/90" />
      </div>
      <h1 className="relative z-10 max-w-[78%] p-6 text-[32px] font-500 leading-[40px] text-[#46464D]">
        {path.title}
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

function PurchasePanel() {
  const progressItems = [
    { icon: TableOfContents, label: '강의', value: '0 / 33', locked: 24, extra: '제외' },
    { icon: Flag, label: '워게임', value: '0 / 21', locked: 15 },
    { icon: CircleHelp, label: '퀴즈', value: '0 / 8', locked: 6 },
  ];

  return (
    <aside className="space-y-4">
      <div className="rounded-[3px] border border-[#DDE3EA] bg-[#F8FAFC]">
        <div className="space-y-3 p-5">
          <label className="block cursor-pointer rounded-[3px] border border-[#FF8A93] bg-[#FFF0F2] p-4">
            <div className="flex items-center gap-3">
              <input type="radio" name="purchase" defaultChecked className="accent-[#FF4854]" />
              <strong className="text-[19px] font-800 text-[#151A21]">Pro 구독</strong>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-9 text-[12px] font-600 text-[#FF4854]">
              <li>이 Path를 포함한 35개의 Path 무제한 수강</li>
              <li>Lab 포함</li>
            </ul>
            <div className="mt-4 pl-9">
              <strong className="text-[26px] font-900 text-black">₩40,000</strong>
              <span className="text-[16px] font-800 text-black">/월</span>
              <p className="mt-1 text-[13px] font-700 text-[#2E3338]">₩480,000/연</p>
            </div>
          </label>

          <label className="block cursor-pointer rounded-[3px] border border-[#FFCDD2] bg-white p-4">
            <div className="flex items-center gap-3">
              <input type="radio" name="purchase" className="accent-[#FF4854]" />
              <strong className="text-[18px] font-800 text-[#4A2D2F]">이 Path만 개별 구매</strong>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-9 text-[12px] font-600 text-[#8A93A5]">
              <li>이 Path만 무제한 수강</li>
              <li>Lab 미포함</li>
            </ul>
            <div className="mt-4 pl-9">
              <strong className="text-[26px] font-900 text-black">1000코인</strong>
              <span className="ml-1 text-[13px] font-600 text-[#8A93A5]">약 ₩110,000</span>
            </div>
          </label>

          <button type="button" className="h-12 w-full cursor-pointer rounded-[4px] bg-[#FF4854] text-[15px] font-800 text-white transition hover:bg-[#E73541]">
            구독하고 수강하기
          </button>
          <button type="button" className="h-10 w-full cursor-pointer rounded-[4px] border border-[#DDE3EA] bg-white text-[14px] font-700 text-[#2E3338] transition hover:border-[#FF4854] hover:text-[#FF4854]">
            무료 Unit 체험하기
          </button>
        </div>

        <div className="border-t border-[#DDE3EA] p-5">
          <h3 className="mb-4 text-[14px] font-800 text-[#2E3338]">Path 상세</h3>
          <dl className="space-y-3 text-[13px] font-600 text-[#596575]">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              약 29시간 30분
            </div>
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              33개의 강의
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              4개의 Lab
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              21개의 문제
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Easy, 쉬운 난이도
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
              pwntools 기초
            </div>
            <button
              type="button"
              className="h-[52px] w-full cursor-pointer rounded-[4px] bg-[#4A4A4A] text-[18px] font-900 text-white transition hover:bg-[#333333]"
            >
              이어서 학습하기
            </button>
          </div>
        </div>

        <div className="rounded-[3px] border border-[#DDE3EA] bg-[#F3F5F7] px-4 py-3 text-center text-[13px] font-600 text-[#66717E]">
          Lab은 실습 개념으로, 전체 진도율에 포함되지 않아요.
        </div>
    </aside>
  );
}

export default function Challenge() {
  return (
    <div className="w-full bg-white pb-16">
      <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <PathPreview />
        <div className="pt-1">
          <h1 className="text-[28px] font-900 leading-tight text-black">{path.title}</h1>
          <div className="mt-3 flex items-center gap-1 text-[14px] font-700 text-[#2E3338]">
            <Star className="h-4 w-4 fill-[#2E3338] text-[#2E3338]" />
            {path.rating} <span className="text-[#66717E]">({path.reviews})</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag tone="blue">{path.tier}</Tag>
            <Tag tone="green">{path.difficulty}</Tag>
            {path.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <p className="mt-16 text-[15px] leading-[26px] text-[#3D4754]">{path.description}</p>
        </div>
      </section>

      <div className="mt-8 border-b border-[#DDE3EA]">
        <div className="flex gap-8">
          {['학습목표', 'Unit 구성', '수강 후기 7'].map((tab, index) => (
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

        <PurchasePanel />
      </div>
    </div>
  );
}
