import { emptyList } from './localMockData';

export const createSession = async ({ title } = {}) => ({
  id: 'local-session',
  title: title || 'Local Session',
});

export const getSessionMessages = async () => emptyList;
export const sendMessage = async () => ({
  assistant_content: '답변 목업입니다.',
});
