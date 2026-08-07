import React, { useEffect, useMemo, useRef, useState } from 'react';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import ChallengeInfoPanel from '@/pages/Challenge/components/ChallengeInfoPanel';
import ChatMessages from '@/pages/Challenge/components/ChatArea/ChatMessages';
import ChatInput from '@/pages/Challenge/components/ChatArea/ChatInput';
import ChatControls from '@/pages/Challenge/components/ChatArea/ChatControls';
import FailedModal from '@/pages/Challenge/ChallengeModal/FailedModal';
import ResetModal from '@/pages/Challenge/ChallengeModal/ResetModal';
import SubmitModal from '@/pages/Challenge/ChallengeModal/SubmitMoadl';
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
      'AI와 대화하며 주어진 목표를 달성하는 챌린지입니다. 먼저 문제의 배경과 제한 사항을 확인하고, 조건에 맞는 응답을 얻을 수 있도록 프롬프트를 구성해보세요.',
  },
  goal: {
    title: '목표',
    content:
      'AI와의 대화를 통해 문제에서 요구하는 핵심 응답을 얻어내는 것이 목표입니다. 한 번에 해결되지 않으면 이전 응답을 바탕으로 요청을 더 구체화해보세요.',
  },
  success: {
    title: '성공조건',
    content:
      '제출한 대화에 목표 달성에 필요한 핵심 내용이 포함되어야 합니다. 응답이 자연스러운지만 보지 말고, 요구된 조건을 빠짐없이 충족했는지 확인하세요.',
  },
  failure: {
    title: '실패조건',
    content:
      '목표와 관련 없는 답변이거나 성공조건의 핵심 내용이 빠지면 실패로 판정됩니다. 제출 전에 현재 응답을 조건과 다시 비교해보세요.',
  },
};

function estimateTutorialTokenUsage(messages, draft = '') {
  const textLength =
    messages.reduce((total, message) => total + (message.content?.length ?? 0), 0) + draft.length;
  return Math.ceil(textLength / 2.4) + messages.length * 8;
}

function createTutorialAssistantReply(prompt) {
  const shortPrompt = prompt.length > 38 ? `${prompt.slice(0, 38)}...` : prompt;
  return `입력한 프롬프트 "${shortPrompt}"를 기준으로 응답을 생성했습니다. 이제 왼쪽 패널 하단에서 토큰 사용량이 늘어난 것을 확인해보세요.`;
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

export function TutorialPreviewLeftPanel({
  initialActiveTab = TABS[0].id,
  lockActiveTab = false,
  tokenUsed = 0,
}) {
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
      problemId="tutorial-problem"
      tokenUsed={tokenUsed}
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

export function TutorialResetModalPreview() {
  return (
    <div className="relative h-full min-w-[520px] overflow-hidden rounded-[24px]">
      <ResetModal
        isOpen
        onClose={() => {}}
        onReset={() => {}}
        previewMode
        embeddedPreview
        hideBrandSymbol
      />
    </div>
  );
}

export function TutorialSubmitModalPreview() {
  return (
    <div className="relative h-full min-w-[520px] overflow-hidden rounded-[24px]">
      <SubmitModal
        isOpen
        onClose={() => {}}
        onSubmit={() => {}}
        previewMode
        embeddedPreview
        hideBrandSymbol
      />
    </div>
  );
}

export function TutorialChatTokenInteractivePreview() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const responseTimerRef = useRef(null);
  const isGenerating = messages.some(message => message.isTyping);
  const tokenUsed = estimateTutorialTokenUsage(messages, inputValue);

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
      <TutorialPreviewLeftPanel tokenUsed={tokenUsed} />
      <div className="flex min-w-0 flex-1">
        <div className="flex h-full min-h-0 min-w-0 flex-grow flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-white/65 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md">
            <ChatMessages
              messages={messages}
              isLoading={false}
              isInitialState={messages.length === 0}
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
                    ? 'tutorial-failure-session'
                    : null
                }
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
    <div className="relative flex h-full min-w-[1120px] w-full gap-6 overflow-hidden bg-[#E2E5E9] p-6">
      <TutorialPreviewLeftPanel />
      <TutorialPreviewCenterPanel />
    </div>
  );
}
