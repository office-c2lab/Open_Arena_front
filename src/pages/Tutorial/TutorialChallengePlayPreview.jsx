import React, { useMemo, useState } from 'react';
import ChallengePlayBg from '@/assets/images/chalbg.png';
import ArenaIcon from '@/assets/icons/Arena.svg';
import SendIcon from '@/assets/icons/sendBtn.svg';
import ResetIcon from '@/assets/icons/reset.svg';
import PurpleDownIcon from '@/assets/icons/purple-downbtn.svg';
import ChallengeInfoPanel from '@/pages/Challenge/components/ChallengeInfoPanel';
import ChatMessages from '@/pages/Challenge/components/ChatArea/ChatMessages';
import ChatInput from '@/pages/Challenge/components/ChatArea/ChatInput';
import ChatControls from '@/pages/Challenge/components/ChatArea/ChatControls';
import AttemptHistoryPanel from '@/pages/Challenge/components/AttemptHistoryPanel';
import { TABS } from '@/pages/Challenge/data/challengeData';

const PREVIEW_HEADER_INFO = {
  title: '튜토리얼',
  subtitle: '챌린지 화면에 처음 들어오면 보이는 기본 구성을 살펴봅니다.',
  category: '튜토리얼',
  score: 100,
};

const PREVIEW_CONTENT = {
  description: {
    title: '챌린지 개요',
    content:
      '챌린지는 문제 정보를 읽고, AI와 대화하고, 조건을 만족했다고 판단되면 제출하는 흐름으로 진행됩니다.',
  },
  goal: {
    title: '도전 목표',
    content: '문제에서 요구하는 목표 응답을 AI와의 대화를 통해 만들어내는 것입니다.',
  },
  success: {
    title: '성공 조건',
    content: '제출한 대화가 문제의 목표와 성공 조건을 충족하면 성공으로 판정됩니다.',
  },
  failure: {
    title: '실패 조건',
    content: '목표 응답이 부족하거나, 성공 조건에 필요한 내용이 빠져 있으면 실패로 판정됩니다.',
  },
};

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

export function TutorialPreviewCenterPanel() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-grow flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-white/65 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md">
        <ChatMessages
          messages={[]}
          isLoading={false}
          isInitialState={true}
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

export function TutorialPreviewRightPanel({ sessions = [] }) {
  return (
    <AttemptHistoryPanel
      PurpleDownIcon={PurpleDownIcon}
      isLoading={false}
      sessions={sessions}
      problemId={undefined}
      teamId={undefined}
    />
  );
}

export default function TutorialChallengePlayPreview() {
  return (
    <div
      className="flex h-full min-w-[1120px] w-full gap-6 bg-[#F8F3F6] bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: `url(${ChallengePlayBg})`,
        backgroundSize: '100% 100%',
      }}
    >
      <TutorialPreviewLeftPanel />
      <TutorialPreviewCenterPanel />
      <TutorialPreviewRightPanel />
    </div>
  );
}
