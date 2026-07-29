import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import TutorialImage from '@/assets/images/tutorial.png';
import TutorialElementImage from '@/assets/images/t1.png';
import TutorialChatTokenImage from '@/assets/images/t2.png';
import TutorialJudgeFailureImage from '@/assets/images/t3.png';
import ChallengePlayBg from '@/assets/images/chalbg.png';
import AttemptHistoryCard from '@/pages/Challenge/components/AttemptHistoryCard';
import {
  TutorialFailedModalPreview,
  TutorialChatTokenInteractivePreview,
  TutorialJudgeFailureInteractivePreview,
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
  const previewImage =
    tutorial.id === 7
      ? TutorialElementImage
      : tutorial.id === 8
        ? TutorialChatTokenImage
        : tutorial.id === 9
          ? TutorialJudgeFailureImage
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
    <section className="space-y-5 border-b border-[#DDE3EA] pb-12">
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

const CHAT_TOKEN_SESSIONS = [
  {
    id: 'chat-token-session-1',
    status: 'unsubmitted',
    title: '첫 번째 프롬프트를 입력하고 응답을 확인한 대화',
  },
];

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
        title="챌린지 정보 영역"
        intro="챌린지 정보 영역은 챌린지를 시작하기 전에 반드시 읽어야 하는 문제 정보 공간입니다. 이곳에서 문제의 배경, 요구하는 목표, 성공으로 인정되는 조건, 실패로 처리되는 조건을 확인합니다."
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
        nextAction="챌린지 정보 영역을 다 읽었다면, 이제 채팅 영역에서 첫 프롬프트를 작성해 대화를 시작합니다."
        width="min-w-[1450px]"
      >
        <LeftPanelTabExamples />
      </PanelPreviewSection>

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
          '채팅 영역의 빈 대화 공간과 하단 입력창 위치를 확인합니다.',
          '전송 버튼, 새로운 대화 시작 버튼, 제출하기 버튼이 각각 어디에 있는지 봅니다.',
          '대화가 생기면 메시지가 어느 영역에 쌓이는지 이해합니다.',
          '자세한 입력 방식은 다음 튜토리얼인 채팅과 토큰에서 직접 연습합니다.',
        ]}
        cautions={[
          '전송 버튼과 제출하기 버튼은 서로 다른 행동입니다. 전송은 대화이고, 제출하기는 판정 요청입니다.',
          '구성요소 튜토리얼에서는 프롬프트를 잘 쓰는 법보다 화면 구조를 익히는 데 집중합니다.',
          '새로운 대화 시작은 현재 대화 흐름을 초기화하는 버튼이므로 실제 챌린지에서는 신중하게 사용해야 합니다.',
        ]}
        nextAction="채팅 영역에서 대화를 만들었다면, 진행 현황 영역에서 토큰 사용량과 제출 기록을 확인합니다."
        width="min-w-[640px]"
      >
        <TutorialPreviewCenterPanel />
      </PanelPreviewSection>

      <PanelPreviewSection
        title="진행 현황 영역"
        intro="진행 현황 영역은 현재 풀이 상태를 확인하는 공간입니다. 구성요소 튜토리얼에서는 점수, 토큰, 최근 시도 기록이 어디에 표시되는지와 각 상태 카드가 어떤 의미인지 먼저 익힙니다."
        items={[
          '가장 위에는 점수 카드가 표시됩니다. 문제를 성공했을 때 받을 수 있는 점수 정보를 확인하는 위치입니다.',
          '그 아래에는 사용한 토큰 카드가 표시됩니다. 토큰이 점수와 어떻게 연결되는지는 채팅과 토큰 튜토리얼에서 자세히 다룹니다.',
          '최근 시도 목록은 대화와 제출 기록이 쌓이는 영역입니다. 기록이 없을 때, 미제출일 때, 실패했을 때, 성공했을 때의 상태가 다르게 표시됩니다.',
          '필터 드롭다운은 기록을 전체, 성공, 실패, 미제출로 나눠 보는 장치입니다.',
          '이 섹션의 오른쪽 빈 공간에는 최근 시도에서 볼 수 있는 상태 예시를 따로 보여줍니다.',
        ]}
        steps={[
          '점수 카드와 사용한 토큰 카드의 위치를 확인합니다.',
          '최근 시도 영역이 진행 현황 영역 아래쪽에 있다는 점을 기억합니다.',
          '미제출, 실패, 성공 상태 카드가 어떻게 구분되어 보이는지 살펴봅니다.',
          '자세한 토큰 계산은 다음 튜토리얼에서, 실패와 성공 판정은 이후 튜토리얼에서 따로 익힙니다.',
        ]}
        cautions={[
          '미제출은 실패가 아닙니다. 아직 Judge AI에게 판정을 요청하지 않은 대화라는 뜻입니다.',
          '구성요소 단계에서는 점수 계산을 외우기보다, 점수와 토큰이 진행 현황 영역에 표시된다는 점을 익히면 됩니다.',
          '실패와 성공 기록을 해석하는 방법은 저지 실패와 저지 성공 튜토리얼에서 더 자세히 다룹니다.',
        ]}
        nextAction="진행 현황 영역의 위치와 상태 표시를 익혔다면, 다음 튜토리얼에서 실제로 채팅을 입력하고 토큰 변화를 확인합니다."
        width="flex min-w-[760px] justify-end gap-10"
      >
        <AttemptStateExamples />
        <TutorialPreviewRightPanel />
      </PanelPreviewSection>
    </>
  );
}

