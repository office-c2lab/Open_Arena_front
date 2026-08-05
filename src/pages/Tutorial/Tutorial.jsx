import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Activity, ArrowLeft, ChevronRight, Coins, Flag, Trophy } from 'lucide-react';
import TutorialImage from '@/assets/images/tutorial.png';
import TutorialElementImage from '@/assets/images/t1.png';
import TutorialChatTokenImage from '@/assets/images/t2.png';
import TutorialJudgeFailureImage from '@/assets/images/t3.png';
import TutorialJudgeSuccessImage from '@/assets/images/t4.png';
import StartCardBg from '@/assets/images/start_cardbg.png';
import NoTryCardBg from '@/assets/images/notry.png';
import ChallengeBg from '@/assets/images/chalbg.png';
import {
  FailedJudgeModelPreview,
  SuccessJudgeModelPreview,
} from '@/pages/LandingPage/JudgeModelPreviews';
import { SectionTitle } from '@/pages/LandingPage/LandingPage.primitives';
import {
  TutorialChatTokenInteractivePreview,
  TutorialJudgeFailureInteractivePreview,
  TutorialJudgeSuccessInteractivePreview,
  TutorialPreviewCenterPanel,
  TutorialPreviewLeftPanel,
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
    {
      key: 'overview',
      label: '전체 화면',
      description: '전체 화면의 구조와 기본 진행 순서를 살펴봅니다.',
    },
    {
      key: 'challenge-info',
      label: '챌린지 정보',
      description: '문제 목표와 성공·실패 조건을 확인하는 방법을 익힙니다.',
    },
    {
      key: 'chat',
      label: '채팅 영역',
      description: '프롬프트 입력부터 AI 응답과 제출까지의 구성을 알아봅니다.',
    },
    {
      key: 'tokens',
      label: '사용 토큰',
      description: '대화 중 사용한 토큰을 확인하는 위치를 살펴봅니다.',
    },
  ],
  8: [
    { key: 'goals', label: '학습 목표' },
    {
      key: 'chat',
      label: '채팅 영역',
      description: '프롬프트를 보내고 AI 응답을 이어가는 방법을 익힙니다.',
    },
    {
      key: 'tokens',
      label: '토큰 확인',
      description: '대화 길이에 따라 달라지는 토큰 사용량을 확인합니다.',
    },
    {
      key: 'score',
      label: '점수 계산',
      description: '사용 토큰이 최종 점수에 반영되는 방식을 알아봅니다.',
    },
    {
      key: 'practice',
      label: '직접 해보기',
      description: '직접 채팅하며 입력과 토큰 변화를 경험합니다.',
    },
  ],
  9: [
    { key: 'goals', label: '학습 목표' },
    {
      key: 'result',
      label: '실패 모달',
      description: 'Judge의 실패 판정과 피드백 구조를 살펴봅니다.',
    },
    {
      key: 'practice',
      label: '직접 제출하기',
      description: '응답을 제출하고 실패 결과를 확인하는 흐름을 연습합니다.',
    },
  ],
  10: [
    { key: 'goals', label: '학습 목표' },
    {
      key: 'result',
      label: '성공 모달',
      description: 'Judge의 성공 판정과 결과 화면을 살펴봅니다.',
    },
    {
      key: 'practice',
      label: '직접 제출하기',
      description: '응답을 제출하고 성공 결과를 확인하는 흐름을 연습합니다.',
    },
  ],
};

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

