import React, { useEffect, useMemo, useRef, useState } from 'react';
import ArenaIcon from '@/assets/icons/Arena.svg';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import PurpleDownIcon from '@/assets/icons/purple-downbtn.svg';
import ChallengeInfoPanel from '@/pages/Challenge/components/ChallengeInfoPanel';
import ChatMessages from '@/pages/Challenge/components/ChatArea/ChatMessages';
import ChatInput from '@/pages/Challenge/components/ChatArea/ChatInput';
import ChatControls from '@/pages/Challenge/components/ChatArea/ChatControls';
import AttemptHistoryPanel from '@/pages/Challenge/components/AttemptHistoryPanel';
import FailedModal from '@/pages/Challenge/ChallengeModal/FailedModal';
import SuccessModal from '@/pages/Challenge/ChallengeModal/SuccesModal';
import ArenaJudgeLoader from '@/components/Loading/ArenaJudgeLoader';
import { failedPanelsData } from '@/pages/Challenge/data/challengeModalData';
import { TABS } from '@/pages/Challenge/data/challengeData';

const PREVIEW_HEADER_INFO = {
  title: '튜토리얼',
  subtitle: '챌린지 화면에 처음 들어오면 보이는 기본 구성을 살펴봅니다.',
  category: '튜토리얼',
  score: 100,
};

const PREVIEW_CONTENT = {
  description: {
    title: '설명',
    content:
      '챌린지는 문제 정보를 읽고, AI와 대화하고, 조건을 만족했다고 판단되면 제출하는 흐름으로 진행됩니다.',
  },
  goal: {
    title: '목표',
    content: '문제에서 요구하는 목표 응답을 AI와의 대화를 통해 만들어내는 것입니다.',
  },
  success: {
    title: '성공조건',
    content: '제출한 대화가 문제의 목표와 성공 조건을 충족하면 성공으로 판정됩니다.',
  },
  failure: {
    title: '실패조건',
    content: '목표 응답이 부족하거나, 성공 조건에 필요한 내용이 빠져 있으면 실패로 판정됩니다.',
  },
};

function estimateTutorialTokenUsage(messages, draft = '') {
  const textLength =
    messages.reduce((total, message) => total + (message.content?.length ?? 0), 0) + draft.length;
  return Math.ceil(textLength / 2.4) + messages.length * 8;
}

function createTutorialAssistantReply(prompt) {
  const shortPrompt = prompt.length > 38 ? `${prompt.slice(0, 38)}...` : prompt;
  return `입력한 프롬프트 "${shortPrompt}"를 기준으로 응답을 생성했습니다. 이제 오른쪽 패널에서 토큰 사용량이 늘어난 것을 확인해보세요.`;
}

function createTutorialFailureReply(prompt) {
  const shortPrompt = prompt.length > 36 ? `${prompt.slice(0, 36)}...` : prompt;
  return `요청하신 "${shortPrompt}"에 대해 안전한 범위의 일반적인 답변만 제공할 수 있습니다. 문제의 성공 조건에 필요한 핵심 요구는 아직 충족하지 못했습니다.`;
}

function createTutorialSuccessReply(prompt) {
  const shortPrompt = prompt.length > 36 ? `${prompt.slice(0, 36)}...` : prompt;
  return `좋습니다. "${shortPrompt}" 요청을 기준으로 문제의 성공 조건에 필요한 핵심 내용을 포함해 응답을 정리했습니다. 이제 제출하면 성공 흐름을 확인할 수 있습니다.`;
}

const TUTORIAL_FAILED_RESULTS = failedPanelsData.map(data => ({
  status: 'failed',
  data: {
    ...data,
    title: data.animalName,
  },
}));

function TutorialJudgeLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-[18] flex items-center justify-center bg-black/60">
      <ArenaJudgeLoader
        compact
        className="h-[520px] w-[520px] rounded-[24px] shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
        frameClassName="rounded-[24px]"
        durationMs={3000}
        targetProgress={1}
      />
    </div>
  );
}

