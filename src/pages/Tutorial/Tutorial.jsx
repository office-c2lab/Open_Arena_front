import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import TutorialImage from '@/assets/images/tutorial.png';
import TutorialElementImage from '@/assets/images/t1.png';
import ChallengePlayBg from '@/assets/images/chalbg.png';
import AttemptHistoryCard from '@/pages/Challenge/components/AttemptHistoryCard';
import {
  TutorialPreviewCenterPanel,
  TutorialPreviewLeftPanel,
  TutorialPreviewRightPanel,
} from './TutorialChallengePlayPreview';
import { TABS } from '@/pages/Challenge/data/challengeData';
import { TUTORIALS } from './TutorialList';

const learningSections = [
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

function PathPreview({ tutorial }) {
  const previewImage = tutorial.id === 7 ? TutorialElementImage : TutorialImage;

  return (
    <div className="h-[210px] overflow-hidden rounded-[4px] bg-[#12070A]">
      <img src={previewImage} alt={tutorial.title} className="h-full w-full object-cover" />
    </div>
  );
}

function ChallengePlayPreview() {
  const previewWidth = 1440;
  const previewHeight = 900;
  const previewScale = 0.72;
  const inverseScale = 100 / previewScale;

  return (
    <section className="overflow-hidden rounded-[10px] border border-[#DDE3EA] bg-[#111827] shadow-[0_10px_28px_rgba(15,23,42,0.07)]">
      <div
        className="relative w-full overflow-hidden bg-white"
        style={{
          aspectRatio: `${previewWidth} / ${previewHeight}`,
        }}
      >
        <iframe
          title="챌린지 플레이 화면 프리뷰"
          src="/tutorial-preview/challenge-play"
          className="absolute left-0 top-0 border-0 bg-white"
          style={{
            width: `${inverseScale}%`,
            height: `${inverseScale}%`,
            transform: `scale(${previewScale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </section>
  );
}

function SectionDescription({ intro, items, steps = [], cautions = [] }) {
  return (
    <div className="mt-4 space-y-4">
      <p className="text-[16px] font-700 leading-[29px] text-[#344050]">{intro}</p>
      <ul className="space-y-3">
        {items.map(item => (
          <li key={item} className="flex gap-3 text-[15px] font-600 leading-[27px] text-[#4A5565]">
            <Check className="mt-1.5 h-4.5 w-4.5 shrink-0 text-[#FF4854]" strokeWidth={2.4} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {steps.length ? (
        <div className="mt-7 space-y-4">
          <p className="text-[18px] font-900 text-[#202832]">따라 해보기</p>
          <ol className="space-y-3 text-[16px] font-700 leading-[30px] text-[#344050]">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF4854] text-[12px] font-900 text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {cautions.length ? (
        <div className="mt-7 space-y-4">
          <p className="text-[18px] font-900 text-[#D83A45]">주의 포인트</p>
          <ul className="space-y-3 text-[16px] font-700 leading-[30px] text-[#5A4650]">
            {cautions.map(caution => (
              <li key={caution} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF4854]" />
                <span>{caution}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function PanelPreviewSection({
  title,
  intro,
  items,
  steps,
  cautions,
  nextAction,
  children,
  width = 'w-full',
}) {
  return (
    <section className="space-y-4">
      <div className="border-b border-[#DDE3EA] pb-5">
        <h2 className="text-[26px] font-900 leading-tight text-[#202832]">{title}</h2>
        <SectionDescription
          intro={intro}
          items={items}
          steps={steps}
          cautions={cautions}
        />
      </div>
      <div
        className="overflow-x-auto rounded-[10px] bg-[#F8F3F6] bg-center bg-no-repeat p-6"
        style={{
          backgroundImage: `url(${ChallengePlayBg})`,
          backgroundSize: '100% 100%',
        }}
      >
        <div className={`h-[660px] ${width}`}>{children}</div>
      </div>
      {nextAction ? (
        <p className="rounded-[10px] bg-[#202832] px-5 py-4 text-[15px] font-800 leading-[26px] text-white">
          {nextAction}
        </p>
      ) : null}
    </section>
  );
}

function AttemptStateExamples() {
  return (
    <div className="flex h-full w-[360px] shrink-0 flex-col pt-[184px]">
      <div className="space-y-5">
        <AttemptHistoryCard
          attemptNumber={1}
          isSubmitted={false}
          isSuccess={false}
          promptSummary="아직 Judge AI에게 제출하지 않은 대화입니다."
          attemptNumberVariant="text"
          onClick={() => {}}
        />
        <AttemptHistoryCard
          attemptNumber={2}
          isSubmitted={true}
          isSuccess={false}
          promptSummary="성공 조건에 필요한 핵심 정보가 부족했습니다."
          attemptNumberVariant="text"
          onClick={() => {}}
        />
        <AttemptHistoryCard
          attemptNumber={3}
          isSubmitted={true}
          isSuccess={true}
          promptSummary="목표 조건을 만족한 응답을 받아 제출했습니다."
          attemptNumberVariant="text"
          onClick={() => {}}
        />
      </div>
    </div>
  );
}

function LeftPanelTabExamples() {
  return (
    <div className="flex h-full min-w-[1450px] gap-6">
      {TABS.map(tab => (
        <div key={tab.id} className="h-full w-[340px] shrink-0">
          <TutorialPreviewLeftPanel initialActiveTab={tab.id} lockActiveTab />
        </div>
      ))}
    </div>
  );
}

function ChallengePanelPreviews() {
  return (
    <>
      <PanelPreviewSection
        title="왼쪽 패널"
        intro="왼쪽 패널은 챌린지를 시작하기 전에 반드시 읽어야 하는 문제 정보 영역입니다. 이곳에서 문제의 배경, 요구하는 목표, 성공으로 인정되는 조건, 실패로 처리되는 조건을 확인합니다."
        items={[
          '상단에는 현재 풀고 있는 문제의 제목이 표시됩니다. 뒤로가기 버튼도 이 영역에 있지만, 튜토리얼 프리뷰에서는 화면 이동이 일어나지 않도록 동작을 막아두었습니다.',
          '탭은 설명, 목표, 성공조건, 실패조건으로 나뉩니다. 처음에는 설명 탭을 읽고 문제의 상황을 이해한 뒤, 목표와 판정 조건을 차례대로 확인하는 흐름이 좋습니다.',
          '목표 탭은 AI에게서 어떤 결과를 받아내야 하는지 알려줍니다. 프롬프트를 작성할 때는 이 목표 문장을 계속 기준점으로 삼아야 합니다.',
          '성공조건과 실패조건은 제출 전 체크리스트 역할을 합니다. AI가 그럴듯하게 답해도 성공조건에 필요한 핵심 내용이 없으면 실패할 수 있습니다.',
          'API형 문제에서는 설명 탭 하단에 API 정보가 함께 표시될 수 있습니다. URL, Method, Header, API Key 같은 값은 외부 요청을 구성할 때 필요한 재료입니다.',
        ]}
        steps={[
          '설명 탭에서 문제의 배경과 제한 조건을 먼저 읽습니다.',
          '목표 탭에서 이번 문제에서 받아내야 하는 최종 응답을 확인합니다.',
          '성공조건 탭을 보고 제출 전에 반드시 포함되어야 할 내용을 기억합니다.',
          '실패조건 탭을 보고 피해야 할 응답 패턴을 확인합니다.',
        ]}
        cautions={[
          '문제 설명만 읽고 바로 대화를 시작하면 성공조건을 놓칠 수 있습니다.',
          'AI가 긴 답변을 했다고 해서 성공은 아닙니다. 성공조건에 필요한 핵심 문장이 있는지 확인해야 합니다.',
          'API 정보는 모든 문제에 항상 필요한 것은 아닙니다. API형 문제일 때만 요청 구성에 사용합니다.',
        ]}
        nextAction="왼쪽 패널을 다 읽었다면, 이제 가운데 패널에서 첫 프롬프트를 작성해 대화를 시작합니다."
        width="min-w-[1450px]"
      >
        <LeftPanelTabExamples />
      </PanelPreviewSection>

      <PanelPreviewSection
        title="가운데 패널"
        intro="가운데 패널은 AI와 실제로 대화하는 작업 공간입니다. 문제 조건을 읽은 뒤 여기에서 프롬프트를 입력하고, AI 응답을 관찰하면서 다음 입력을 조정합니다."
        items={[
          '처음 들어오면 ARENA 로고와 대화 시작 안내 문구가 보입니다. 아직 세션이나 메시지가 없다는 뜻이며, 입력창에 첫 프롬프트를 작성하면 대화가 시작됩니다.',
          '대화가 시작되면 사용자 메시지와 AI 응답이 시간 순서대로 쌓입니다. 이전 응답에서 단서, 거절 이유, 애매한 표현을 찾고 다음 프롬프트에 반영합니다.',
          '하단 입력창은 프롬프트를 작성하는 곳입니다. Enter로 전송하고, Shift + Enter로 줄바꿈하는 흐름을 기본으로 생각하면 됩니다.',
          '새로운 대화 시작 버튼은 현재 흐름을 끊고 처음부터 다시 시도할 때 사용합니다. 같은 문제라도 접근 방식을 바꾸고 싶을 때 유용합니다.',
          '제출하기 버튼은 현재 대화가 목표 조건을 만족한다고 판단될 때 누릅니다. 아직 대화 세션이 없거나 제출할 내용이 부족한 상태에서는 비활성처럼 보일 수 있습니다.',
        ]}
        steps={[
          '왼쪽 패널의 목표와 성공조건을 기준으로 첫 질문을 작성합니다.',
          'AI 응답에서 목표에 가까워진 부분과 아직 부족한 부분을 나눠 봅니다.',
          '부족한 부분을 보완하도록 다음 프롬프트를 더 구체적으로 작성합니다.',
          '응답이 성공조건을 만족한다고 판단되면 제출하기 버튼으로 판정을 요청합니다.',
        ]}
        cautions={[
          '한 번의 프롬프트로 바로 성공해야 하는 것은 아닙니다. 응답을 보고 방향을 조정하는 과정이 중요합니다.',
          'AI가 거절했을 때는 같은 문장을 반복하기보다, 거절 이유를 읽고 접근 방식을 바꾸는 편이 좋습니다.',
          '새로운 대화 시작은 이전 맥락을 끊는 행동입니다. 필요한 기록이 있다면 먼저 오른쪽 패널에서 시도 상태를 확인합니다.',
        ]}
        nextAction="가운데 패널에서 대화를 만들었다면, 오른쪽 패널에서 토큰 사용량과 제출 기록을 확인합니다."
        width="min-w-[640px]"
      >
        <TutorialPreviewCenterPanel />
      </PanelPreviewSection>

      <PanelPreviewSection
        title="오른쪽 패널"
        intro="오른쪽 패널은 진행 상태를 확인하는 영역입니다. 점수, 토큰, 최근 시도 기록을 보면서 지금까지의 대화가 얼마나 효율적이었는지, 어떤 제출 결과가 있었는지 확인합니다."
        items={[
          '점수 영역은 해당 문제에서 얻을 수 있는 점수와 내 기록을 보여주는 역할을 합니다. 성공하더라도 토큰 사용량이나 조건에 따라 최종 점수가 달라질 수 있습니다.',
          '사용 토큰 영역은 현재 대화에서 소모한 토큰을 보여줍니다. 같은 목표를 달성하더라도 더 짧고 명확한 대화가 보통 더 효율적인 시도로 평가됩니다.',
          '최근 시도 목록은 제출했던 대화들을 성공, 실패, 미제출 상태로 구분해서 보여줍니다. 실패한 시도를 다시 열어보며 왜 부족했는지 확인할 수 있습니다.',
          '필터 드롭다운을 사용하면 전체, 성공, 실패, 미제출 기록을 나눠 볼 수 있습니다. 시도가 많아졌을 때 원하는 기록을 빠르게 찾는 데 사용합니다.',
          '튜토리얼의 첫 진입 상태에서는 아직 시도 기록이 비어 있습니다. 실제 챌린지에서는 대화 생성과 제출이 쌓일수록 이 영역이 채워집니다.',
        ]}
        steps={[
          '대화를 시작하기 전에는 최근 시도가 비어 있는 상태를 확인합니다.',
          '대화를 만들었지만 제출하지 않았다면 미제출 상태로 남는다고 이해합니다.',
          '제출 후 실패했다면 실패 카드의 요약을 보고 어떤 조건이 부족했는지 다시 확인합니다.',
          '제출 후 성공했다면 사용 토큰과 점수를 함께 보며 얼마나 효율적으로 풀었는지 확인합니다.',
        ]}
        cautions={[
          '미제출은 실패가 아닙니다. 아직 Judge AI에게 판정을 요청하지 않은 대화라는 뜻입니다.',
          '실패 기록은 버릴 기록이 아니라 다음 시도를 개선하기 위한 피드백입니다.',
          '토큰이 적다고 항상 좋은 시도는 아닙니다. 먼저 성공조건을 만족해야 하고, 그다음 효율을 봅니다.',
        ]}
        nextAction="오른쪽 패널에서 실패와 성공 기록을 비교하면, 다음 시도에서 무엇을 바꿔야 할지 더 빠르게 판단할 수 있습니다."
        width="flex min-w-[760px] justify-end gap-10"
      >
        <AttemptStateExamples />
        <TutorialPreviewRightPanel />
      </PanelPreviewSection>
    </>
  );
}

function ChallengeElementGuide() {
  return (
    <>
      <section className="space-y-4">
        <div className="border-b border-[#DDE3EA] pb-3">
          <h2 className="text-[22px] font-900 text-[#202832]">전체 화면</h2>
          <SectionDescription
            intro="전체 화면은 실제 챌린지를 진행할 때 보는 play 화면의 기본 구조입니다. 왼쪽에서 문제 조건을 읽고, 가운데에서 AI와 대화하고, 오른쪽에서 점수와 시도 기록을 확인하는 3단 구성으로 되어 있습니다."
            items={[
              '처음 진입하면 아직 대화가 시작되지 않은 상태이므로 가운데에는 대화 시작 안내가 보이고, 오른쪽 최근 시도 영역도 비어 있습니다.',
              '진행 순서는 보통 왼쪽 패널 확인, 가운데 패널에서 대화 시작, 조건을 만족했다고 판단되면 제출, 오른쪽 패널에서 결과 확인 순서로 이어집니다.',
              '화면의 세 영역은 서로 따로 움직이는 것이 아니라 하나의 문제 풀이 흐름을 나눠 보여줍니다. 왼쪽은 기준, 가운데는 실행, 오른쪽은 결과와 기록이라고 이해하면 됩니다.',
            ]}
            steps={[
              '전체 화면에서 왼쪽, 가운데, 오른쪽의 위치를 먼저 확인합니다.',
              '왼쪽 패널의 목표와 성공조건을 읽은 뒤, 가운데 입력창이 어디 있는지 확인합니다.',
              '오른쪽 패널에서 점수, 토큰, 최근 시도 영역의 위치를 확인합니다.',
              '아래 개별 패널 설명으로 내려가 각 영역을 따로 살펴봅니다.',
            ]}
            cautions={[
              '가운데 채팅창부터 바로 입력하기보다, 왼쪽 패널의 목표와 성공조건을 먼저 확인해야 풀이 방향이 흔들리지 않습니다.',
              '제출하기 전에 가운데 응답만 보지 말고, 오른쪽 패널의 토큰 사용량과 최근 시도 상태까지 함께 확인하는 습관을 들이는 것이 좋습니다.',
            ]}
          />
        </div>
        <ChallengePlayPreview />
        <p className="rounded-[10px] bg-[#202832] px-5 py-4 text-[15px] font-800 leading-[26px] text-white">
          먼저 전체 구조를 익힌 뒤, 아래의 왼쪽 패널부터 순서대로 읽어보세요.
        </p>
      </section>
      <ChallengePanelPreviews />
    </>
  );
}
function DefaultLearningGuide() {
  return (
    <>
      {learningSections.map(section => (
        <section key={section.title} className="space-y-3">
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
      ))}
    </>
  );
}

export default function Tutorial() {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const tutorial = TUTORIALS.find(item => item.id === Number(tutorialId)) ?? TUTORIALS[0];

  return (
    <div className="w-full bg-white pb-16">
      <button
        type="button"
        onClick={() => navigate('/tutorial')}
        className="mb-8 flex cursor-pointer items-center gap-2 rounded-[4px] px-2 py-2 text-[14px] font-800 text-[#66717E] transition hover:bg-[#F3F5F7] hover:text-[#FF4854]"
      >
        <ArrowLeft className="h-4 w-4" />
        튜토리얼 목록으로
      </button>

      <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <PathPreview tutorial={tutorial} />
        <div className="pt-1">
          <h1 className="text-[28px] font-900 leading-tight text-black">{tutorial.title}</h1>
          <p className="mt-3 text-[16px] font-600 leading-[24px] text-[#66717E]">
            {tutorial.subtitle}
          </p>
          <div className="mt-6 flex w-fit items-center divide-x divide-[#D8DDE4] text-[13px] text-[#2E3338]">
            <span className="whitespace-nowrap pr-4 font-700">
              성공 <em className="ml-1 not-italic text-[#FF4854]">{tutorial.successfulUsers}</em>명
            </span>
            <span className="whitespace-nowrap px-4 font-700">
              평균 <em className="mx-1 not-italic text-[#FF4854]">{tutorial.averageTokens}</em> 토큰
            </span>
            <span className="whitespace-nowrap px-4 font-500">{tutorial.price}</span>
            <span className="whitespace-nowrap pl-4">
              <span className="rounded-[4px] bg-[#3F454C] px-2 py-1 text-[12px] font-700 text-white">
                {tutorial.level}
              </span>
            </span>
          </div>
          <p className="mt-8 text-[15px] leading-[26px] text-[#3D4754]">{tutorial.description}</p>
          <p className="mt-2 text-[15px] font-800 leading-[26px] text-[#FF4854]">{tutorial.goal}</p>
        </div>
      </section>

      <div className="mt-8 border-b border-[#DDE3EA]">
        <div className="flex gap-8">
          <span className="border-b-2 border-[#FF4854] pb-3 text-[16px] font-800 text-[#2E3338]">
            학습 목표
          </span>
        </div>
      </div>

      <div className="mt-8">
        <main className="space-y-8">
          {tutorial.id === 7 ? <ChallengeElementGuide /> : <DefaultLearningGuide />}
        </main>
      </div>
    </div>
  );
}
