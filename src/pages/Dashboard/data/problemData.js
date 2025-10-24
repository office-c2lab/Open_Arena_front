// src/data/problemData.js (최종, 색상 값 없는 버전)

/**
 * 문제 목록 데이터 (순수 데이터 및 상태만 포함)
 * - status: 'SUCCESS', 'UNSUBMITTED', 'LOCKED' 중 하나
 * - result: 'SUCCESS'일 경우 표시되는 텍스트
 */
export const problemData = [
  // SUCCESS
  { id: 1, title: 'The Infinite Loop', status: 'SUCCESS', result: '성공' },
  // UNSUBMITTED
  { id: 2, title: 'Segfault Symphony', status: 'UNSUBMITTED' },
  { id: 3, title: 'The Compiler’s...', status: 'SUCCESS', result: '성공' },
  { id: 4, title: 'The Deceptive Code', status: 'SUCCESS', result: '성공' },

  { id: 5, title: 'Shadow Variable', status: 'SUCCESS', result: '성공' },
  { id: 6, title: 'Syntax of Dece...', status: 'SUCCESS', result: '성공' },
  { id: 7, title: 'The Refactor R...', status: 'UNSUBMITTED' },
  { id: 8, title: 'NullPoint Nexus', status: 'UNSUBMITTED' },

  { id: 9, title: 'The Infinite Loop', status: 'SUCCESS', result: '성공' },
  { id: 10, title: 'Patient Zero', status: 'SUCCESS', result: '성공' },
  { id: 11, title: 'Vital Error', status: 'SUCCESS', result: '성공' },
  { id: 12, title: 'The Triage Pr...', status: 'SUCCESS', result: '성공' },

  { id: 13, title: 'Code of Lies', status: 'SUCCESS', result: '성공' },
  { id: 14, title: 'Turing’s Reve...', status: 'UNSUBMITTED' },
  { id: 15, title: 'The Empathy...', status: 'SUCCESS', result: '성공' },
  { id: 16, title: 'Echo Chamber', status: 'SUCCESS', result: '성공' },

  { id: 17, title: 'Therapist.exe', status: 'SUCCESS', result: '성공' },
  { id: 18, title: 'False Comfort', status: 'UNSUBMITTED' },
  { id: 19, title: 'The Mirror Eff...', status: 'SUCCESS', result: '성공' },
  { id: 20, title: 'Emotion Leak', status: 'SUCCESS', result: '성공' },

  // LOCKED
  { id: 21, title: 'The Silent Listener', status: 'LOCKED' },
  { id: 22, title: 'Bias in Kindness', status: 'LOCKED' },
  { id: 23, title: 'Black Box Portfolio', status: 'LOCKED' },
  { id: 24, title: 'The Risk Illusion', status: 'LOCKED' },

  { id: 25, title: 'Market Mirage', status: 'LOCKED' },
  { id: 26, title: 'Insider Algorithm', status: 'LOCKED' },
  { id: 27, title: 'Crash Catalyst', status: 'LOCKED' },
  { id: 28, title: 'Audit Protocol', status: 'LOCKED' },

  { id: 29, title: 'Trust Deficit', status: 'LOCKED' },
  { id: 30, title: 'The Invisible Trade', status: 'LOCKED' },
  { id: 31, title: 'Greed.exe', status: 'LOCKED' },
  { id: 32, title: 'The Diagnosis Paradox', status: 'LOCKED' },
];
