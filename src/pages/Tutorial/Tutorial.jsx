import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Flag } from 'lucide-react';
import TutorialImage from '@/assets/images/tutorial.png';
import TutorialElementImage from '@/assets/images/t1.png';
import TutorialChatTokenImage from '@/assets/images/t2.png';
import TutorialJudgeFailureImage from '@/assets/images/t3.png';
import TutorialJudgeSuccessImage from '@/assets/images/t4.png';
import {
  FailedJudgeModelPreview,
  SuccessJudgeModelPreview,
} from '@/pages/LandingPage/JudgeModelPreviews';
import { SectionTitle } from '@/pages/LandingPage/LandingPage.primitives';
import TokenInfoCard from '@/pages/Challenge/components/TokenInfoCard';
import {
  TutorialChatTokenInteractivePreview,
  TutorialJudgeFailureInteractivePreview,
  TutorialJudgeSuccessInteractivePreview,
  TutorialPreviewCenterPanel,
  TutorialPreviewLeftPanel,
  TutorialResetModalPreview,
  TutorialSubmitModalPreview,
} from './TutorialChallengePlayPreview';
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

const tutorialTabs = {
  7: [
    { key: 'goals', label: '학습 목표' },
    { key: 'overview', label: '전체 화면' },
    { key: 'challenge-overview', label: '챌린지 개요' },
    { key: 'challenge-history', label: '도전기록' },
    { key: 'chat', label: '채팅 영역' },
  ],
  8: [
    { key: 'goals', label: '학습 목표' },
    { key: 'chat', label: '채팅 영역' },
    { key: 'reset', label: '새 대화 시작' },
    { key: 'tokens', label: '토큰 확인' },
    { key: 'score', label: '점수 계산' },
    { key: 'practice', label: '직접 해보기' },
  ],
  9: [
    { key: 'goals', label: '학습 목표' },
    { key: 'submit', label: '제출 확인' },
    { key: 'result', label: '실패 모달' },
    { key: 'practice', label: '직접 제출하기' },
  ],
  10: [
    { key: 'goals', label: '학습 목표' },
    { key: 'result', label: '성공 모달' },
    { key: 'practice', label: '직접 제출하기' },
  ],
};

const tutorialTabSummaries = {
  7: {
    overview: '챌린지 Play 화면의 전체 구조와 정보·채팅 영역의 배치를 확인합니다.',
    'challenge-overview': '챌린지 설명과 도전목표, 성공·실패 조건을 확인합니다.',
    'challenge-history': '이전 시도의 제출 상태와 판정 결과를 확인하는 방법을 익힙니다.',
    chat: '프롬프트 입력창과 전송·제출 버튼의 역할을 구분합니다.',
  },
  8: {
    chat: 'AI와 대화를 시작하고 응답을 바탕으로 다음 프롬프트를 작성합니다.',
    reset: '진행 중인 대화를 초기화하고 새로운 시도를 시작하는 방법을 확인합니다.',
    tokens: '대화가 늘어날 때 사용 토큰이 어떻게 달라지는지 확인합니다.',
    score: '사용 토큰이 최종 점수에 반영되는 방식을 예시로 알아봅니다.',
    practice: '프롬프트를 직접 입력하며 채팅과 토큰 변화를 함께 연습합니다.',
  },
  9: {
    submit: '현재 대화를 Judge 평가에 제출하기 전 확인해야 할 내용을 살펴봅니다.',
    result: '실패 모달의 판정과 Judge 피드백을 읽는 방법을 살펴봅니다.',
    practice: '응답을 직접 제출하고 실패 결과가 표시되는 전체 흐름을 연습합니다.',
  },
  10: {
    result: '성공 모달의 최종 판정과 획득 결과를 확인합니다.',
    practice: '응답을 직접 제출하고 성공 결과가 표시되는 전체 흐름을 연습합니다.',
  },
};

