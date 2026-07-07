// src/pages/AdminProblems/AdminProblemManagementPage.jsx
import React, { useState } from 'react';
import { useAdminProblemsQuery } from '@/hooks/useAdminProblemsQuery';
import { useAdminToggleProblemActive } from '@/hooks/useAdminToggleProblemActive';
import ProblemEditModal from './ProblemEditModal';
import AdminProblemCreatePage from './AdminProblemCreatePage';
import ToggleSwitch from './ToggleSwitch';

export default function AdminProblemManagementPage({ activeOnly = false, onActiveOnlyToggle }) {
  const { data, isLoading } = useAdminProblemsQuery({ activeOnly });
  const toggle = useAdminToggleProblemActive();

  const [editingProblem, setEditingProblem] = useState(null);

  if (isLoading) return <div className="text-white">로딩 중...</div>;

  return (
    <div className="p-10 text-white max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-[#FF4854]">문제 관리</h1>

        <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0B021C]/70 border border-white/10 text-white cursor-pointer">
          <ToggleSwitch enabled={activeOnly} onToggle={onActiveOnlyToggle} />
          <span className="font-bold whitespace-nowrap">활성 문제만 보기</span>
        </label>
      </div>

      {/* 문제 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        {data?.map(p => (
          <div
            key={p.id}
            className="p-5 bg-[#0B021C]/70 border border-[#FF4854]/40 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">{p.title}</h2>

              <button
                onClick={() => toggle.mutate(p.id)}
                className={`px-3 py-1 text-sm rounded-lg  cursor-pointer ${
                  p.is_active ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                {p.is_active ? '활성' : '비활성'}
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-4">{p.description?.slice(0, 80)}...</p>

            <button
              onClick={() => setEditingProblem(p)}
              className="w-full py-2 rounded-lg bg-[#FF4854] hover:bg-[#e13a47] transition cursor-pointer"
            >
              수정 / 삭제
            </button>
          </div>
        ))}
      </div>

      {editingProblem && (
        <ProblemEditModal problem={editingProblem} onClose={() => setEditingProblem(null)} />
      )}
    </div>
  );
}
