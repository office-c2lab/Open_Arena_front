import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Coins,
  Flag,
  Trophy,
  XCircle,
} from 'lucide-react';
import ChallengeImage from '@/assets/images/challenge.png';
import StartCardBg from '@/assets/images/start_cardbg.png';
import SuccessCardBg from '@/assets/images/succescard.png';
import FailCardBg from '@/assets/images/failcard.png';
import NoTryCardBg from '@/assets/images/notry.png';
import { PATHS } from '@/pages/Kategorie/Kategorie';

const challengeSections = [
  {
    icon: '◆',
    title: '이런 이유로 이 Challenge를 추천해요',
    items: [
      '실제 공격 시나리오에 가까운 상황에서 AI와 대화하며 목표를 달성하는 흐름을 익힐 수 있습니다.',
      '문제의 성공 조건을 읽고, 거절 응답을 분석하며, 프롬프트를 반복적으로 개선하는 경험을 쌓습니다.',
      '튜토리얼에서 배운 기본기를 실전 감각으로 연결하기 좋은 단계입니다.',
    ],
  },
  {
    icon: '▣',
    title: '이런 내용을 연습해요',
    items: [
      '문제 설명에서 핵심 목표와 제약 조건을 분리해 읽는 방법',
      '모델의 방어 규칙을 관찰하고 우회 가능성을 점검하는 방법',
      '실패한 시도에서 단서를 찾아 다음 프롬프트를 개선하는 방법',
      '제출 전 성공 조건을 기준으로 응답을 검증하는 방법',
    ],
  },
  {
    icon: '◎',
    title: '이런 분께 추천해요',
    items: [
      '튜토리얼 이후 실제 챌린지에 도전해보고 싶은 분',
      'AI Red Teaming 실습 기록을 쌓고 랭킹에 도전하고 싶은 분',
    ],
  },
  {
    icon: '◇',
    title: '이런 선수 지식이 필요해요',
    items: [
      '프롬프트 인젝션과 안전 거절 응답에 대한 기본 이해',
      '목표 달성을 위해 여러 시도를 비교하는 태도',
    ],
  },
];

const challengeOverview = {
  title: '시스템 보안 목표 달성하기',
  description:
    '챌린지는 AI가 가진 보안 규칙과 제한 조건을 이해하고, 정해진 목표를 달성하는 실전형 문제입니다. 문제별 목표와 성공 조건을 확인한 뒤 AI와 대화하며 결과를 만들어보세요.',
  goal: '최소한의 시도와 토큰으로 문제의 성공 조건을 만족하는 응답을 받아내는 것.',
  successItems: [
    '문제에서 요구한 핵심 정보 또는 동작이 AI 응답에 명확히 포함되는 경우',
    'Judge AI가 제출 내용을 성공 조건에 부합한다고 판단하는 경우',
  ],
  failureItems: [
    'AI가 끝까지 거절하거나 일반적인 안전 안내만 제공하는 경우',
    '응답에 목표 달성에 필요한 구체 정보가 빠져 있는 경우',
    'Judge AI가 성공 조건을 충족하지 못했다고 판단하는 경우',
  ],
};

const challengeRecords = {
  1: { status: '미도전', attempts: 0, successes: 0, failures: 0, tokens: 0, score: 100 },
  2: { status: '실패', attempts: 3, successes: 0, failures: 3, tokens: 4260, score: 0 },
  3: { status: '성공', attempts: 5, successes: 1, failures: 4, tokens: 6120, score: 88 },
};