function TutorialGoalRoadmap({ tutorialId, onTabChange }) {
  const steps = (tutorialTabs[tutorialId] ?? []).filter(tab => tab.key !== 'goals');

  return (
    <div className="mt-10 max-w-[900px]">
      <h3 className="text-card-title font-bold text-[#202832]">이 튜토리얼에서 살펴볼 내용</h3>
      <div className="mt-4 border-y border-[#E1E6EB]">
        {steps.map((tab, index) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className="group grid w-full cursor-pointer grid-cols-[36px_minmax(0,1fr)_28px] items-center gap-4 border-b border-[#E1E6EB] px-2 py-5 text-left transition-colors last:border-b-0 hover:bg-[#FAFBFC] sm:px-4"
          >
            <span className="text-body font-bold text-[#FF4854]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0">
              <strong className="block text-body-lg font-bold text-[#202832]">{tab.label}</strong>
              <span className="mt-1 block text-body-lg font-medium text-[#4D5968]">
                {tutorialTabSummaries[tutorialId]?.[tab.key]}
              </span>
            </span>
            <ChevronRight
              className="h-6 w-6 text-[#848A91] transition-transform group-hover:translate-x-1 group-hover:text-[#FF4854]"
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function TutorialTabNavigation({ tabs, activeTab, onChange }) {
  return (
    <div className="mt-10 border-b border-[#DDE3EA]">
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto"
        role="tablist"
        aria-label="튜토리얼 목차"
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={`relative shrink-0 cursor-pointer rounded-t-[8px] px-4 pb-4 pt-2 text-body-lg font-strong transition-all focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#FF4854] ${
                isActive
                  ? 'text-[#202832]'
                  : 'text-[#8A93A1] hover:-translate-y-0.5 hover:text-[#4A5565]'
              }`}
            >
              {tab.label}
              {isActive ? (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#FF4854]" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PathPreview({ tutorial }) {
  const previewImage =
    tutorial.id === 7
      ? TutorialElementImage
      : tutorial.id === 8
        ? TutorialChatTokenImage
        : tutorial.id === 9
          ? TutorialJudgeFailureImage
          : tutorial.id === 10
            ? TutorialJudgeSuccessImage
            : TutorialImage;

  return (
    <div className="h-[210px] overflow-hidden rounded-[4px] bg-[#12070A]">
      <img src={previewImage} alt={tutorial.title} className="h-full w-full object-cover" />
    </div>
  );
}

function ChallengePlayPreview() {
  const previewWidth = 1440;
  const previewHeight = 900;
  const previewScale = 0.66;
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

function TutorialBodyText({ children }) {
  return <span className="text-body-lg font-medium text-[#4D5968]">{children}</span>;
}

function SectionDescription({ items = [], steps = [], showSteps = false }) {
  const supportingCopy = items[0];
  const visibleSteps = steps.slice(0, 3);

  return (
    <div>
      {!showSteps && supportingCopy ? (
        <p className="max-w-lg text-body-lg font-medium text-[#4D5968]">{supportingCopy}</p>
      ) : null}
      {showSteps && visibleSteps.length ? (
        <div>
          <ol className="max-w-lg list-decimal space-y-3 pl-5 text-body-lg font-medium text-[#4D5968]">
            {visibleSteps.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
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
  children,
  width = 'w-full',
  height = 'h-[660px]',
  stacked = false,
}) {
  const showSteps = title.includes('직접');
  const preview = (
    <div
      className={`no-scrollbar max-w-full overflow-x-auto rounded-[16px] bg-[#E2E5E9] p-6 ${
        stacked ? 'w-full' : 'w-fit'
      }`}
    >
      <div className={`${height} overflow-hidden ${width}`}>
        <div className="h-[116.28%] w-[116.28%] origin-top-left scale-[0.86]">{children}</div>
      </div>
    </div>
  );
  const description = (
    <div className={`${stacked ? 'max-w-[860px]' : 'py-2 lg:sticky lg:top-8'} flex flex-col gap-6`}>
      <div className="max-w-xl space-y-4">
        <SectionTitle
          eyebrow=""
          title={title}
          desc={<TutorialBodyText>{intro}</TutorialBodyText>}
        />
      </div>
      <SectionDescription items={items} steps={steps} showSteps={showSteps} />
    </div>
  );

  if (stacked) {
    return (
      <section className="space-y-8">
        {description}
        {preview}
      </section>
    );
  }

  return (
    <section>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)] lg:gap-12">
        {preview}
        {description}
      </div>
    </section>
  );
}

const CHAT_TOKEN_MESSAGES = [
  {
    id: 'chat-token-user-1',
    role: 'user',
    content: '문제의 목표 조건을 만족하려면 어떤 정보를 먼저 확인해야 할까요?',
  },
  {
    id: 'chat-token-assistant-1',
    role: 'assistant',
    content:
      '먼저 챌린지 정보 영역의 목표와 성공조건을 확인한 뒤, 그 조건을 기준으로 프롬프트를 구체화하는 것이 좋습니다.',
  },
];

function ChallengePanelPreviews({ activeTab }) {
  return (
    <>
      {activeTab === 'challenge-overview' ? (
        <PanelPreviewSection
          title="챌린지 개요"
          intro={
            <>
              챌린지 개요에는 문제를 시작하기 전에 알아야 할 정보가 정리되어 있습니다.
              <br />
              챌린지 설명과 도전목표를 읽고, 성공조건과 실패조건을 비교하면 대화의 방향을 빠르게
              잡을 수 있습니다.
            </>
          }
          items={[
            <React.Fragment key="challenge-overview-copy">
              위에서 아래로 문제의 배경과 목표를 먼저 읽고, 성공조건과 실패조건을 서로 비교해보세요.
              <br />
              확인한 조건은 대화의 방향을 정하고 제출 여부를 판단하는 체크리스트로 활용할 수
              있습니다.
            </React.Fragment>,
            '챌린지 개요에는 챌린지 설명, 도전목표, 성공조건, 실패조건이 순서대로 표시됩니다.',
            '목표 항목은 AI에게서 어떤 결과를 받아내야 하는지 알려줍니다. 프롬프트를 작성할 때는 이 목표 문장을 계속 기준점으로 삼아야 합니다.',
            '성공조건과 실패조건은 제출 전 체크리스트 역할을 합니다. AI가 그럴듯하게 답해도 성공조건에 필요한 핵심 내용이 없으면 실패할 수 있습니다.',
            'API형 문제에서는 설명 항목 하단에 API 정보가 함께 표시될 수 있습니다. URL, Method, Header, API Key 같은 값은 외부 요청을 구성할 때 필요한 재료입니다.',
          ]}
          steps={[
            '챌린지 개요에서 문제의 배경과 목표를 읽어봅니다.',
            '성공조건과 실패조건을 비교하며 제출 기준을 확인합니다.',
          ]}
          cautions={[
            '문제 설명만 읽고 바로 대화를 시작하면 성공조건을 놓칠 수 있습니다.',
            'AI가 긴 답변을 했다고 해서 성공은 아닙니다. 성공조건에 필요한 핵심 문장이 있는지 확인해야 합니다.',
            'API 정보는 모든 문제에 항상 필요한 것은 아닙니다. API형 문제일 때만 요청 구성에 사용합니다.',
          ]}
          nextAction="챌린지 개요를 확인했다면, 도전기록에서 이전 시도의 판정 결과를 살펴봅니다."
          width="min-w-[340px]"
        >
          <TutorialPreviewLeftPanel initialActiveTab="overview" lockActiveTab />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'challenge-history' ? (
        <PanelPreviewSection
          title="도전기록"
          intro={
            <>
              도전기록에는 지금까지 진행한 대화가 시도 단위로 쌓입니다.
              <br />
              제출 전인 대화와 실패하거나 성공한 시도를 구분하고, 원하는 기록을 선택해 당시 대화를
              다시 확인할 수 있습니다.
            </>
          }
          items={[
            <React.Fragment key="challenge-history-copy">
              최신 시도는 목록 위쪽에 표시되며 각 기록에서 제출 전·실패·성공 상태를 구분할 수
              있습니다.
              <br />
              기록을 선택하면 당시 대화와 판정 근거를 다시 살펴보고 다음 시도의 개선점으로 활용할 수
              있습니다.
            </React.Fragment>,
          ]}
          steps={[
            '제출 전, 실패, 성공 상태가 어떻게 구분되는지 확인합니다.',
            '각 기록에 표시된 시도 번호와 대화 요약을 살펴봅니다.',
          ]}
          cautions={[
            '도전기록을 선택해도 새로운 시도가 만들어지지는 않습니다.',
            '아직 제출하지 않은 기록에는 성공이나 실패 판정이 표시되지 않습니다.',
          ]}
          nextAction="이전 시도의 흐름을 확인했다면, 채팅 영역에서 새로운 프롬프트를 작성해봅니다."
          width="min-w-[340px]"
        >
          <TutorialPreviewLeftPanel initialActiveTab="history" lockActiveTab />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'chat' ? (
        <PanelPreviewSection
          title="채팅 영역"
          intro={
            <>
              채팅 영역은 프롬프트를 입력하고 AI 응답을 확인하는 작업 공간입니다.
              <br />
              입력창과 전송 버튼, 새 대화 시작과 제출 버튼이 어떤 역할을 하는지 먼저 살펴봅니다.
            </>
          }
          items={[
            <React.Fragment key="challenge-chat-copy">
              전송은 작성한 프롬프트를 AI에게 보내 대화를 이어가는 동작이고, 제출은 현재까지의
              대화를 Judge 평가에 전달하는 동작입니다.
              <br />두 버튼의 역할과 사용하는 시점을 구분해두면 실수 없이 챌린지를 진행할 수
              있습니다.
            </React.Fragment>,
            '화면 아래에는 프롬프트를 작성하는 입력창이 있습니다. 실제 입력 방법과 토큰 변화는 다음 튜토리얼에서 더 자세히 다룹니다.',
            '대화가 시작되면 사용자 메시지와 AI 응답이 채팅 영역에 순서대로 쌓입니다.',
            '입력창 아래에는 새로운 대화 시작 버튼과 제출하기 버튼이 있습니다. 하나는 대화를 다시 시작하는 버튼이고, 하나는 판정을 요청하는 버튼입니다.',
            '구성요소 단계에서는 버튼을 바로 사용하는 것보다, 각 버튼이 어느 위치에 있고 어떤 역할인지 알아두는 것이 핵심입니다.',
          ]}
          steps={[
            '아래 프리뷰의 입력창을 클릭하고 짧은 문장을 직접 입력해봅니다.',
            '전송 버튼, 새로운 대화 시작 버튼, 제출하기 버튼이 각각 어느 위치에 있는지 손으로 따라가 봅니다.',
            '입력창에 글자가 있을 때 전송 버튼이 어떻게 보이는지 확인합니다.',
            '자세한 전송 흐름은 다음 튜토리얼인 채팅과 토큰에서 직접 연습합니다.',
          ]}
          cautions={[
            '전송 버튼과 제출하기 버튼은 서로 다른 행동입니다. 전송은 대화이고, 제출하기는 판정 요청입니다.',
            '구성요소 튜토리얼에서는 프롬프트를 잘 쓰는 법보다 화면 구조를 익히는 데 집중합니다.',
            '새로운 대화 시작은 현재 대화 흐름을 초기화하는 버튼이므로 실제 챌린지에서는 신중하게 사용해야 합니다.',
          ]}
          nextAction="채팅 영역의 구성까지 확인했다면, 다음 튜토리얼에서 메시지를 직접 보내며 대화 흐름을 연습합니다."
          width="min-w-[640px]"
          stacked
        >
          <TutorialPreviewCenterPanel />
        </PanelPreviewSection>
      ) : null}
    </>
  );
}

function ChatTokenGuide({ activeTab, onTabChange }) {
  return (
    <>
      {activeTab === 'goals' ? (
        <section>
          <h2 className="text-page-title font-bold text-[#202832]">학습 목표</h2>
          <div className="mt-4 max-w-[760px] space-y-3 text-body-lg font-medium text-[#4D5968]">
            <p>
              프롬프트를 입력하고 AI 응답을 확인하며 대화를 이어가는 기본 흐름을 익힙니다.
              <br />
              전송과 제출의 차이를 이해하고, 상황에 맞게 대화를 다시 시작하는 방법도 살펴봅니다.
            </p>
            <p>
              대화가 길어질 때 사용 토큰이 어떻게 달라지는지 확인하고,
              <br />
              성공 가능성과 토큰 효율을 함께 고려하는 감각을 익힙니다.
            </p>
          </div>
          <TutorialGoalRoadmap tutorialId={8} onTabChange={onTabChange} />
        </section>
      ) : null}

      {activeTab === 'chat' ? (
        <PanelPreviewSection
          title="채팅 영역"
          intro={
            <>
              채팅 영역에는 사용자 메시지와 AI 응답이 시간 순서대로 쌓입니다.
              <br />
              예시 대화를 보며 응답을 읽고 다음 프롬프트를 보완하는 흐름을 살펴봅니다.
            </>
          }
          items={[
            <React.Fragment key="chat-token-chat-copy">
              사용자 메시지를 보낸 뒤에는 AI 응답에서 목표에 가까운 내용과 빠진 조건을 나누어
              확인해보세요.
              <br />
              부족한 부분만 다음 프롬프트로 구체화하면 불필요한 반복을 줄이면서 대화를 이어갈 수
              있습니다.
            </React.Fragment>,
            'Shift + Enter를 사용하면 메시지를 전송하지 않고 줄바꿈할 수 있습니다. 조건을 여러 줄로 정리하거나 요청을 단계별로 나눠 쓸 때 유용합니다.',
            '대화 영역에는 사용자 메시지와 AI 응답이 시간 순서대로 표시됩니다. 이전 응답에서 부족한 부분을 찾고 다음 입력에서 보완하는 방식으로 진행합니다.',
            '새로운 대화 시작은 현재 흐름을 버리고 처음부터 다시 시도할 때 사용합니다. 접근법을 크게 바꾸고 싶을 때 선택하면 됩니다.',
            '제출하기는 현재 대화가 목표 조건을 만족한다고 판단될 때 누릅니다. 채팅 입력과 제출은 다른 행동이므로, 응답을 충분히 확인한 뒤 제출해야 합니다.',
          ]}
          steps={[
            '입력창에 문제 목표를 기준으로 첫 프롬프트를 작성합니다.',
            '전송 버튼이 활성화되는지 확인한 뒤 메시지를 보냅니다.',
            'AI 응답에서 목표에 가까운 부분과 부족한 부분을 나눠 읽습니다.',
            '부족한 내용을 다음 프롬프트에 반영해 대화를 이어갑니다.',
          ]}
          cautions={[
            '전송 버튼을 누르는 것은 Judge AI에게 제출하는 것이 아닙니다. 전송은 AI와 대화하는 행동이고, 제출하기는 판정을 요청하는 행동입니다.',
            '긴 프롬프트가 항상 좋은 것은 아닙니다. 조건을 분명히 쓰되 불필요한 설명을 줄이면 토큰을 더 효율적으로 사용할 수 있습니다.',
            'AI 응답이 마음에 들지 않을 때 같은 문장을 반복하기보다, 어떤 부분이 부족한지 짚어서 다음 프롬프트를 작성하는 편이 좋습니다.',
          ]}
          nextAction="채팅 영역에서 대화를 만들었다면, 챌린지 정보 영역 하단에서 사용 토큰이 어떻게 바뀌는지 확인합니다."
          width="min-w-[640px]"
          stacked
        >
          <TutorialPreviewCenterPanel messages={CHAT_TOKEN_MESSAGES} />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'reset' ? (
        <PanelPreviewSection
          title="새 대화 시작"
          intro={
            <>
              새로운 대화 시작 버튼을 누르면 현재 대화를 초기화할지 확인하는 모달이 표시됩니다.
              <br />
              확인하면 작성 중인 입력과 지금까지의 메시지가 사라지고 처음부터 다시 시도하게 됩니다.
            </>
          }
          items={[
            <React.Fragment key="reset-copy">
              새 대화를 시작하기 전에는 현재 응답에서 다시 활용할 내용이 없는지 먼저 확인해보세요.
              <br />
              초기화를 확정하면 진행 중인 대화 맥락을 이어갈 수 없으므로, 기존 접근을 버리고
              처음부터 시도할 때 사용하는 것이 좋습니다.
            </React.Fragment>,
          ]}
          width="min-w-[520px]"
        >
          <TutorialResetModalPreview />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'tokens' ? (
        <PanelPreviewSection
          title="사용 토큰 확인"
          intro={
            <>
              튜토리얼의 사용 토큰은 전송된 사용자 메시지의 양을 보여줍니다.
              <br />
              프롬프트를 여러 번 보내거나 더 길게 작성할수록 값이 늘어나므로, 목표 달성과 토큰
              효율을 함께 확인해야 합니다.
            </>
          }
          items={[
            <React.Fragment key="token-copy">
              작성 중인 문장과 AI 응답은 튜토리얼 토큰에 포함되지 않고, 전송을 완료한 사용자
              메시지만 누적됩니다.
              <br />
              값은 왼쪽 정보 패널 하단의 토큰 카드에서 확인할 수 있습니다.
            </React.Fragment>,
            '첫 대화를 시작한 뒤에는 채팅 응답을 읽고, 왼쪽 하단의 토큰 숫자가 갱신되는 위치를 함께 확인합니다.',
            '토큰 숫자는 효율을 보는 기준입니다. 같은 성공 결과라면 더 적은 토큰으로 목표를 달성한 시도가 더 좋은 풀이가 될 수 있습니다.',
            '제출 전에는 토큰 숫자만 보지 말고, 응답이 목표와 성공조건을 만족하는지도 함께 확인해야 합니다.',
            '토큰을 줄이려면 문제 조건을 먼저 읽고, 질문을 명확하게 작성하고, 응답을 보고 필요한 부분만 이어서 요청하는 습관이 중요합니다.',
          ]}
          steps={[
            '채팅 영역에서 메시지를 한 번 보낸 뒤 사용한 토큰 숫자를 확인합니다.',
            '사용자 메시지를 추가로 전송할수록 토큰이 함께 늘어난다는 점을 관찰합니다.',
            '토큰 카드가 챌린지 정보 영역 하단에 있다는 점을 기억합니다.',
            '다음 프롬프트를 작성할 때 불필요한 반복을 줄여 토큰 사용을 관리합니다.',
          ]}
          cautions={[
            '토큰을 아끼려고 너무 짧게만 쓰면 목표 조건을 놓칠 수 있습니다. 먼저 성공 가능성을 확보한 뒤 표현을 다듬는 순서가 좋습니다.',
            '사용 토큰 숫자만 보고 판단하지 말고, 채팅 영역의 응답이 실제로 성공조건을 만족하는지도 함께 확인해야 합니다.',
            '전송은 대화를 이어가는 행동이고, 제출하기는 Judge 평가를 요청하는 행동입니다.',
          ]}
          nextAction="사용 토큰 위치를 확인했다면, 이어서 토큰이 점수에 어떻게 반영되는지 계산 예시를 살펴봅니다."
          width="min-w-[420px]"
          height="h-[94px]"
        >
          <TokenInfoCard problemId="tutorial-problem" tokenUsed={184} />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'score' ? (
        <section className="mt-8 space-y-5 rounded-[18px] border border-[#E5E9EF] bg-white p-8">
          <div className="max-w-xl">
            <SectionTitle
              eyebrow=""
              title="점수 계산 예시"
              desc={
                <TutorialBodyText>
                  아래 계산은 총 150점, 토큰 기준 3000인 챌린지를 가정한 예시입니다.
                  <br />
                  먼저 성공조건을 만족한 뒤 토큰 사용량을 줄이면 더 높은 점수를 받을 수 있습니다.
                </TutorialBodyText>
              }
            />
            <p className="mt-6 text-body-lg font-medium text-[#4D5968]">
              성공한 시도는 기본 점수에 토큰 효율 점수가 더해집니다.
              <br />
              같은 결과를 얻었다면 사용 토큰이 적을수록 높은 점수를 받을 수 있으므로, 조건을
              빠뜨리지 않는 범위에서 프롬프트를 간결하게 다듬어보세요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[12px] bg-[#F7F9FC] p-5">
              <p className="text-label font-bold text-[#66717E]">토큰 점수 공식</p>
              <p className="text-card-title font-bold text-[#202832]">
                토큰 점수 = (3000 - 사용 토큰) / 3000 * 75
              </p>
            </div>
            <div className="rounded-[12px] bg-[#202832] p-5 text-white">
              <p className="text-label font-bold text-white/60">1000 토큰 사용 시</p>
              <p className="mt-2 text-section-title font-bold">
                75점 + 50점 = <span className="text-[#FF6973]">125점</span>
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'practice' ? (
        <PanelPreviewSection
          title="직접 입력해보기"
          intro={
            <>
              프리뷰에 프롬프트를 직접 입력하고 AI 응답을 받아보세요.
              <br />
              사용자 메시지를 전송할 때마다 왼쪽 정보 패널의 토큰 숫자가 어떻게 달라지는지 함께
              확인할 수 있습니다.
            </>
          }
          items={[
            '입력창에 작성 중인 문장은 토큰 숫자에 반영되지 않으며, 전송을 완료한 사용자 메시지만 누적됩니다. 짧은 메시지와 긴 메시지를 차례로 보내며 토큰 증가 폭이 어떻게 달라지는지 비교해보세요.',
            '전송 버튼을 누르면 사용자 메시지가 토큰 숫자에 누적되고 AI 예시 응답이 채팅 영역에 표시됩니다.',
            '새로운 대화 시작 버튼을 누르면 튜토리얼 프리뷰의 채팅과 토큰 숫자가 다시 초기 상태로 돌아갑니다.',
            '이 프리뷰는 토큰 흐름을 익히기 위한 프론트 계산 예시입니다. 실제 챌린지에서는 서버에서 계산된 토큰 사용량이 표시됩니다.',
          ]}
          steps={[
            '입력창에 짧은 프롬프트를 작성한 뒤 전송하여 토큰 숫자가 변하는지 확인합니다.',
            '전송 버튼을 눌러 사용자 메시지와 토큰이 함께 누적되는 흐름을 봅니다.',
            '조금 더 긴 프롬프트를 전송해 토큰 숫자가 더 크게 늘어나는지 비교합니다.',
            '새로운 대화 시작으로 초기화한 뒤 다시 입력해봅니다.',
          ]}
          cautions={[
            '토큰 숫자는 전송된 사용자 메시지의 글자 수를 바탕으로 한 학습용 추정값입니다. 실제 판정 환경의 토큰 계산과 완전히 같지는 않을 수 있습니다.',
            '튜토리얼과 실제 챌린지 모두 메시지를 전송한 후 토큰 값이 계산되어 적용됩니다.',
          ]}
          nextAction="직접 입력해보며 토큰 변화가 보였다면, 다음 튜토리얼에서 제출 후 실패가 어떻게 표시되는지 살펴봅니다."
          width="min-w-[980px]"
          stacked
        >
          <TutorialChatTokenInteractivePreview />
        </PanelPreviewSection>
      ) : null}
    </>
  );
}

function JudgeFailureGuide({ activeTab, onTabChange }) {
  return (
    <>
      {activeTab === 'goals' ? (
        <section>
          <h2 className="text-page-title font-bold text-[#202832]">학습 목표</h2>
          <div className="mt-4 max-w-[760px] space-y-3 text-body-lg font-medium text-[#4D5968]">
            <p>
              제출한 응답이 실패로 판정되는 과정과 실패 모달의 구성을 살펴봅니다.
              <br />
              여러 Judge Model의 판단에서 반복되는 피드백을 찾는 방법을 익힙니다.
            </p>
            <p>
              실패를 단순한 종료 상태가 아닌 다음 프롬프트를 개선하는 근거로 활용하고,
              <br />
              부족했던 조건을 다음 시도에 반영하는 흐름을 연습합니다.
            </p>
          </div>
          <TutorialGoalRoadmap tutorialId={9} onTabChange={onTabChange} />
        </section>
      ) : null}

      {activeTab === 'submit' ? (
        <PanelPreviewSection
          title="제출 확인"
          intro={
            <>
              제출하기 버튼을 누르면 현재 대화를 Judge 평가에 전달할지 확인하는 모달이 표시됩니다.
              <br />
              제출하면 3개의 Judge AI가 대화 전체를 읽고 성공 여부를 판단합니다.
            </>
          }
          items={[
            <React.Fragment key="submit-copy">
              제출 전에는 AI의 마지막 응답만 보지 말고 현재 대화 전체가 목표와 성공조건을 만족하는지
              확인하세요.
              <br />
              제출 후에는 일정 시간 다시 평가를 요청할 수 없으므로, 빠진 조건이 있다면 먼저 대화를
              보완하는 것이 좋습니다.
            </React.Fragment>,
          ]}
          width="min-w-[520px]"
        >
          <TutorialSubmitModalPreview />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'result' ? (
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12">
          <div className="flex flex-col gap-6 lg:pr-6">
            <div className="max-w-xl space-y-4">
              <SectionTitle
                eyebrow=""
                title="실패 판정은 어떻게 보이나요?"
                desc={
                  <TutorialBodyText>
                    실패 모달은 제출한 대화가 문제의 목표와 <br />
                    성공조건을 충분히 만족하지 못했을 때 표시됩니다.
                    <br />
                    각 Judge Model의 판정과 설명을 함께 보여줘서 <br />
                    어떤 조건이 부족했는지 확인할 수 있습니다.
                  </TutorialBodyText>
                }
              />
            </div>
            <div className="max-w-lg text-body-lg font-medium text-[#4D5968]">
              여러 Judge가 반복해서 지적한 내용을 먼저 찾고, <br />
              다음 프롬프트에서 해당 조건을 명확하게 보완해보세요.
            </div>
          </div>
          <div className="mt-8 lg:mt-12">
            <FailedJudgeModelPreview surface="gray" />
          </div>
        </section>
      ) : null}

      {activeTab === 'practice' ? (
        <PanelPreviewSection
          title="직접 제출해보기"
          intro={
            <>
              프롬프트를 보내 AI 응답을 받은 뒤 현재 대화를 제출해보세요.
              <br />이 실습은 실패 결과의 흐름을 익히기 위해 제출 후 항상 실패 모달을 표시합니다.
            </>
          }
          items={[
            '입력창에 프롬프트를 작성하고 전송하면 1초 동안 응답 생성중 상태가 표시됩니다.',
            'AI 예시 응답이 나타난 뒤 제출하기 버튼이 활성화됩니다.',
            '제출하기를 누르면 로딩 모달이 먼저 표시되고, 잠시 뒤 실제 실패 모달 컴포넌트가 프리뷰 안에 표시됩니다.',
            '실패 모달의 설명을 읽고 다음 프롬프트에서 무엇을 보완해야 할지 생각해보는 것이 핵심입니다.',
          ]}
          steps={[
            '입력창에 프롬프트를 작성해 전송하고 AI 응답을 기다립니다.',
            '응답이 표시되면 제출하기 버튼을 눌러 Judge 평가를 요청합니다.',
            '로딩 후 나타나는 실패 모달에서 판정과 실패 사유를 확인합니다.',
          ]}
          cautions={[
            '이 실습은 실패 흐름을 익히기 위한 튜토리얼이므로 어떤 프롬프트를 입력해도 실패 모달이 뜹니다.',
            '실제 챌린지에서는 실패 사유가 현재 대화 내용과 문제의 성공조건을 기준으로 달라집니다.',
            '실패 후 바로 다시 제출하기보다, 실패 사유를 읽고 프롬프트를 수정하는 습관을 들이는 것이 좋습니다.',
          ]}
          nextAction="실패 모달까지 확인했다면, 다음 튜토리얼에서 성공 조건을 만족했을 때 어떤 화면이 나오는지 살펴봅니다."
          width="min-w-[640px]"
          stacked
        >
          <TutorialJudgeFailureInteractivePreview />
        </PanelPreviewSection>
      ) : null}
    </>
  );
}

function JudgeSuccessGuide({ activeTab, onTabChange }) {
  return (
    <>
      {activeTab === 'goals' ? (
        <section>
          <h2 className="text-page-title font-bold text-[#202832]">학습 목표</h2>
          <div className="mt-4 max-w-[760px] space-y-3 text-body-lg font-medium text-[#4D5968]">
            <p>
              제출한 응답이 Judge Model의 평가를 통과해 성공으로 판정되는 흐름을 살펴봅니다.
              <br />
              성공 모달에 표시되는 결과와 이후 선택할 수 있는 행동을 확인합니다.
            </p>
            <p>
              성공 여부뿐 아니라 사용 토큰과 점수까지 함께 확인하고,
              <br />
              같은 성공 결과를 더 효율적으로 만드는 방법을 생각해봅니다.
            </p>
          </div>
          <TutorialGoalRoadmap tutorialId={10} onTabChange={onTabChange} />
        </section>
      ) : null}

      {activeTab === 'result' ? (
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-12">
          <div className="mt-8 lg:mt-12">
            <SuccessJudgeModelPreview surface="gray" />
          </div>
          <div className="flex flex-col gap-6 lg:pl-6">
            <div className="max-w-xl space-y-4">
              <SectionTitle
                eyebrow=""
                title="성공 판정은 어떻게 보이나요?"
                desc={
                  <TutorialBodyText>
                    성공 모달은 제출한 대화가 문제의 목표와 <br />
                    성공조건을 충족했을 때 표시됩니다.
                    <br />
                    3개의 Judge Model 중 2개 이상이 성공으로 판단하면 <br />
                    최종 성공 결과를 확인할 수 있습니다.
                  </TutorialBodyText>
                }
              />
            </div>
            <div className="max-w-lg text-body-lg font-medium text-[#4D5968]">
              성공 후에는 사용 토큰과 점수를 함께 확인하고, <br />더 적은 토큰으로 같은 결과를 만들
              수 있는지 돌아보세요.
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'practice' ? (
        <PanelPreviewSection
          title="직접 제출해보기"
          intro={
            <>
              프롬프트를 보내 AI 응답을 받은 뒤 현재 대화를 제출해보세요.
              <br />이 실습은 성공 결과의 흐름을 익히기 위해 제출 후 항상 성공 모달을 표시합니다.
            </>
          }
          items={[
            '입력창에 프롬프트를 작성하고 전송하면 1초 동안 응답 생성중 상태가 표시됩니다.',
            'AI 예시 응답이 나타난 뒤 제출하기 버튼이 활성화됩니다.',
            '제출하기를 누르면 로딩 모달이 먼저 표시되고, 잠시 뒤 실제 성공 모달 컴포넌트가 프리뷰 안에 표시됩니다.',
            '성공 모달이 뜨면 채팅 응답이 Judge 평가를 통과한 결과라고 이해하면 됩니다.',
          ]}
          steps={[
            '입력창에 프롬프트를 작성해 전송하고 AI 응답을 기다립니다.',
            '응답이 표시되면 제출하기 버튼을 눌러 Judge 평가를 요청합니다.',
            '로딩 후 나타나는 성공 모달에서 최종 판정 안내를 확인합니다.',
          ]}
          cautions={[
            '이 실습은 성공 흐름을 익히기 위한 튜토리얼이므로 어떤 프롬프트를 입력해도 성공 모달이 뜹니다.',
            '실제 챌린지에서는 성공 여부가 현재 대화 내용과 문제의 성공조건을 기준으로 달라집니다.',
            '성공 후에도 토큰을 줄여 더 높은 점수를 노릴 수 있다는 점을 기억하면 좋습니다.',
          ]}
          nextAction="성공 모달까지 확인했다면, 마지막 실전 연습에서 지금까지 익힌 전체 흐름을 이어서 사용합니다."
          width="min-w-[640px]"
          stacked
        >
          <TutorialJudgeSuccessInteractivePreview />
        </PanelPreviewSection>
      ) : null}
    </>
  );
}

function ChallengeElementGuide({ activeTab, onTabChange }) {
  return (
    <>
      {activeTab === 'goals' ? (
        <section>
          <h2 className="text-page-title font-bold text-[#202832]">학습 목표</h2>
          <div className="mt-4 max-w-[760px] space-y-3 text-body-lg font-medium text-[#4D5968]">
            <p>
              챌린지 화면을 이루는 주요 영역과 각 구성요소의 역할을 익힙니다. <br />
              문제 정보를 확인하는 곳과 AI에게 프롬프트를 입력하는 곳을 구분해 살펴봅니다.
            </p>
            <p>
              목표와 성공조건을 읽고 대화를 시작한 뒤, <br />
              사용 토큰을 확인하고 결과를 제출하는 전체 흐름을 이해합니다.
            </p>
          </div>
          <TutorialGoalRoadmap tutorialId={7} onTabChange={onTabChange} />
        </section>
      ) : null}
      {activeTab === 'overview' ? (
        <section className="space-y-8">
          <div className="flex max-w-[860px] flex-col gap-6">
            <div className="max-w-xl">
              <SectionTitle
                eyebrow=""
                title="전체 화면"
                desc={
                  <TutorialBodyText>
                    전체 화면은 챌린지의 조건을 확인하고 AI와 대화를 진행하는 작업 공간입니다.
                    <br />
                    왼쪽에는 문제 정보와 사용 토큰이, 오른쪽에는 채팅과 제출 기능이 배치됩니다.
                  </TutorialBodyText>
                }
              />
            </div>
            <p className="max-w-lg text-body-lg font-medium text-[#4D5968]">
              목표와 성공조건을 먼저 읽은 뒤 대화를 시작하면 <br />
              전체 풀이 흐름을 놓치지 않을 수 있습니다. <br />
              대화 중에는 왼쪽에서 조건과 토큰을 다시 확인하고, <br />
              오른쪽에서 응답을 보완한 뒤 제출하는 순서로 진행해보세요.
            </p>
          </div>
          <ChallengePlayPreview />
        </section>
      ) : null}
      <ChallengePanelPreviews activeTab={activeTab} />
    </>
  );
}

function DefaultLearningGuide({ activeTab }) {
  const selectedIndex = Number(activeTab.replace('section-', '')) || 0;
  const selectedSection = learningSections[selectedIndex] ?? learningSections[0];

  return (
    <section className="rounded-[18px] border border-[#E5E9EF] bg-[#F8FAFC] p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] lg:p-10">
      <h2 className="text-page-title font-bold text-[#202832]">{selectedSection.title}</h2>
      <ul className="mt-6 space-y-3 text-body-lg font-medium text-[#4D5968]">
        {selectedSection.items.slice(0, 3).map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function Tutorial() {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const tutorial = TUTORIALS.find(item => item.id === Number(tutorialId)) ?? TUTORIALS[0];
  const tutorialStep = TUTORIALS.findIndex(item => item.id === tutorial.id) + 1;
  const tabs =
    tutorialTabs[tutorial.id] ??
    learningSections.map((section, index) => ({
      key: `section-${index}`,
      label: section.title,
    }));
  const firstTabKey = tabs[0].key;
  const [activeTab, setActiveTab] = useState(firstTabKey);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setActiveTab(firstTabKey);
  }, [firstTabKey, tutorialId]);

  const handleTabChange = tabKey => {
    setActiveTab(tabKey);
    window.requestAnimationFrame(() => {
      document
        .getElementById('tutorial-tab-content')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="w-full bg-white pb-16">
      <button
        type="button"
        onClick={() => navigate('/tutorial')}
        className="btn btn-ghost btn-sm mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        튜토리얼 목록으로
      </button>

      <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <PathPreview tutorial={tutorial} />
        <div className="pt-1">
          <h1 className="text-page-title font-bold text-black">{tutorial.title}</h1>
          <p className="mt-3 text-body-lg font-strong text-[#66717E]">{tutorial.subtitle}</p>
          <div className="mt-6 flex w-fit items-center divide-x divide-[#D8DDE4] text-body text-[#2E3338]">
            <span className="whitespace-nowrap pr-4 font-strong">
              <em className="not-italic text-[#FF4854]">Step {tutorialStep}</em>
            </span>
            <span className="whitespace-nowrap px-4 font-strong">
              <em className="not-italic text-[#2E3338]">{tutorial.title}</em>
            </span>
            <span className="whitespace-nowrap px-4 font-medium">{tutorial.price}</span>
            <span className="whitespace-nowrap pl-4">
              <span className="rounded-[4px] bg-[#3F454C] px-2 py-1 text-label font-strong text-white">
                Tutorial
              </span>
            </span>
          </div>
          <p className="mt-8 text-body text-[#3D4754]">{tutorial.description}</p>
          <p className="mt-2 text-body font-strong text-[#FF4854]">{tutorial.goal}</p>
        </div>
      </section>

      <TutorialTabNavigation tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      <div id="tutorial-tab-content" className="mt-10 scroll-mt-8">
        <main>
          {tutorial.id === 7 ? (
            <ChallengeElementGuide activeTab={activeTab} onTabChange={handleTabChange} />
          ) : tutorial.id === 8 ? (
            <ChatTokenGuide activeTab={activeTab} onTabChange={handleTabChange} />
          ) : tutorial.id === 9 ? (
            <JudgeFailureGuide activeTab={activeTab} onTabChange={handleTabChange} />
          ) : tutorial.id === 10 ? (
            <JudgeSuccessGuide activeTab={activeTab} onTabChange={handleTabChange} />
          ) : (
            <DefaultLearningGuide activeTab={activeTab} />
          )}
        </main>
      </div>
    </div>
  );
}