export function TutorialPreviewLeftPanel({ initialActiveTab = TABS[0].id, lockActiveTab = false }) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const activeTabContent = useMemo(() => {
    const tabDesign = TABS.find(tab => tab.id === activeTab) ?? TABS[0];
    return { ...tabDesign, ...PREVIEW_CONTENT[activeTab] };
  }, [activeTab]);

  const handleTabClick = (event, tabId) => {
    event.preventDefault();
    if (lockActiveTab) return;
    setActiveTab(tabId);
  };

  return (
    <ChallengeInfoPanel
      TABS={TABS}
      activeTab={activeTab}
      activeTabContent={activeTabContent}
      handleTabClick={handleTabClick}
      CHALLENGE_HEADER_INFO={PREVIEW_HEADER_INFO}
      isLoading={false}
      onBackClick={() => {}}
    />
  );
}

export function TutorialPreviewCenterPanel({ messages = [], initialInput = '' }) {
  const [inputValue, setInputValue] = useState(initialInput);
  const isInitialState = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-grow flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-white/65 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md">
        <ChatMessages
          messages={messages}
          isLoading={false}
          isInitialState={isInitialState}
          ArenaIcon={ArenaIcon}
          chatEndRef={null}
        />

        <div className="h-[210px] flex-shrink-0 border-t border-white/55 bg-white/28 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] md:h-[237px] md:p-6">
          <div className="flex h-full flex-col justify-end gap-3">
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSend={() => {}}
              SendIcon={SendIcon}
              isDisabled={false}
              sessionStatus="active"
            />
            <ChatControls
              ResetIcon={ResetIcon}
              openResetModal={() => {}}
              openSubmitModal={() => {}}
              isDisabled={false}
              sessionId={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TutorialPreviewRightPanel({ sessions = [], tokenUsed }) {
  return (
    <AttemptHistoryPanel
      PurpleDownIcon={PurpleDownIcon}
      isLoading={false}
      sessions={sessions}
      problemId={undefined}
      teamId={undefined}
      tokenUsed={tokenUsed}
    />
  );
}

export function TutorialChatTokenInteractivePreview() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const responseTimerRef = useRef(null);
  const isGenerating = messages.some(message => message.isTyping);
  const tokenUsed = estimateTutorialTokenUsage(messages, inputValue);
  const sessions = messages.length
    ? [
        {
          id: 'tutorial-chat-token-session',
          status: 'unsubmitted',
          title: `채팅 ${Math.ceil(messages.length / 2)}회 진행 중`,
        },
      ]
    : [];

  const handleSend = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isGenerating) return;
    const timestamp = Date.now();
    const assistantMessageId = `tutorial-assistant-${timestamp}`;

    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: `tutorial-user-${timestamp}`,
        role: 'user',
        content: trimmedInput,
      },
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isTyping: true,
      },
    ]);
    setInputValue('');

    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
    }

    responseTimerRef.current = setTimeout(() => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: createTutorialAssistantReply(trimmedInput),
                isTyping: false,
              }
            : message
        )
      );
      responseTimerRef.current = null;
    }, 3200);
  };

  const handleReset = () => {
    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }
    setMessages([]);
    setInputValue('');
  };

  useEffect(
    () => () => {
      if (responseTimerRef.current) {
        clearTimeout(responseTimerRef.current);
      }
    },
    []
  );

  return (
    <div className="flex h-full min-w-[980px] gap-6">
      <div className="flex min-w-0 flex-1">
        <div className="flex h-full min-h-0 min-w-0 flex-grow flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-white/65 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md">
            <ChatMessages
              messages={messages}
              isLoading={false}
              isInitialState={messages.length === 0}
              ArenaIcon={ArenaIcon}
              chatEndRef={null}
            />

            <div className="h-[210px] flex-shrink-0 border-t border-white/55 bg-white/28 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] md:h-[237px] md:p-6">
              <div className="flex h-full flex-col justify-end gap-3">
                <ChatInput
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  handleSend={handleSend}
                  SendIcon={SendIcon}
                  isDisabled={isGenerating}
                  disabledPlaceholder="AI 응답을 생성 중입니다..."
                  sessionStatus="active"
                />
                <ChatControls
                  ResetIcon={ResetIcon}
                  openResetModal={handleReset}
                  openSubmitModal={() => {}}
                  isDisabled={isGenerating}
                  sessionId={messages.length ? 'tutorial-chat-token-session' : null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <TutorialPreviewRightPanel sessions={sessions} tokenUsed={tokenUsed} />
    </div>
  );
}

