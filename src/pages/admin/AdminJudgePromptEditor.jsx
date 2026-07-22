// src/pages/admin/AdminJudgePromptPage.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAdminProblemsQuery } from '@/hooks/useAdminProblemsQuery';
import { useJudgePromptQuery, useJudgePromptMutation } from '@/hooks/useAdminJudgePrompt';

export default function AdminJudgePromptPage() {
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 🔹 문제 전체 목록 가져오기
  const { data: problems = [], isLoading: problemsLoading } = useAdminProblemsQuery();
  const filteredProblems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return problems;

    return problems.filter(problem => {
      const searchableText = [problem.id, problem.title, problem.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [problems, searchKeyword]);

  const handleSearch = () => {
    setSearchKeyword(searchInput);
  };

  // 🔹 현재 선택된 문제의 프롬프트 GET
  const {
    data: promptData,
    isLoading: promptLoading,
    isError: promptError,
  } = useJudgePromptQuery(selectedProblemId, {
    enabled: !!selectedProblemId,
  });

  // 🔹 프롬프트 수정 (성공시 alert)
  const { mutate: savePrompt, isPending: isSaving } = useJudgePromptMutation(selectedProblemId, {
    onSuccess: () => {
      alert('수정되었습니다.');
    },
  });

  // 🔹 선택된 문제의 프롬프트를 textarea에 세팅
  useEffect(() => {
    if (promptData?.judge_system_prompt) {
      setPromptText(promptData.judge_system_prompt);
    } else {
      setPromptText('');
    }
  }, [promptData]);

  if (problemsLoading) {
    return <div className="text-white p-10">문제 목록 로딩 중...</div>;
  }

  return (
    <div className="w-full p-10 text-white flex gap-6">
      {/* ========================================
          🔹 왼쪽 — 문제 리스트
      ======================================== */}
      <div className="w-[300px] bg-[#0B021C]/70 border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold mb-4">문제 목록</h2>

        <div className="mb-4 flex flex-col gap-3">
          <label className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') handleSearch();
              }}
              placeholder="문제 검색"
              className="h-11 w-full rounded-lg border border-white/10 bg-[#1A0B15] pl-10 pr-4 text-white outline-none placeholder:text-gray-500 focus:border-[#FF4854]"
            />
          </label>
          <button
            type="button"
            onClick={handleSearch}
            className="h-11 rounded-lg bg-[#FF4854] px-5 font-bold text-white transition hover:bg-[#ff3242]"
          >
            검색
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
          {filteredProblems.length === 0 && (
            <div className="rounded-lg border border-white/10 bg-[#10050F]/50 p-4 text-sm text-gray-400">
              검색 결과가 없습니다.
            </div>
          )}
          {filteredProblems.map(problem => (
            <button
              key={problem.id}
              onClick={() => setSelectedProblemId(problem.id)}
              className={`
                text-left p-3 rounded-lg border
                ${
                  selectedProblemId === problem.id
                    ? 'bg-[#FF4854] border-[#FF4854] text-white'
                    : 'bg-[#10050F]/50 text-gray-200 border-white/10 hover:bg-[#1A0B15]'
                }
              `}
            >
              <div className="font-bold">{problem.title}</div>
              <div className="text-xs opacity-70">ID: {problem.id}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================
          🔹 오른쪽 — 프롬프트 에디터
      ======================================== */}
      <div className="flex-1 bg-[#0B021C]/70 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#FF4854] mb-4">Judge 프롬프트 수정</h2>

        {!selectedProblemId && (
          <div className="text-gray-400">문제를 선택하면 Judge 프롬프트를 수정할 수 있습니다.</div>
        )}

        {selectedProblemId && (
          <>
            {/* 로딩 & 에러 */}
            {promptLoading && <div className="text-white">프롬프트 불러오는 중...</div>}
            {promptError && <div className="text-red-400">프롬프트 불러오기 실패</div>}

            {/* textarea */}
            {!promptLoading && (
              <textarea
                className="
                  w-full h-[500px] p-4 text-white bg-[#1A0B15] 
                  rounded-lg border border-white/20
                "
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
              />
            )}

            {/* 수정 버튼 */}
            <button
              onClick={() => savePrompt(promptText)}
              disabled={isSaving}
              className="
                mt-4 px-6 py-3 rounded-lg font-bold text-white
                bg-[#FF4854] hover:bg-[#ff3242] transition
                disabled:opacity-50
              "
            >
              {isSaving ? '수정 중...' : '수정하기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
