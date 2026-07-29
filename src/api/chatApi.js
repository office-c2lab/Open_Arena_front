import { emptyList } from './localMockData';

export const createSession = async ({ title } = {}) => ({
  id: 'local-session',
  title: title || 'Local Session',
});

export const getSessionMessages = async () => emptyList;
export const sendMessage = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    assistant_content: '답변 목업입니다.',
  };
};