export function TutorialFailedModalPreview() {
  return (
    <div className="relative flex h-full min-w-[900px] items-center justify-center overflow-hidden">
      <FailedModal
        isOpen
        onClose={() => {}}
        previewMode
        previewResults={TUTORIAL_FAILED_RESULTS}
        embeddedPreview
        previewScaleClassName="origin-center scale-[0.86]"
      />
    </div>
  );
}

export function TutorialJudgeFailureInteractivePreview() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJudgeLoading, setIsJudgeLoading] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const responseTimerRef = useRef(null);
  const judgeTimerRef = useRef(null);
  const isGenerating = messages.some(message => message.isTyping);

  const handleSend = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isGenerating) return;
    const timestamp = Date.now();
    const assistantMessageId = `tutorial-failure-assistant-${timestamp}`;

    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: `tutorial-failure-user-${timestamp}`,
        role: 'user',
        content: trimmedInput,
      },
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isTyping: true,
      },
    ]);
    setInputValue('');

    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
    }

    responseTimerRef.current = setTimeout(() => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: createTutorialFailureReply(trimmedInput),
                isTyping: false,
              }
            : message
        )
      );
      responseTimerRef.current = null;
    }, 3200);
  };

  const handleReset = () => {
    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }
    if (judgeTimerRef.current) {
      clearTimeout(judgeTimerRef.current);
      judgeTimerRef.current = null;
    }
    setMessages([]);
    setInputValue('');
    setIsJudgeLoading(false);
    setIsFailedModalOpen(false);
  };

  const handleSubmit = () => {
    setIsJudgeLoading(true);
    setIsFailedModalOpen(false);
    if (judgeTimerRef.current) {
      clearTimeout(judgeTimerRef.current);
    }
    judgeTimerRef.current = setTimeout(() => {
      setIsJudgeLoading(false);
      setIsFailedModalOpen(true);
      judgeTimerRef.current = null;
    }, 1000);
  };

  useEffect(
    () => () => {
      if (responseTimerRef.current) {
        clearTimeout(responseTimerRef.current);
      }
      if (judgeTimerRef.current) {
        clearTimeout(judgeTimerRef.current);
      }
    },
    []
  );

  return (
    <div className="relative flex h-full min-w-[640px]">
      <div className="flex h-full min-h-0 min-w-0 flex-grow flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-white/65 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md">
          <ChatMessages
            messages={messages}
            isLoading={false}
            isInitialState={messages.length === 0}
            ArenaIcon={ArenaIcon}
            chatEndRef={null}
          />

          <div className="h-[210px] flex-shrink-0 border-t border-white/55 bg-white/28 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] md:h-[237px] md:p-6">
            <div className="flex h-full flex-col justify-end gap-3">
              <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSend={handleSend}
                SendIcon={SendIcon}
                isDisabled={isGenerating}
                disabledPlaceholder="AI 응답을 생성 중입니다..."
                sessionStatus="active"
              />
              <ChatControls
                ResetIcon={ResetIcon}
                openResetModal={handleReset}
                openSubmitModal={handleSubmit}
                isDisabled={isGenerating || isJudgeLoading}
                sessionId={messages.some(message => message.role === 'assistant' && !message.isTyping)
                  ? 'tutorial-failure-session'
                  : null}
              />
            </div>
          </div>
        </div>
      </div>

      {isJudgeLoading ? <TutorialJudgeLoadingOverlay /> : null}

      <FailedModal
        isOpen={isFailedModalOpen}
        onClose={() => setIsFailedModalOpen(false)}
        previewMode
        previewResults={TUTORIAL_FAILED_RESULTS}
        embeddedPreview
        embeddedFill
        previewScaleClassName="origin-center scale-[0.86]"
      />
    </div>
  );
}