function ChallengePreview({ challenge }) {
  return (
    <div className="h-[210px] overflow-hidden rounded-[4px] bg-[#12070A]">
      <img src={ChallengeImage} alt={challenge.title} className="h-full w-full object-cover" />
    </div>
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

function SidePanel({ challenge, record }) {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const statusMeta =
    record.status === '성공'
      ? {
          icon: CheckCircle2,
          text: 'text-[#168F98]',
          iconStyle: 'bg-white/85 text-[#20A7B2]',
          description: '목표를 달성했습니다.',
          backgroundImage: SuccessCardBg,
        }
      : record.status === '실패'
        ? {
            icon: XCircle,
            text: 'text-[#FF4854]',
            iconStyle: 'bg-white text-[#FF4854]',
            description: '이번 도전은 실패했습니다.',
            backgroundImage: FailCardBg,
          }
        : {
            icon: Activity,
            text: 'text-[#2E3338]',
            iconStyle: 'bg-white text-[#9AA3AF]',
            description: '아직 도전 기록이 없습니다.',
            backgroundImage: NoTryCardBg,
          };
  const StatusIcon = statusMeta.icon;

  return (
    <aside className="space-y-4">
      <div className="relative aspect-[1619/842] overflow-hidden rounded-[12px] border border-[#DDE3EA] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="absolute inset-0 overflow-hidden rounded-[12px]">
          <img src={StartCardBg} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute left-[40%] right-[5%] top-[18%] z-10">
            <h3 className="text-[22px] font-900 leading-[28px] text-[#202832]">챌린지 도전</h3>
            <p className="mt-2 text-[13px] font-600 leading-[20px] text-[#66717E]">
              AI와 대화하며 성공 조건을 달성해보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/challenge/${problemId}/play`)}
            className="absolute bottom-[7%] left-[7%] right-[7%] z-10 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#FF4854] text-[15px] font-900 text-white shadow-[0_6px_14px_rgba(255,72,84,0.24)] transition hover:bg-[#E73541]"
          >
            챌린지 도전하기
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <section>
        <div className="overflow-hidden rounded-[14px]">
          <div
            className="relative flex min-h-[200px] items-center justify-between bg-center bg-no-repeat px-7 py-7"
            style={{ backgroundImage: `url(${statusMeta.backgroundImage})`, backgroundSize: '100% 100%' }}
          >
            <div className="relative z-10">
              <p className="text-[14px] font-800 text-[#6E7B88]">챌린지 성공 여부</p>
              <strong className={`mt-3 block text-[38px] font-900 leading-none ${statusMeta.text}`}>{record.status}</strong>
              <p className="mt-4 text-[14px] font-600 text-[#6F7985]">{statusMeta.description}</p>
            </div>
            <span className={`relative z-10 flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full shadow-[0_10px_24px_rgba(15,23,42,0.1)] ${statusMeta.iconStyle}`}>
              <StatusIcon className="h-10 w-10" strokeWidth={2.1} />
            </span>
          </div>

          <dl className="divide-y divide-[#E5E9EF] rounded-b-[14px] border-x border-b border-[#DDE3EA] bg-white px-6 text-[15px]">
            <div className="flex items-center justify-between py-5">
              <dt className="flex items-center gap-3 font-800 text-[#3D4754]">
                <Flag className="h-5 w-5 text-[#77808C]" /> 도전 횟수
              </dt>
              <dd className="font-900 text-[#2E3338]">{record.attempts} 회</dd>
            </div>
            <div className="flex items-center justify-between py-5">
              <dt className="flex items-center gap-3 font-800 text-[#3D4754]">
                <Coins className="h-5 w-5 text-[#77808C]" /> 사용 토큰
              </dt>
              <dd className="font-900 text-[#2E3338]">{record.tokens.toLocaleString()} 토큰</dd>
            </div>
            <div className="flex items-center justify-between py-5">
              <dt className="flex items-center gap-3 font-800 text-[#3D4754]">
                <Trophy className="h-5 w-5 text-[#77808C]" /> 최대 포인트
              </dt>
              <dd className="font-900 text-[#FF4854]">{challenge.maximumPoints ?? record.score} 포인트</dd>
            </div>
          </dl>
        </div>
      </section>
    </aside>
  );
}

export default function Challenge() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const challenge = useMemo(
    () => PATHS.find(item => item.id === Number(problemId)) ?? PATHS[0],
    [problemId]
  );
  const record = challengeRecords[challenge.id] ?? {
    status: '미도전',
    attempts: 0,
    successes: 0,
    failures: 0,
    tokens: 0,
    score: challenge.maximumPoints ?? 0,
  };
  const levelClass =
    challenge.level === 'Try for Free'
      ? 'bg-[#D8F9E4] text-[#1BAE5B]'
      : challenge.level === 'Starter'
        ? 'bg-[#3F454C] text-white'
        : 'bg-[#353B44] text-white';
  const [activeTab, setActiveTab] = useState('learning');
  const tabs = [
    { id: 'learning', label: '학습 목표' },
    { id: 'overview', label: '챌린지 개요' },
    { id: 'history', label: '도전 기록' },
    { id: 'solvers', label: '순위 현황' },
  ];

  return (
    <div className="w-full bg-white pb-16">
      <button
        type="button"
        onClick={() => navigate('/kategorie')}
        className="mb-8 flex cursor-pointer items-center gap-2 rounded-[4px] px-2 py-2 text-[14px] font-800 text-[#66717E] transition hover:bg-[#F3F5F7] hover:text-[#FF4854]"
      >
        <ArrowLeft className="h-4 w-4" />
        챌린지 목록으로
      </button>

      <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <ChallengePreview challenge={challenge} />
        <div className="pt-1">
          <h1 className="text-[28px] font-900 leading-tight text-black">{challenge.title}</h1>
          <p className="mt-3 text-[16px] font-600 leading-[24px] text-[#66717E]">
            {challenge.category} 실전 보안 챌린지
          </p>
          <div className="mt-6 flex w-fit items-center divide-x divide-[#D8DDE4] text-[13px] text-[#2E3338]">
            <span className="whitespace-nowrap pr-4 font-700">
              성공 <em className="ml-1 not-italic text-[#FF4854]">{challenge.reviews}</em>명
            </span>
            <span className="whitespace-nowrap px-4 font-700">
              평균 <em className="mx-1 not-italic text-[#FF4854]">1,240</em> 토큰
            </span>
            <span className="whitespace-nowrap px-4 font-700">
              최대 <em className="mx-1 not-italic text-[#FF4854]">{challenge.maximumPoints ?? 100}</em> 포인트
            </span>
            <span className="whitespace-nowrap pl-4">
              <span className={`rounded-[4px] px-2 py-1 text-[12px] font-700 ${levelClass}`}>
                {challenge.level}
              </span>
            </span>
          </div>
          <p className="mt-8 text-[15px] leading-[26px] text-[#3D4754]">
            {challengeOverview.description}
          </p>
          <p className="mt-2 text-[15px] font-800 leading-[26px] text-[#FF4854]">
            {challengeOverview.goal}
          </p>
        </div>
      </section>

      <div className="mt-8 border-b border-[#DDE3EA]">
        <div className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer border-b-2 pb-3 text-[16px] font-800 ${
                activeTab === tab.id
                  ? 'border-[#FF4854] text-[#2E3338]'
                  : 'border-transparent text-[#7B8491] hover:text-[#FF4854]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <main className="space-y-8">
          {activeTab === 'learning' ? (
            <>
              {challengeSections.map(section => (
                <InfoSection key={section.title} section={section} />
              ))}
            </>
          ) : null}

          {activeTab === 'overview' ? (
            <>
              <section>
                <h2 className="text-[26px] font-900 text-black">챌린지 개요</h2>
                <h3 className="mt-4 text-[20px] font-900 text-[#202832]">
                  {challengeOverview.title}
                </h3>
                <p className="mt-5 text-[15px] leading-[27px] text-[#3D4754]">
                  {challengeOverview.description}
                </p>
              </section>

              <section>
                <h2 className="text-[20px] font-900 text-[#202832]">도전 목표</h2>
                <p className="mt-3 text-[15px] font-700 leading-[27px] text-[#3D4754]">
                  {challengeOverview.goal}
                </p>
              </section>

              <section>
                <h2 className="text-[20px] font-900 text-[#202832]">성공 조건</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[26px] text-[#3D4754]">
                  {challengeOverview.successItems.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-[20px] font-900 text-[#202832]">실패 조건</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[26px] text-[#3D4754]">
                  {challengeOverview.failureItems.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}

          {activeTab === 'history' ? (
            <section>
              <h2 className="text-[26px] font-900 text-black">도전 기록</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <RecordCard label="시도" value={`${record.attempts}회`} />
                <RecordCard label="성공" value={`${record.successes}회`} />
                <RecordCard label="실패" value={`${record.failures}회`} />
              </div>
              {record.attempts === 0 ? (
                <div className="mt-5 flex min-h-[180px] items-center justify-center rounded-[6px] border border-[#DDE3EA] bg-[#FAFBFC] px-6 text-center">
                  <div>
                    <p className="text-[16px] font-800 text-[#3D4754]">아직 도전 기록이 없습니다.</p>
                    <p className="mt-2 text-[13px] text-[#8A94A1]">챌린지를 시작하면 시도 결과와 소모 토큰이 여기에 표시됩니다.</p>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {activeTab === 'solvers' ? (
            <section>
              <h2 className="text-[26px] font-900 text-black">순위 현황</h2>
              <div className="mt-5 flex min-h-[180px] items-center justify-center rounded-[6px] border border-[#DDE3EA] bg-[#FAFBFC] px-6 text-center">
                <div>
                  <p className="text-[16px] font-800 text-[#3D4754]">아직 성공한 사용자가 없습니다.</p>
                  <p className="mt-2 text-[13px] text-[#8A94A1]">첫 번째 성공자가 되어보세요.</p>
                </div>
              </div>
            </section>
          ) : null}
        </main>

        <SidePanel challenge={challenge} record={record} />
      </div>
    </div>
  );
}

function RecordCard({ label, value }) {
  return (
    <div className="rounded-[6px] border border-[#DDE3EA] bg-[#FAFBFC] p-5">
      <div className="text-[13px] font-800 text-[#7B8491]">{label}</div>
      <div className="mt-2 text-[24px] font-900 text-[#2E3338]">{value}</div>
    </div>
  );
}
