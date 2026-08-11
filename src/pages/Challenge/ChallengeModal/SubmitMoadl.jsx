import React, { useCallback, useEffect, useRef, useState } from 'react';
import useModalStore from '@/stores/useModalStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { useJudgeMutation } from '@/hooks/useJudgeMutation';
import { buildJudgeResultPanels, isPassedSubmission } from '../utils/judgeResultPresentation';
import CancelSvg from '@/assets/icons/cancel.svg';
import ArenaSvg from '@/assets/icons/Arena.svg';
import { appToast } from '@/components/Toast/appToast';

const CancelIcon = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-[30px] right-[30px] w-[18px] h-[18px] cursor-pointer z-[5000]"
  >
    <img src={CancelSvg} alt="닫기" className="w-full h-full" />
  </div>
);

const SubmitModal = ({
  setProgress = () => {},
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  previewMode = false,
  embeddedPreview = false,
  hideBrandSymbol = false,
  hideHeaderSymbol = false,
}) => {
  const [cooldown, setCooldown] = useState(0);
  const [cooldownSessionId, setCooldownSessionId] = useState(null);
  const cooldownTimerRef = useRef(null);
  const requestControllerRef = useRef(null);
  const judgeMutation = useJudgeMutation();
  const isSubmitModalOpen = useModalStore(state => state.isSubmitModalOpen);
  const {
    closeSubmitModal,
    openLoadingModal,
    closeLoadingModal,
    openSuccessModal,
    openFailedModal,
    setChallengeResults,
    setChallengeRewardPoints,
  } = useModalStore();
  const sessionId = useSessionStore(state => state.sessionId);
  const setSessionStatus = useSessionStore(state => state.setSessionStatus);
  const shouldShow = previewMode ? isOpen : isSubmitModalOpen;
  const handleClose = previewMode ? onClose : closeSubmitModal;
  const showHeaderSymbol = !hideBrandSymbol && !hideHeaderSymbol;
  const displayedCooldown = cooldownSessionId === sessionId ? cooldown : 0;

  const startCooldown = useCallback((targetSessionId, seconds) => {
    window.clearInterval(cooldownTimerRef.current);
    setCooldownSessionId(targetSessionId);
    setCooldown(seconds);

    cooldownTimerRef.current = window.setInterval(() => {
      setCooldown(previous => {
        if (previous <= 1) {
          window.clearInterval(cooldownTimerRef.current);
          cooldownTimerRef.current = null;
          return 0;
        }
        return previous - 1;
      });
    }, 1_000);
  }, []);

  useEffect(
    () => () => {
      window.clearInterval(cooldownTimerRef.current);
      requestControllerRef.current?.abort();
    },
    []
  );

  const submitForJudgement = useCallback(async () => {
    if (previewMode) {
      onSubmit();
      onClose();
      return;
    }

    if (!sessionId) {
      appToast.error('제출할 세션 정보가 없습니다.');
      closeSubmitModal();
      return;
    }

    if (displayedCooldown > 0) {
      appToast.info(`${displayedCooldown}초 후에 다시 시도해 주세요.`);
      return;
    }

    const controller = new AbortController();
    requestControllerRef.current = controller;
    let progressInterval;

    try {
      closeSubmitModal();
      openLoadingModal();
      setProgress(0);

      let fakeProgress = 0;
      progressInterval = window.setInterval(() => {
        fakeProgress += 0.02;
        setProgress(Math.min(fakeProgress, 0.95));
      }, 100);

      const job = await judgeMutation.mutateAsync({
        sessionId,
        signal: controller.signal,
        onAccepted: () => startCooldown(sessionId, 30),
      });
      const submission = job.submission;

      if (!submission) {
        throw new Error('완료된 판정 결과를 확인하지 못했습니다.');
      }

      setProgress(1);
      setChallengeResults(buildJudgeResultPanels(submission));
      setChallengeRewardPoints(submission.score ?? null);
      if (isPassedSubmission(submission)) {
        setSessionStatus('success');
        openSuccessModal();
      } else {
        setSessionStatus('fail');
        openFailedModal();
      }
    } catch (error) {
      if (error.name === 'AbortError') return;

      setProgress(0);
      if (error.status === 429) {
        const retryAfter = Number(error.details?.detail?.retry_after_sec) || 30;
        startCooldown(sessionId, retryAfter);
        appToast.error(
          `${error.message || '잠시 후 다시 제출해 주세요.'} (${retryAfter}초 후 재시도 가능)`,
          { duration: 7000 }
        );
        return;
      }

      appToast.error(error.message || 'Judge 제출에 실패했습니다.');
    } finally {
      window.clearInterval(progressInterval);
      requestControllerRef.current = null;
      closeLoadingModal();
    }
  }, [
    closeLoadingModal,
    closeSubmitModal,
    displayedCooldown,
    judgeMutation,
    onClose,
    onSubmit,
    openFailedModal,
    openLoadingModal,
    openSuccessModal,
    previewMode,
    sessionId,
    setChallengeResults,
    setChallengeRewardPoints,
    setProgress,
    setSessionStatus,
    startCooldown,
  ]);

  if (!shouldShow) return null;

  return (
    <div
      className={`${embeddedPreview ? 'absolute' : 'fixed'} inset-0 z-[9999] flex items-center justify-center bg-[rgba(1,1,1,0.6)]`}
    >
      <div className="relative w-[440px] h-[586.46px] bg-white rounded-[24px] box-border border border-[#EEF0F4] shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
        <CancelIcon onClick={handleClose} />

        <div className="absolute left-[30px] top-[17px] w-[105px] h-[42px] flex items-center">
          {showHeaderSymbol ? (
            <div className="w-[29px] h-[42px] flex justify-center items-center">
              <img src={ArenaSvg} alt="ARENA 로고" className="w-full h-full" />
            </div>
          ) : null}
          <span
            className={`${showHeaderSymbol ? 'ml-[9px]' : ''} text-card-title font-strong text-[#FF084A]`}
          >
            ARENA
          </span>
        </div>

        {!hideBrandSymbol ? (
          <div className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[148px] h-[218px] flex justify-center items-center">
            <img src={ArenaSvg} alt="제출 아이콘" className="w-full h-full opacity-30" />
          </div>
        ) : null}

        <div className="absolute w-[380px] left-[30px] top-[340px] text-center text-card-title font-medium text-[#0F172A] m-0 whitespace-pre-wrap">
          <p>제출 시 3개의 JUDGE AI가 판정합니다.</p>
          <p>제출 후 30초간 다시 제출할 수 없습니다.</p>
        </div>

        <button
          type="button"
          onClick={submitForJudgement}
          className={`absolute w-[380px] h-[60.45px] left-[30px] top-[496.28px]
            flex justify-center items-center rounded-[18px] transition-all duration-200
            ${
              displayedCooldown > 0 || judgeMutation.isPending
                ? 'bg-[#D9DADB] text-[#515151] cursor-not-allowed'
                : 'cursor-pointer bg-[#FF4854] shadow-[0_3px_8px_rgba(255,72,84,0.16)] hover:-translate-y-[1px] hover:bg-[#FF4854]/90 hover:shadow-[0_5px_12px_rgba(255,72,84,0.18)]'
            }`}
          disabled={
            previewMode ? false : !sessionId || displayedCooldown > 0 || judgeMutation.isPending
          }
        >
          <span className="text-card-title font-strong text-white">
            {judgeMutation.isPending
              ? '제출 중...'
              : displayedCooldown > 0
                ? `재시도 ${displayedCooldown}s`
                : '제출하기'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SubmitModal;
