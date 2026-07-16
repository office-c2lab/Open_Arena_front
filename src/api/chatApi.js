import { emptyList } from './localMockData';

export const createSession = async ({ title } = {}) => ({
  id: 'local-session',
  title: title || 'Local Session',
});

export const getSessionMessages = async () => emptyList;
export const sendMessage = async ({ content } = {}) => ({
  id: crypto.randomUUID?.() || String(Date.now()),
  role: 'user',
  content: content || '',
});