function ChatTokenGuide() {
  return (
    <>
      <section className="border-b border-[#DDE3EA] pb-10">
        <h2 className="text-[26px] font-900 leading-tight text-[#202832]">학습 목표</h2>
        <p className="mt-4 text-[16px] font-700 leading-[29px] text-[#344050]">
          이번 튜토리얼에서는 AI와 대화를 시작하는 방법과 대화가 진행될 때 토큰 사용량이 어떻게
          확인되는지 익힙니다. 입력창에 프롬프트를 작성하고, 응답을 읽고, 필요한 경우 다음
          프롬프트로 보완하는 흐름을 중심으로 살펴봅니다.
        </p>
        <ul className="mt-4 space-y-3">
          {[
            '채팅 영역의 입력창, 전송 버튼, 새 대화 시작 버튼, 제출하기 버튼의 위치를 익힙니다.',
            '사용자 메시지와 AI 응답이 대화 목록에 어떤 순서로 쌓이는지 확인합니다.',
            '프롬프트를 길게 쓰거나 여러 번 대화하면 진행 현황 영역의 사용 토큰이 늘어난다는 점을 이해합니다.',
            '토큰을 아끼기보다 먼저 목표 조건을 만족하는 응답을 만들고, 이후에 더 효율적인 표현으로 줄이는 흐름을 익힙니다.',
          ].map(item => (
            <li key={item} className="flex gap-3 text-[15px] font-600 leading-[27px] text-[#4A5565]">
              <Check className="mt-1.5 h-4.5 w-4.5 shrink-0 text-[#FF4854]" strokeWidth={2.4} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

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
        nextAction="채팅 영역에서 대화를 만들었다면, 진행 현황 영역에서 사용 토큰과 최근 시도 상태가 어떻게 바뀌는지 확인합니다."
        width="min-w-[640px]"
      >
        <TutorialPreviewCenterPanel messages={CHAT_TOKEN_MESSAGES} />
      </PanelPreviewSection>

      <PanelPreviewSection
        title="진행 현황 영역"
        intro="진행 현황 영역은 채팅을 진행하면서 사용한 토큰과 최근 시도 상태를 확인하는 공간입니다. 프롬프트와 응답이 길어질수록 사용 토큰이 늘어나며, 대화가 생기면 최근 시도 목록에도 기록이 표시됩니다."
        items={[
          '사용한 토큰 카드는 현재 대화에서 소모한 토큰 수를 보여줍니다. 사용자 입력뿐 아니라 AI가 생성한 응답도 토큰 사용량에 영향을 줍니다.',
          '첫 대화를 시작하면 최근 시도에 미제출 상태의 대화가 생길 수 있습니다. 아직 Judge AI에게 제출하지 않았다는 뜻입니다.',
          '토큰 숫자는 효율을 보는 기준입니다. 같은 성공 결과라면 더 적은 토큰으로 목표를 달성한 시도가 더 좋은 풀이가 될 수 있습니다.',
          '최근 시도 목록을 보면 어떤 대화가 아직 미제출인지, 어떤 흐름을 다시 열어봐야 하는지 확인할 수 있습니다.',
          '토큰을 줄이려면 문제 조건을 먼저 읽고, 질문을 명확하게 작성하고, 응답을 보고 필요한 부분만 이어서 요청하는 습관이 중요합니다.',
        ]}
        steps={[
          '채팅 영역에서 메시지를 한 번 보낸 뒤 사용한 토큰 숫자를 확인합니다.',
          'AI 응답이 길어질수록 토큰이 함께 늘어난다는 점을 관찰합니다.',
          '최근 시도에 미제출 기록이 생기는 위치를 확인합니다.',
          '다음 프롬프트를 작성할 때 불필요한 반복을 줄여 토큰 사용을 관리합니다.',
        ]}
        cautions={[
          '토큰을 아끼려고 너무 짧게만 쓰면 목표 조건을 놓칠 수 있습니다. 먼저 성공 가능성을 확보한 뒤 표현을 다듬는 순서가 좋습니다.',
          '진행 현황 영역의 토큰 숫자만 보고 판단하지 말고, 채팅 영역의 응답이 실제로 성공조건을 만족하는지도 함께 확인해야 합니다.',
          '미제출 상태는 실패가 아닙니다. 아직 제출하지 않은 대화이므로, 응답을 더 다듬은 뒤 제출할 수 있습니다.',
        ]}
        nextAction="진행 현황 영역에서 토큰 위치를 확인했다면, 이어서 토큰이 점수에 어떻게 반영되는지 계산 예시를 살펴봅니다."
        width="flex min-w-[760px] justify-end"
      >
        <TutorialPreviewRightPanel sessions={CHAT_TOKEN_SESSIONS} tokenUsed={184} />
      </PanelPreviewSection>

      <section className="space-y-5 border-b border-[#DDE3EA] pb-10">
        <div>
          <h2 className="text-[26px] font-900 leading-tight text-[#202832]">점수 계산 예시</h2>
          <p className="mt-4 text-[16px] font-700 leading-[29px] text-[#344050]">
            토큰은 단순한 사용량 표시가 아니라 점수에도 영향을 줍니다. 정답을 맞히는 것이
            우선이고, 그 다음에는 더 적은 토큰으로 성공할수록 토큰 점수를 더 많이 받을 수
            있습니다.
          </p>
        </div>

        <div className="space-y-5 text-[18px] font-800 leading-[33px] text-[#344050]">
          <p>
            예를 들어 총 배점이 <span className="font-900 text-[#202832]">150점</span>인
            챌린지라면, 점수는 보통 정답 점수와 토큰 점수로 나뉩니다.
          </p>
          <p>
            정답 조건을 만족하면 <span className="font-900 text-[#FF4854]">75점</span>을 받고,
            남은 <span className="font-900 text-[#FF4854]">75점</span>은 사용한 토큰 수에 따라
            계산됩니다.
          </p>
          <p className="text-[20px] font-900 leading-[34px] text-[#202832]">
            토큰 점수 = (3000 - 사용 토큰) / 3000 * 75
          </p>
          <p>
            만약 사용한 토큰이 <span className="font-900 text-[#202832]">1000개</span>라면,
            토큰 점수는 <span className="font-900 text-[#202832]">(3000 - 1000) / 3000 * 75</span>
            이므로 <span className="font-900 text-[#FF4854]">50점</span>입니다.
          </p>
          <p className="text-[22px] font-900 leading-[36px] text-[#202832]">
            최종 점수는 정답 점수 75점 + 토큰 점수 50점 ={' '}
            <span className="text-[#FF4854]">125점</span>입니다.
          </p>
        </div>
      </section>

      <PanelPreviewSection
        title="직접 입력해보기"
        intro="마지막으로 아래 프리뷰에서 채팅 영역에 직접 프롬프트를 입력해봅니다. 입력 중인 문장과 전송된 대화 내용을 기준으로 진행 현황 영역의 사용 토큰 숫자가 함께 바뀝니다."
        items={[
          '입력창에 문장을 작성하면 진행 현황 영역의 사용 토큰 숫자가 즉시 증가합니다.',
          '전송 버튼을 누르면 사용자 메시지와 AI 예시 응답이 채팅 영역에 쌓이고, 최근 시도에는 미제출 대화가 표시됩니다.',
          '새로운 대화 시작 버튼을 누르면 튜토리얼 프리뷰의 채팅과 토큰 숫자가 다시 초기 상태로 돌아갑니다.',
          '이 프리뷰는 토큰 흐름을 익히기 위한 프론트 계산 예시입니다. 실제 챌린지에서는 서버에서 계산된 토큰 사용량이 표시됩니다.',
        ]}
        steps={[
          '입력창에 짧은 프롬프트를 작성하고 진행 현황 영역의 토큰 숫자가 변하는지 확인합니다.',
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
    </>
  );
}

function JudgeFailureGuide() {
  return (
    <>
      <section className="border-b border-[#DDE3EA] pb-10">
        <h2 className="text-[26px] font-900 leading-tight text-[#202832]">학습 목표</h2>
        <p className="mt-4 text-[16px] font-700 leading-[29px] text-[#344050]">
          이번 튜토리얼에서는 제출 결과가 실패로 판정될 때 어떤 화면이 나타나는지 익힙니다.
          실패는 단순히 끝났다는 뜻이 아니라, Judge AI가 어떤 기준에서 부족하다고 판단했는지
          알려주는 피드백입니다.
        </p>
        <ul className="mt-4 space-y-3">
          {[
            '제출하기를 누른 뒤 실패 모달이 어떤 구조로 표시되는지 확인합니다.',
            '3개의 Judge 모델이 남긴 실패 사유를 읽고 공통으로 지적하는 부족한 조건을 찾습니다.',
            '실패 기록이 다음 프롬프트를 고치는 데 쓰이는 피드백이라는 점을 이해합니다.',
            '마지막 실습에서 채팅 응답을 받은 뒤 제출하면 실패 모달이 뜨는 흐름을 직접 확인합니다.',
          ].map(item => (
            <li key={item} className="flex gap-3 text-[15px] font-600 leading-[27px] text-[#4A5565]">
              <Check className="mt-1.5 h-4.5 w-4.5 shrink-0 text-[#FF4854]" strokeWidth={2.4} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <PanelPreviewSection
        title="실패 모달"
        intro="실패 모달은 제출한 대화가 성공 조건을 만족하지 못했을 때 나타나는 결과 화면입니다. 3개의 Judge 모델이 각각 판단한 내용을 보여주며, 어떤 부분이 부족했는지 설명합니다."
        items={[
          '각 결과 패널의 왼쪽에는 실패 상태가 표시됩니다. 빨간색 실패 표시는 해당 Judge 모델이 제출 내용을 통과시키지 않았다는 뜻입니다.',
          '오른쪽 설명에는 왜 실패했는지가 문장으로 정리됩니다. 단순히 실패 여부만 보는 것이 아니라, 어떤 조건을 충족하지 못했는지 읽어야 합니다.',
          '3개의 Judge 모델이 비슷한 이유를 말한다면 그 부분이 다음 시도에서 가장 먼저 고쳐야 할 핵심입니다.',
          '실패 모달 아래에는 문제를 다시 풀거나 다른 문제로 이동하는 버튼이 있습니다. 튜토리얼에서는 화면 구조를 익히는 용도로 보면 됩니다.',
        ]}
        steps={[
          '실패 상태가 어느 위치에 표시되는지 확인합니다.',
          '3개의 Judge 모델 설명을 읽고 공통으로 반복되는 실패 이유를 찾습니다.',
          '성공조건과 비교했을 때 어떤 내용이 부족했는지 생각합니다.',
          '다음 시도에서는 부족했던 조건을 프롬프트에 더 명확하게 반영합니다.',
        ]}
        cautions={[
          '실패 모달은 벌점 화면이 아니라 피드백 화면입니다. 실패 이유를 읽어야 다음 시도를 개선할 수 있습니다.',
          '한 모델의 설명만 보고 판단하기보다 3개의 Judge 설명에서 반복되는 내용을 우선 확인하는 것이 좋습니다.',
          '실패 사유가 길어도 핵심은 보통 성공조건을 충족하지 못한 부분, 요구한 형식이 빠진 부분, 목표와 다른 방향으로 응답한 부분입니다.',
        ]}
        nextAction="실패 모달 구조를 이해했다면, 마지막 실습에서 직접 채팅하고 제출해 실패 모달이 뜨는 흐름을 확인합니다."
        width="min-w-[900px]"
      >
        <TutorialFailedModalPreview />
      </PanelPreviewSection>

      <PanelPreviewSection
        title="직접 제출해보기"
        intro="아래 프리뷰에서는 채팅 영역에 프롬프트를 입력하고 AI 응답을 받은 뒤 제출하기를 눌러볼 수 있습니다. 이 튜토리얼에서는 제출 결과가 항상 실패로 처리되어 실패 모달이 뜨도록 구성했습니다."
        items={[
          '입력창에 프롬프트를 작성하고 전송하면 1초 동안 응답 생성중 상태가 표시됩니다.',
          'AI 예시 응답이 나타난 뒤 제출하기 버튼이 활성화됩니다.',
          '제출하기를 누르면 실제 실패 모달 컴포넌트가 프리뷰 안에 표시됩니다.',
          '실패 모달의 설명을 읽고 다음 프롬프트에서 무엇을 보완해야 할지 생각해보는 것이 핵심입니다.',
        ]}
        steps={[
          '입력창에 아무 프롬프트나 작성한 뒤 전송합니다.',
          'AI 응답이 생성될 때까지 기다립니다.',
          '응답이 나온 뒤 제출하기 버튼을 누릅니다.',
          '실패 모달에서 실패 사유가 어떻게 표시되는지 확인합니다.',
        ]}
        cautions={[
          '이 실습은 실패 흐름을 익히기 위한 튜토리얼이므로 어떤 프롬프트를 입력해도 실패 모달이 뜹니다.',
          '실제 챌린지에서는 실패 사유가 현재 대화 내용과 문제의 성공조건을 기준으로 달라집니다.',
          '실패 후 바로 다시 제출하기보다, 실패 사유를 읽고 프롬프트를 수정하는 습관을 들이는 것이 좋습니다.',
        ]}
        nextAction="실패 모달까지 확인했다면, 다음 튜토리얼에서 성공 조건을 만족했을 때 어떤 화면이 나오는지 살펴봅니다."
        width="min-w-[640px]"
      >
        <TutorialJudgeFailureInteractivePreview />
      </PanelPreviewSection>
    </>
  );
}

function ChallengeElementGuide() {
  return (
    <>
      <section className="border-b border-[#DDE3EA] pb-10">
        <h2 className="text-[26px] font-900 leading-tight text-[#202832]">학습 목표</h2>
        <p className="mt-4 text-[16px] font-700 leading-[29px] text-[#344050]">
          이번 튜토리얼에서는 챌린지 play 화면을 구성하는 주요 영역을 먼저 파악합니다. 문제를
          읽는 곳, AI와 대화하는 곳, 결과와 기록을 확인하는 곳이 각각 어디에 있고 어떤 역할을
          하는지 이해하는 것이 목표입니다.
        </p>
        <ul className="mt-4 space-y-3">
          {[
            '챌린지 정보 영역, 채팅 영역, 진행 현황 영역이 각각 어떤 역할을 하는지 구분합니다.',
            '문제를 풀기 전에 확인해야 하는 설명, 목표, 성공조건, 실패조건의 위치를 익힙니다.',
            '채팅 입력, 제출하기, 새로운 대화 시작, 최근 시도 기록이 풀이 흐름에서 언제 쓰이는지 이해합니다.',
            '실제 챌린지에 들어갔을 때 어디부터 보고 어떤 순서로 행동해야 하는지 감을 잡습니다.',
          ].map(item => (
            <li key={item} className="flex gap-3 text-[15px] font-600 leading-[27px] text-[#4A5565]">
              <Check className="mt-1.5 h-4.5 w-4.5 shrink-0 text-[#FF4854]" strokeWidth={2.4} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-5 border-b border-[#DDE3EA] pb-12">
        <div className="border-b border-[#DDE3EA] pb-3">
          <h2 className="text-[22px] font-900 text-[#202832]">전체 화면</h2>
          <SectionDescription
            intro="전체 화면은 실제 챌린지를 진행할 때 보는 play 화면의 기본 구조입니다. 챌린지 정보 영역에서 문제 조건을 읽고, 채팅 영역에서 AI와 대화하고, 진행 현황 영역에서 점수와 시도 기록을 확인하는 3단 구성으로 되어 있습니다."
            items={[
              '처음 진입하면 아직 대화가 시작되지 않은 상태이므로 채팅 영역에는 대화 시작 안내가 보이고, 진행 현황 영역의 최근 시도도 비어 있습니다.',
              '진행 순서는 보통 챌린지 정보 영역 확인, 채팅 영역에서 대화 시작, 조건을 만족했다고 판단되면 제출, 진행 현황 영역에서 결과 확인 순서로 이어집니다.',
              '화면의 세 영역은 서로 따로 움직이는 것이 아니라 하나의 문제 풀이 흐름을 나눠 보여줍니다. 챌린지 정보 영역은 기준, 채팅 영역은 실행, 진행 현황 영역은 결과와 기록이라고 이해하면 됩니다.',
            ]}
            steps={[
              '전체 화면에서 챌린지 정보 영역, 채팅 영역, 진행 현황 영역의 위치를 먼저 확인합니다.',
              '챌린지 정보 영역의 목표와 성공조건을 읽은 뒤, 채팅 영역의 입력창이 어디 있는지 확인합니다.',
              '진행 현황 영역에서 점수, 토큰, 최근 시도 영역의 위치를 확인합니다.',
              '아래 개별 영역 설명으로 내려가 각 영역을 따로 살펴봅니다.',
            ]}
            cautions={[
              '채팅 영역부터 바로 입력하기보다, 챌린지 정보 영역의 목표와 성공조건을 먼저 확인해야 풀이 방향이 흔들리지 않습니다.',
              '제출하기 전에 채팅 영역의 응답만 보지 말고, 진행 현황 영역의 토큰 사용량과 최근 시도 상태까지 함께 확인하는 습관을 들이는 것이 좋습니다.',
            ]}
          />
        </div>
        <ChallengePlayPreview />
        <p className="rounded-[10px] bg-[#202832] px-5 py-4 text-[15px] font-800 leading-[26px] text-white">
          먼저 전체 구조를 익힌 뒤, 아래의 챌린지 정보 영역부터 순서대로 읽어보세요.
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
        <main className="space-y-12">
          {tutorial.id === 7 ? (
            <ChallengeElementGuide />
          ) : tutorial.id === 8 ? (
            <ChatTokenGuide />
          ) : tutorial.id === 9 ? (
            <JudgeFailureGuide />
          ) : (
            <DefaultLearningGuide />
          )}
        </main>
      </div>
    </div>
  );
}
