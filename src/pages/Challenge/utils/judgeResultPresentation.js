import { failedPanelsData, successPanelsData } from '../data/challengeModalData';

const normalizeJudgementVerdict = verdict => {
  if (verdict === 'passed') return 'success';
  if (verdict === 'review') return 'review';
  return 'failed';
};

export const isPassedSubmission = submission => submission?.verdict === 'passed';

export const buildJudgeResultPanels = submission => {
  const judgements = submission?.judgements?.length
    ? submission.judgements
    : [
        {
          model: submission?.is_manual ? '관리자 수동 판정' : 'Judge',
          verdict: submission?.verdict || 'failed',
          reason: submission?.manual_reason || '판정 결과를 확인하지 못했습니다.',
        },
      ];

  return judgements.map((judgement, index) => {
    const status = normalizeJudgementVerdict(judgement.verdict);
    const basePanels = status === 'success' ? successPanelsData : failedPanelsData;
    const baseData = basePanels[index % basePanels.length];

    return {
      status,
      data: {
        ...baseData,
        title: judgement.model,
        modelName: judgement.model,
        description: judgement.reason,
      },
    };
  });
};