function LearningGoalSteps({ tabs, onChange }) {
  const nextTabs = tabs.filter(tab => tab.key !== 'goals');

  return (
    <div className="mt-8 max-w-[720px] border-t border-[#E5E9EF] pt-6">
      <h3 className="text-card-title font-bold text-[#202832]">학습 순서</h3>
      <div className="mt-4">
        {nextTabs.map((tab, index) => (
          <div
            key={tab.key}
            className="group/step grid gap-3 border-b border-[#E5E9EF] py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          >
            <div className="flex gap-4">
              <span className="pt-0.5 text-label font-bold text-[#B0B7C3] transition-colors group-hover/step:text-[#202832]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 className="text-body-lg font-bold text-[#202832]">{tab.label}</h4>
                <p className="mt-1 text-body text-[#66717E]">{tab.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange(tab.key)}
              className="group/cta ml-8 flex w-fit cursor-pointer items-center gap-1 text-body font-bold text-[#FF4854] transition-colors hover:text-[#D83A45] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF4854] sm:ml-0"
            >
              {tab.label} 보기
              <ChevronRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
            </button>
          </div>
        ))}
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

function SectionDescription({ intro, items = [], steps = [], showSteps = false }) {
  const supportingCopy = items[0];
  const visibleSteps = steps.slice(0, 3);

  return (
    <div className="mt-4 space-y-4">
      <p className="text-body-lg font-strong text-[#344050]">{intro}</p>
      {!showSteps && supportingCopy ? (
        <p className="text-body font-strong text-[#66717E]">{supportingCopy}</p>
      ) : null}
      {showSteps && visibleSteps.length ? (
        <div className="mt-6">
          <ol className="list-decimal space-y-3 pl-5 text-body font-strong text-[#4A5565]">
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
  stacked = false,
}) {
  const showSteps = title.includes('직접');
  const preview = (
    <div className="no-scrollbar relative overflow-x-auto rounded-[18px] border border-[#DDE3EA] bg-[#E5EAF0] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.55]"
        style={{ backgroundImage: `url(${ChallengeBg})` }}
      />
      <div className={`relative h-[660px] ${width}`}>{children}</div>
    </div>
  );
  const description = (
    <div className={stacked ? 'max-w-[860px]' : 'py-2 lg:sticky lg:top-8'}>
      <span className="text-label font-bold uppercase tracking-[0.18em] text-[#FF4854]">
        Component guide
      </span>
      <h2 className="mt-3 text-page-title font-bold text-[#202832]">{title}</h2>
      <SectionDescription intro={intro} items={items} steps={steps} showSteps={showSteps} />
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
      {activeTab === 'challenge-info' ? (
        <PanelPreviewSection
          title="챌린지 정보 영역"
          intro="챌린지 정보 영역은 챌린지를 시작하기 전에 반드시 읽어야 하는 문제 정보 공간입니다. 이곳에서 문제의 배경, 요구하는 목표, 성공으로 인정되는 조건, 실패로 처리되는 조건을 확인합니다."
          items={[
            '상단에는 현재 풀고 있는 문제의 제목이 표시됩니다. 뒤로가기 버튼도 이 영역에 있지만, 튜토리얼 프리뷰에서는 화면 이동이 일어나지 않도록 동작을 막아두었습니다.',
            '탭은 설명, 목표, 성공조건, 실패조건으로 나뉩니다. 아래 프리뷰에서 탭을 직접 눌러 각 내용을 확인할 수 있습니다.',
            '목표 탭은 AI에게서 어떤 결과를 받아내야 하는지 알려줍니다. 프롬프트를 작성할 때는 이 목표 문장을 계속 기준점으로 삼아야 합니다.',
            '성공조건과 실패조건은 제출 전 체크리스트 역할을 합니다. AI가 그럴듯하게 답해도 성공조건에 필요한 핵심 내용이 없으면 실패할 수 있습니다.',
            'API형 문제에서는 설명 탭 하단에 API 정보가 함께 표시될 수 있습니다. URL, Method, Header, API Key 같은 값은 외부 요청을 구성할 때 필요한 재료입니다.',
          ]}
          steps={[
            '아래 프리뷰에서 설명 탭을 누르고 문제의 배경과 제한 조건을 읽어봅니다.',
            '목표 탭을 눌러 이번 문제에서 받아내야 하는 최종 응답을 확인합니다.',
            '성공조건 탭을 눌러 제출 전에 반드시 포함되어야 할 내용을 찾아봅니다.',
            '실패조건 탭을 눌러 피해야 할 응답 패턴을 확인한 뒤 다시 설명 탭으로 돌아와봅니다.',
          ]}
          cautions={[
            '문제 설명만 읽고 바로 대화를 시작하면 성공조건을 놓칠 수 있습니다.',
            'AI가 긴 답변을 했다고 해서 성공은 아닙니다. 성공조건에 필요한 핵심 문장이 있는지 확인해야 합니다.',
            'API 정보는 모든 문제에 항상 필요한 것은 아닙니다. API형 문제일 때만 요청 구성에 사용합니다.',
          ]}
          nextAction="챌린지 정보 영역을 다 읽었다면, 이제 채팅 영역에서 첫 프롬프트를 작성해 대화를 시작합니다."
          width="min-w-[340px]"
        >
          <TutorialPreviewLeftPanel />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'chat' ? (
        <PanelPreviewSection
          title="채팅 영역"
          intro="채팅 영역은 AI와 대화가 이루어지는 작업 공간입니다. 구성요소 튜토리얼에서는 이 영역에서 어떤 요소가 보이는지, 입력창과 버튼이 어디에 있는지 먼저 파악합니다."
          items={[
            '처음 들어오면 ARENA 로고와 대화 시작 안내 문구가 보입니다. 아직 메시지가 없는 초기 상태라는 뜻입니다.',
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
          nextAction="채팅 영역에서 대화를 만들었다면, 챌린지 정보 영역 하단의 사용 토큰 카드가 어떻게 바뀌는지 확인합니다."
          width="min-w-[640px]"
        >
          <TutorialPreviewCenterPanel />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'tokens' ? (
        <PanelPreviewSection
          title="사용 토큰 표시"
          intro="현재 play 화면에서는 사용한 토큰이 챌린지 정보 영역 하단 카드에 표시됩니다. 문제 조건을 읽는 공간과 토큰 확인 위치가 같은 왼쪽 패널 안에 있으므로, 대화 중에도 기준과 사용량을 함께 확인할 수 있습니다."
          items={[
            '토큰 카드는 설명, 목표, 성공조건, 실패조건 탭 아래쪽에 고정되어 있습니다.',
            '채팅을 시작하기 전에는 0으로 보이고, 메시지를 보내고 응답을 받으면 서버에서 계산된 사용량이 반영됩니다.',
            '토큰은 점수 효율을 보는 기준입니다. 같은 성공 결과라면 더 적은 토큰으로 목표를 달성한 시도가 더 좋은 풀이가 될 수 있습니다.',
            '제출 결과는 별도 모달로 확인합니다. 전송은 대화이고, 제출하기는 Judge 평가를 요청하는 행동입니다.',
          ]}
          steps={[
            '아래 프리뷰에서 정보 패널 하단의 사용한 토큰 카드를 찾아봅니다.',
            '탭을 바꿔도 토큰 카드가 같은 위치에 남아 있는지 눌러보며 확인합니다.',
            '토큰 숫자가 높아졌을 때 어떤 식으로 프롬프트를 줄일 수 있을지 생각해봅니다.',
            '실패와 성공 판정은 이후 튜토리얼에서 제출 모달 흐름으로 직접 확인합니다.',
          ]}
          cautions={[
            '토큰 숫자만 보고 제출 여부를 판단하지 말고, 채팅 응답이 실제로 성공조건을 만족하는지도 함께 확인해야 합니다.',
            '토큰을 아끼려고 너무 짧게만 쓰면 목표 조건을 놓칠 수 있습니다.',
            '구성요소 단계에서는 점수 계산을 외우기보다, 사용 토큰 카드의 위치를 익히면 됩니다.',
          ]}
          nextAction="사용 토큰 카드의 위치를 익혔다면, 다음 튜토리얼에서 실제로 채팅을 입력하고 토큰 변화를 확인합니다."
          width="min-w-[340px]"
        >
          <TutorialPreviewLeftPanel tokenUsed={184} />
        </PanelPreviewSection>
      ) : null}
    </>
  );
}

function ChatTokenGuide({ activeTab, tabs, onTabChange }) {
  return (
    <>
      {activeTab === 'goals' ? (
        <section>
          <h2 className="text-page-title font-bold text-[#202832]">학습 목표</h2>
          <p className="mt-4 text-body-lg font-strong text-[#344050]">
            AI와 대화를 시작하고 사용 토큰을 확인하는 흐름을 익힙니다.
          </p>
          <LearningGoalSteps tabs={tabs} onChange={onTabChange} />
        </section>
      ) : null}

      {activeTab === 'chat' ? (
        <PanelPreviewSection
          title="채팅 영역"
          intro="채팅 영역은 프롬프트를 입력하고 AI 응답을 확인하는 대화 공간입니다. 채팅이 시작되면 사용자 메시지와 AI 응답이 순서대로 쌓이고, 사용자는 응답을 읽어 다음 프롬프트를 더 구체적으로 조정합니다."
          items={[
            '하단 입력창에 프롬프트를 작성합니다. 입력창 오른쪽 아래의 전송 버튼은 내용이 있을 때 활성화되며, 클릭하거나 Enter를 눌러 메시지를 보낼 수 있습니다.',
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
        >
          <TutorialPreviewCenterPanel messages={CHAT_TOKEN_MESSAGES} />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'tokens' ? (
        <PanelPreviewSection
          title="사용 토큰 확인"
          intro="사용한 토큰은 왼쪽 챌린지 정보 영역 하단에서 확인합니다. 프롬프트와 응답이 길어질수록 사용 토큰이 늘어나며, 실제 챌린지에서는 서버에서 계산된 값이 반영됩니다."
          items={[
            '사용한 토큰 카드는 현재 대화에서 소모한 토큰 수를 보여줍니다. 사용자 입력뿐 아니라 AI가 생성한 응답도 토큰 사용량에 영향을 줍니다.',
            '첫 대화를 시작한 뒤에는 채팅 응답을 읽고, 왼쪽 하단의 토큰 숫자가 갱신되는 위치를 함께 확인합니다.',
            '토큰 숫자는 효율을 보는 기준입니다. 같은 성공 결과라면 더 적은 토큰으로 목표를 달성한 시도가 더 좋은 풀이가 될 수 있습니다.',
            '제출 전에는 토큰 숫자만 보지 말고, 응답이 목표와 성공조건을 만족하는지도 함께 확인해야 합니다.',
            '토큰을 줄이려면 문제 조건을 먼저 읽고, 질문을 명확하게 작성하고, 응답을 보고 필요한 부분만 이어서 요청하는 습관이 중요합니다.',
          ]}
          steps={[
            '채팅 영역에서 메시지를 한 번 보낸 뒤 사용한 토큰 숫자를 확인합니다.',
            'AI 응답이 길어질수록 토큰이 함께 늘어난다는 점을 관찰합니다.',
            '토큰 카드가 챌린지 정보 영역 하단에 있다는 점을 기억합니다.',
            '다음 프롬프트를 작성할 때 불필요한 반복을 줄여 토큰 사용을 관리합니다.',
          ]}
          cautions={[
            '토큰을 아끼려고 너무 짧게만 쓰면 목표 조건을 놓칠 수 있습니다. 먼저 성공 가능성을 확보한 뒤 표현을 다듬는 순서가 좋습니다.',
            '사용 토큰 숫자만 보고 판단하지 말고, 채팅 영역의 응답이 실제로 성공조건을 만족하는지도 함께 확인해야 합니다.',
            '전송은 대화를 이어가는 행동이고, 제출하기는 Judge 평가를 요청하는 행동입니다.',
          ]}
          nextAction="사용 토큰 위치를 확인했다면, 이어서 토큰이 점수에 어떻게 반영되는지 계산 예시를 살펴봅니다."
          width="min-w-[340px]"
        >
          <TutorialPreviewLeftPanel tokenUsed={184} />
        </PanelPreviewSection>
      ) : null}

      {activeTab === 'score' ? (
        <section className="mt-8 space-y-5 rounded-[18px] border border-[#E5E9EF] bg-white p-8">
          <div>
            <h2 className="text-page-title font-bold text-[#202832]">점수 계산 예시</h2>
            <p className="mt-4 text-body-lg font-strong text-[#344050]">
              성공한 뒤에는 더 적은 토큰을 사용할수록 높은 점수를 받을 수 있습니다.
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
          intro="마지막으로 아래 프리뷰에서 채팅 영역에 직접 프롬프트를 입력해봅니다. 입력 중인 문장과 전송된 대화 내용을 기준으로 왼쪽 정보 패널의 사용 토큰 숫자가 함께 바뀝니다."
          items={[
            '입력창에 문장을 작성하면 왼쪽 정보 패널의 사용 토큰 숫자가 즉시 증가합니다.',
            '전송 버튼을 누르면 사용자 메시지와 AI 예시 응답이 채팅 영역에 쌓입니다.',
            '새로운 대화 시작 버튼을 누르면 튜토리얼 프리뷰의 채팅과 토큰 숫자가 다시 초기 상태로 돌아갑니다.',
            '이 프리뷰는 토큰 흐름을 익히기 위한 프론트 계산 예시입니다. 실제 챌린지에서는 서버에서 계산된 토큰 사용량이 표시됩니다.',
          ]}
          steps={[
            '입력창에 짧은 프롬프트를 작성하고 왼쪽 정보 패널의 토큰 숫자가 변하는지 확인합니다.',
            '전송 버튼을 눌러 메시지와 AI 응답이 쌓이는 흐름을 봅니다.',
            '조금 더 긴 프롬프트를 입력해 토큰 숫자가 더 크게 늘어나는지 비교합니다.',
            '새로운 대화 시작으로 초기화한 뒤 다시 입력해봅니다.',
          ]}
          cautions={[
            '토큰 숫자는 글자 수와 대화 길이를 바탕으로 한 학습용 추정값입니다. 실제 판정 환경의 토큰 계산과 완전히 같지는 않을 수 있습니다.',
            '튜토리얼에서는 입력 중에도 토큰 숫자가 바뀌지만, 실제 챌린지에서는 전송 후에 토큰 값이 계산되어 적용됩니다.',
          ]}
          nextAction="직접 입력해보며 토큰 변화가 보였다면, 다음 튜토리얼에서 제출 후 실패가 어떻게 표시되는지 살펴봅니다."
          width="min-w-[980px]"
        >
          <TutorialChatTokenInteractivePreview />
        </PanelPreviewSection>
      ) : null}
    </>
  );
}

function JudgeFailureGuide({ activeTab, tabs, onTabChange }) {
  return (
    <>
      {activeTab === 'goals' ? (
        <section>
          <h2 className="text-page-title font-bold text-[#202832]">학습 목표</h2>
          <p className="mt-4 text-body-lg font-strong text-[#344050]">
            실패 화면에서 Judge 피드백을 읽고 다음 시도에 반영하는 방법을 익힙니다.
          </p>
          <LearningGoalSteps tabs={tabs} onChange={onTabChange} />
        </section>
      ) : null}

      {activeTab === 'result' ? (
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-6 lg:pr-6">
            <div className="max-w-xl space-y-4">
              <SectionTitle
                eyebrow=""
                title="Judge Model이란?"
                desc={
                  <>
                    Judge Model은 대화 내용을 바탕으로 <br />
                    공격 성공 여부, 정책 위반 가능성, 안전 대응 여부 등 <br />
                    대화의 위험성과 적절성을 분석하는 평가용 AI입니다.
                    <br />
                    결과는 실패 모달과 성공 모달 형태로 다시 보여 줘서 <br />
                    판단 과정을 직관적으로 이해할 수 있게 만듭니다.
                  </>
                }
              />
            </div>
            <div className="max-w-lg text-body text-[#57534e] sm:text-body-lg">
              실패 판정은 어떤 기준으로 막혔는지, <br />
              어떤 응답이 정책상 허용되지 않는지를 <br />
              화면 안에서 바로 읽을 수 있도록 구성했습니다.
            </div>
          </div>
          <div className="pt-8 lg:pt-12">
            <FailedJudgeModelPreview bare />
          </div>
        </section>
      ) : null}

      {activeTab === 'practice' ? (
        <PanelPreviewSection
          title="직접 제출해보기"
          intro="아래 프리뷰에서는 채팅 영역에 프롬프트를 입력하고 AI 응답을 받은 뒤 제출하기를 눌러볼 수 있습니다. 이 튜토리얼에서는 제출 후 로딩 모달을 거쳐 결과가 항상 실패로 처리되도록 구성했습니다."
          items={[
            '입력창에 프롬프트를 작성하고 전송하면 1초 동안 응답 생성중 상태가 표시됩니다.',
            'AI 예시 응답이 나타난 뒤 제출하기 버튼이 활성화됩니다.',
            '제출하기를 누르면 로딩 모달이 먼저 표시되고, 잠시 뒤 실제 실패 모달 컴포넌트가 프리뷰 안에 표시됩니다.',
            '실패 모달의 설명을 읽고 다음 프롬프트에서 무엇을 보완해야 할지 생각해보는 것이 핵심입니다.',
          ]}
          steps={[
            '입력창에 아무 프롬프트나 작성한 뒤 전송합니다.',
            'AI 응답이 생성될 때까지 기다립니다.',
            '응답이 나온 뒤 제출하기 버튼을 누릅니다.',
            '로딩 모달이 표시된 뒤 실패 모달로 바뀌는 흐름을 확인합니다.',
            '실패 모달에서 실패 사유가 어떻게 표시되는지 확인합니다.',
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

function JudgeSuccessGuide({ activeTab, tabs, onTabChange }) {
  return (
    <>
      {activeTab === 'goals' ? (
        <section>
          <h2 className="text-page-title font-bold text-[#202832]">학습 목표</h2>
          <p className="mt-4 text-body-lg font-strong text-[#344050]">
            성공 화면과 Judge 판정 이후의 흐름을 익힙니다.
          </p>
          <LearningGoalSteps tabs={tabs} onChange={onTabChange} />
        </section>
      ) : null}

      {activeTab === 'result' ? (
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-14">
          <div className="pt-8 lg:pt-12">
            <SuccessJudgeModelPreview bare />
          </div>
          <div className="flex flex-col gap-6 lg:pl-6">
            <div className="max-w-xl space-y-4">
              <SectionTitle
                eyebrow=""
                title="성공 판정은 어떻게 보이나요?"
                desc={
                  <>
                    성공 결과는 단순한 점수 표기가 아니라, <br />
                    Judge Model 다수결에 따른 최종 판정으로 사용자에게 전달됩니다.
                    <br />
                    성공 상태에서는 어떤 판단을 통해 <br />
                    최종 결과에 도달했는지 직관적으로 보여 줍니다.
                  </>
                }
              />
            </div>
            <div className="max-w-lg text-body text-[#57534e] sm:text-body-lg">
              사용자는 단순히 성공 여부만 확인하는 데 그치지 않고, <br />
              더 높은 점수를 얻기 위해 어떤 기준을 충족해야 하는지 <br />
              화면에서 직관적으로 파악할 수 있습니다.
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'practice' ? (
        <PanelPreviewSection
          title="직접 제출해보기"
          intro="아래 프리뷰에서는 채팅 영역에 프롬프트를 입력하고 AI 응답을 받은 뒤 제출하기를 눌러볼 수 있습니다. 이 튜토리얼에서는 제출 후 로딩 모달을 거쳐 결과가 항상 성공으로 처리되도록 구성했습니다."
          items={[
            '입력창에 프롬프트를 작성하고 전송하면 1초 동안 응답 생성중 상태가 표시됩니다.',
            'AI 예시 응답이 나타난 뒤 제출하기 버튼이 활성화됩니다.',
            '제출하기를 누르면 로딩 모달이 먼저 표시되고, 잠시 뒤 실제 성공 모달 컴포넌트가 프리뷰 안에 표시됩니다.',
            '성공 모달이 뜨면 채팅 응답이 Judge 평가를 통과한 결과라고 이해하면 됩니다.',
          ]}
          steps={[
            '입력창에 아무 프롬프트나 작성한 뒤 전송합니다.',
            'AI 응답이 생성될 때까지 기다립니다.',
            '응답이 나온 뒤 제출하기 버튼을 누릅니다.',
            '로딩 모달이 표시된 뒤 성공 모달로 바뀌는 흐름을 확인합니다.',
            '성공 모달에서 성공 문구와 Judge 기준 안내를 확인합니다.',
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

function ChallengeElementGuide({ activeTab, tabs, onTabChange }) {
  return (
    <>
      {activeTab === 'goals' ? (
        <section>
          <h2 className="text-page-title font-bold text-[#202832]">학습 목표</h2>
          <p className="mt-4 text-body-lg font-strong text-[#344050]">
            챌린지 화면의 주요 영역과 기본 풀이 순서를 익힙니다.
          </p>
          <LearningGoalSteps tabs={tabs} onChange={onTabChange} />
        </section>
      ) : null}
      {activeTab === 'overview' ? (
        <section className="space-y-8">
          <div className="max-w-[860px]">
            <span className="text-label font-bold uppercase tracking-[0.18em] text-[#FF4854]">
              Screen overview
            </span>
            <h2 className="mt-3 text-page-title font-bold text-[#202832]">전체 화면</h2>
            <div className="mt-4 max-w-[760px] space-y-4">
              <p className="text-body-lg font-strong text-[#344050]">
                전체 화면은 챌린지의 조건을 확인하고 AI와 대화를 진행하는 작업 공간입니다. 왼쪽에는
                문제 정보와 사용 토큰이, 오른쪽에는 채팅과 제출 기능이 배치됩니다.
              </p>
              <p className="text-body font-strong text-[#66717E]">
                목표와 성공조건을 먼저 읽은 뒤 대화를 시작하면 전체 풀이 흐름을 놓치지 않을 수
                있습니다.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[18px] border border-[#DDE3EA] bg-[#111827] p-3 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
            <ChallengePlayPreview />
          </div>
        </section>
      ) : null}
      <ChallengePanelPreviews activeTab={activeTab} />
    </>
  );
}

const practiceOverview = {
  title: '튜토리얼 실전 연습',
  description:
    '지금까지 익힌 챌린지 정보 확인, 채팅 입력, 토큰 확인, 저지 실패와 성공 흐름을 하나의 미니 챌린지 상세 화면에서 다시 정리합니다.',
  goal: '챌린지 상세에서 문제 정보를 읽고, 도전 기록과 순위 현황 구조를 확인한 뒤 실전 풀이 흐름으로 넘어가는 것.',
  successItems: [
    '챌린지 개요에서 도전 목표와 성공 조건을 확인합니다.',
    '채팅 영역에서 목표 조건에 맞는 응답을 만들어 제출하는 흐름을 떠올릴 수 있습니다.',
    '성공 여부는 제출 결과 모달로 확인하고, 사용 토큰은 play 화면의 정보 패널에서 확인해야 한다는 점을 이해합니다.',
  ],
  failureItems: [
    '문제 조건을 읽지 않고 바로 채팅을 시작하는 경우',
    '응답을 받았지만 제출하지 않아 미제출 상태로 남는 경우',
    '실패 사유를 읽지 않고 같은 프롬프트를 반복하는 경우',
  ],
};

const practiceRecord = {
  status: '미도전',
  attempts: 0,
  tokens: 0,
  score: 150,
};

function PracticeChallengeOverviewContent() {
  return (
    <>
      <section>
        <h2 className="text-page-title font-bold text-black">챌린지 개요</h2>
        <h3 className="mt-4 text-card-title font-bold text-[#202832]">{practiceOverview.title}</h3>
        <p className="mt-5 text-body text-[#3D4754]">{practiceOverview.description}</p>
      </section>

      <section>
        <h2 className="text-card-title font-bold text-[#202832]">도전 목표</h2>
        <p className="mt-3 text-body font-strong text-[#3D4754]">{practiceOverview.goal}</p>
      </section>

      <section>
        <h2 className="text-card-title font-bold text-[#202832]">성공 조건</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-[#3D4754]">
          {practiceOverview.successItems.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-card-title font-bold text-[#202832]">실패 조건</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-[#3D4754]">
          {practiceOverview.failureItems.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

function PracticeChallengeSidePanel() {
  const navigate = useNavigate();

  return (
    <aside className="space-y-4">
      <div className="surface relative aspect-[1619/842] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={StartCardBg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute left-[40%] right-[5%] top-[18%] z-10">
            <h3 className="text-section-title font-bold text-[#202832]">실전 연습</h3>
            <p className="mt-2 text-body font-strong text-[#66717E]">
              튜토리얼에서 익힌 흐름을 챌린지처럼 확인해보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/tutorial-preview/challenge-play')}
            className="btn btn-primary btn-lg absolute bottom-[7%] left-[7%] right-[7%] z-10"
          >
            실전 연습 시작하기
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <section>
        <div className="overflow-hidden rounded-[14px]">
          <div
            className="relative flex min-h-[200px] items-center justify-between bg-center bg-no-repeat px-7 py-7"
            style={{
              backgroundImage: `url(${NoTryCardBg})`,
              backgroundSize: '100% 100%',
            }}
          >
            <div className="relative z-10">
              <p className="text-body font-strong text-[#6E7B88]">챌린지 성공 여부</p>
              <strong className="mt-3 block text-display font-bold text-[#2E3338]">
                {practiceRecord.status}
              </strong>
              <p className="mt-4 text-body font-strong text-[#6F7985]">
                아직 실전 연습 기록이 없습니다.
              </p>
            </div>
            <span className="relative z-10 flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full bg-white text-[#9AA3AF] shadow-[0_10px_24px_rgba(15,23,42,0.1)]">
              <Activity className="h-10 w-10" strokeWidth={2.1} />
            </span>
          </div>

          <dl className="surface divide-y divide-[#E5E9EF] overflow-hidden px-6 text-body">
            <div className="flex items-center justify-between py-5">
              <dt className="flex items-center gap-3 font-strong text-[#3D4754]">
                <Coins className="h-5 w-5 text-[#77808C]" /> 사용 토큰
              </dt>
              <dd className="font-bold text-[#2E3338]">
                {practiceRecord.tokens.toLocaleString()} 토큰
              </dd>
            </div>
            <div className="flex items-center justify-between py-5">
              <dt className="flex items-center gap-3 font-strong text-[#3D4754]">
                <Trophy className="h-5 w-5 text-[#77808C]" /> 최대 포인트
              </dt>
              <dd className="font-bold text-[#FF4854]">{practiceRecord.score} 포인트</dd>
            </div>
          </dl>
        </div>
      </section>
    </aside>
  );
}

function PracticeChallengeDetail() {
  const [activeTab, setActiveTab] = React.useState('overview');
  const tabs = [
    { id: 'overview', label: '챌린지 개요' },
    { id: 'history', label: '도전 기록' },
    { id: 'solvers', label: '순위 현황' },
  ];

  return (
    <>
      <div className="mt-8 border-b border-[#DDE3EA]">
        <div className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer border-b-2 pb-3 text-body-lg font-strong ${
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
          {activeTab === 'overview' ? <PracticeChallengeOverviewContent /> : null}

          {activeTab === 'history' ? (
            <section>
              <h2 className="text-page-title font-bold text-black">도전 기록</h2>
              <div className="surface-muted mt-5 flex max-w-[800px] min-h-[180px] items-center justify-center px-6 text-center">
                <div>
                  <p className="text-body-lg font-strong text-[#3D4754]">
                    아직 도전 기록이 없습니다.
                  </p>
                  <p className="mt-2 text-body text-[#8A94A1]">
                    실전 연습을 시작하면 제출 결과와 소모 토큰이 여기에 표시됩니다.
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {activeTab === 'solvers' ? (
            <section>
              <h2 className="text-page-title font-bold text-black">순위 현황</h2>
              <div className="surface-muted mt-5 flex max-w-[800px] min-h-[180px] items-center justify-center px-6 text-center">
                <div>
                  <p className="text-body-lg font-strong text-[#3D4754]">
                    아직 성공한 사용자가 없습니다.
                  </p>
                  <p className="mt-2 text-body text-[#8A94A1]">
                    실전 연습을 완료하면 순위 구조를 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </section>
          ) : null}
        </main>

        <PracticeChallengeSidePanel />
      </div>
    </>
  );
}

function DefaultLearningGuide({ activeTab }) {
  const selectedIndex = Number(activeTab.replace('section-', '')) || 0;
  const selectedSection = learningSections[selectedIndex] ?? learningSections[0];

  return (
    <section className="rounded-[18px] border border-[#E5E9EF] bg-[#F8FAFC] p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] lg:p-10">
      <span className="text-label font-bold uppercase tracking-[0.18em] text-[#FF4854]">
        Tutorial guide
      </span>
      <h2 className="mt-3 text-page-title font-bold text-[#202832]">{selectedSection.title}</h2>
      <ul className="mt-6 space-y-3 text-body text-[#26313D]">
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
  const isPracticeTutorial = tutorial.id === 11;
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
              {isPracticeTutorial ? (
                <>
                  성공{' '}
                  <em className="ml-1 not-italic text-[#FF4854]">{tutorial.successfulUsers}</em>명
                </>
              ) : (
                <em className="not-italic text-[#FF4854]">Step {tutorialStep}</em>
              )}
            </span>
            <span className="whitespace-nowrap px-4 font-strong">
              {isPracticeTutorial ? (
                <>
                  평균 <em className="mx-1 not-italic text-[#FF4854]">{tutorial.averageTokens}</em>{' '}
                  토큰
                </>
              ) : (
                <em className="not-italic text-[#2E3338]">{tutorial.title}</em>
              )}
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

      {tutorial.id === 11 ? (
        <PracticeChallengeDetail />
      ) : (
        <>
          <TutorialTabNavigation tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

          <div id="tutorial-tab-content" className="mt-10 scroll-mt-8">
            <main>
              {tutorial.id === 7 ? (
                <ChallengeElementGuide
                  activeTab={activeTab}
                  tabs={tabs}
                  onTabChange={handleTabChange}
                />
              ) : tutorial.id === 8 ? (
                <ChatTokenGuide activeTab={activeTab} tabs={tabs} onTabChange={handleTabChange} />
              ) : tutorial.id === 9 ? (
                <JudgeFailureGuide
                  activeTab={activeTab}
                  tabs={tabs}
                  onTabChange={handleTabChange}
                />
              ) : tutorial.id === 10 ? (
                <JudgeSuccessGuide
                  activeTab={activeTab}
                  tabs={tabs}
                  onTabChange={handleTabChange}
                />
              ) : (
                <DefaultLearningGuide activeTab={activeTab} />
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
