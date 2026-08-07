import FailedModal from '@/pages/Challenge/ChallengeModal/FailedModal';
import SuccessModal from '@/pages/Challenge/ChallengeModal/SuccesModal';
import { failedPanelsData, successPanelsData } from '@/pages/Challenge/data/challengeModalData';
import NeuroHeroBackground from './NeuroHeroBackground';

function ModalPreviewFrame({
  children,
  bare = false,
  surface = 'dark',
  className = '',
  innerHeightClassName = 'min-h-[28rem]',
}) {
  if (bare) {
    return <div className="flex items-center justify-center">{children}</div>;
  }

  const isGraySurface = surface === 'gray';

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border ${
        isGraySurface
          ? 'border-[#E2E5E9] bg-[#E2E5E9] px-6 py-1 sm:px-10 sm:py-2'
          : 'border-white/10 bg-[linear-gradient(180deg,#090b11_0%,#050608_100%)] p-1 sm:p-2'
      } ${className}`}
    >
      {!isGraySurface ? (
        <>
          <div className="absolute inset-0" aria-hidden="true">
            <NeuroHeroBackground randomStart />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,72,84,0.14),transparent_24%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_50%_78%,rgba(255,72,84,0.1),transparent_24%)]" />
        </>
      ) : null}
      <div className={`relative flex items-center justify-center ${innerHeightClassName}`}>
        {children}
      </div>
    </div>
  );
}

export function FailedJudgeModelPreview({ bare = false, surface = 'dark' }) {
  const previewResults = failedPanelsData.map(data => ({
    status: 'failed',
    data: {
      ...data,
      title: data.animalName,
    },
  }));

  return (
    <ModalPreviewFrame bare={bare} surface={surface}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-[296px] w-[466px] sm:h-[359px] sm:w-[551px]">
          <div className="absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.54] sm:scale-[0.64]">
            <FailedModal
              isOpen
              onClose={() => {}}
              previewMode
              previewResults={previewResults}
              embeddedPreview
            />
          </div>
        </div>
      </div>
    </ModalPreviewFrame>
  );
}

export function SuccessJudgeModelPreview({ bare = false, surface = 'dark' }) {
  return (
    <ModalPreviewFrame bare={bare} surface={surface}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-[296px] w-[466px] sm:h-[359px] sm:w-[551px]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center scale-[0.54] sm:scale-[0.64]">
            <SuccessModal
              isOpen
              onClose={() => {}}
              previewMode
              previewTitle={successPanelsData[0]?.title}
              embeddedPreview
            />
          </div>
        </div>
      </div>
    </ModalPreviewFrame>
  );
}
