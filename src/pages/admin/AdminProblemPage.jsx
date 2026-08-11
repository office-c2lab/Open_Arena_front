import { useState } from 'react';
import AdminProblemCreatePage from './AdminProblemCreatePage';
import AdminProblemManagementPage from './AdminProblemManagementPage';
import {
  CategoryManagement,
  ChallengeSetting,
  EndpointManagement,
} from './AdminChallengeResourceManagement';

const TABS = [
  ['problems', '문제 관리'],
  ['create', '문제 생성'],
  ['categories', '카테고리'],
  ['chat-endpoints', 'Chat 엔드포인트'],
  ['judge-endpoints', 'Judge 엔드포인트'],
  ['setting', '운영 설정'],
];

export default function AdminProblemPage() {
  const [activeTab, setActiveTab] = useState('problems');

  return (
    <div className="mx-auto w-full max-w-7xl p-8 pb-40">
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={`rounded-xl border px-5 py-3 font-bold transition ${activeTab === value ? 'scale-[1.03] border-[#FF4854] bg-[#FF4854] text-white shadow-[0_0_15px_rgba(255,72,84,0.55)]' : 'border-gray-600 bg-[#1A0B15]/60 text-gray-300 hover:bg-[#2a0f1f]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'problems' && <AdminProblemManagementPage />}
      {activeTab === 'create' && <AdminProblemCreatePage />}
      {activeTab === 'categories' && <CategoryManagement />}
      {activeTab === 'chat-endpoints' && <EndpointManagement kind="chat" />}
      {activeTab === 'judge-endpoints' && <EndpointManagement kind="judge" />}
      {activeTab === 'setting' && <ChallengeSetting />}
    </div>
  );
}