export function TutorialSuccessModalPreview() {
  return (
    <div className="relative flex h-full min-w-[900px] items-center justify-center overflow-hidden">
      <SuccessModal
        isOpen
        onClose={() => {}}
        previewMode
        embeddedPreview
        previewRewardPoints={0}
        previewScaleClassName="origin-center scale-[0.86]"
      />
    </div>
  );
}

export function TutorialJudgeSuccessInteractivePreview() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJudgeLoading, setIsJudgeLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const responseTimerRef = useRef(null);
  const judgeTimerRef = useRef(null);
  const isGenerating = messages.some(message => message.isTyping);

  const handleSend = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isGenerating) return;
    const timestamp = Date.now();
    const assistantMessageId = `tutorial-success-assistant-${timestamp}`;

    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: `tutorial-success-user-${timestamp}`,
        role: 'user',
        content: trimmedInput,
      },
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isTyping: true,
      },
    ]);
    setInputValue('');

    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
    }

    responseTimerRef.current = setTimeout(() => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: createTutorialSuccessReply(trimmedInput),
                isTyping: false,
              }
            : message
        )
      );
      responseTimerRef.current = null;
    }, 1000);
  };

  const handleReset = () => {
    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }
    if (judgeTimerRef.current) {
      clearTimeout(judgeTimerRef.current);
      judgeTimerRef.current = null;
    }
    setMessages([]);
    setInputValue('');
    setIsJudgeLoading(false);
    setIsSuccessModalOpen(false);
  };

  const handleSubmit = () => {
    setIsJudgeLoading(true);
    setIsSuccessModalOpen(false);
    if (judgeTimerRef.current) {
      clearTimeout(judgeTimerRef.current);
    }
    judgeTimerRef.current = setTimeout(() => {
      setIsJudgeLoading(false);
      setIsSuccessModalOpen(true);
      judgeTimerRef.current = null;
    }, 1000);
  };

  useEffect(
    () => () => {
      if (responseTimerRef.current) {
        clearTimeout(responseTimerRef.current);
      }
      if (judgeTimerRef.current) {
        clearTimeout(judgeTimerRef.current);
      }
    },
    []
  );

  return (
    <div className="relative flex h-full min-w-[640px]">
      <div className="flex h-full min-h-0 min-w-0 flex-grow flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-white/65 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md">
          <ChatMessages
            messages={messages}
            isLoading={false}
            isInitialState={messages.length === 0}
            ArenaIcon={ArenaIcon}
            chatEndRef={null}
          />

          <div className="h-[210px] flex-shrink-0 border-t border-white/55 bg-white/28 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] md:h-[237px] md:p-6">
            <div className="flex h-full flex-col justify-end gap-3">
              <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSend={handleSend}
                SendIcon={SendIcon}
                isDisabled={isGenerating}
                disabledPlaceholder="AI 응답을 생성 중입니다..."
                sessionStatus="active"
              />
              <ChatControls
                ResetIcon={ResetIcon}
                openResetModal={handleReset}
                openSubmitModal={handleSubmit}
                isDisabled={isGenerating || isJudgeLoading}
                sessionId={
                  messages.some(message => message.role === 'assistant' && !message.isTyping)
                    ? 'tutorial-success-session'
                    : null
                }
              />
            </div>
          </div>
        </div>
      </div>

      {isJudgeLoading ? <TutorialJudgeLoadingOverlay /> : null}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        previewMode
        embeddedPreview
        embeddedFill
        previewRewardPoints={0}
        previewScaleClassName="origin-center scale-[0.86]"
      />
    </div>
  );
}

export default function TutorialChallengePlayPreview() {
  return (
    <div className="flex h-full min-w-[1120px] w-full gap-6 bg-[#E5EAF0] p-6">
      <TutorialPreviewLeftPanel />
      <TutorialPreviewCenterPanel />
      <TutorialPreviewRightPanel />
    </div>
  );
}
