import React, { useState } from "react";
import AdminProblemToggleList from "./AdminProblemToggleList";
import AdminProblemCreatePage from "./AdminProblemCreatePage";

const TABS = ["문제 활성/비활성", "문제 생성"];

export default function AdminProblemPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">

      {/* 탭 UI */}
      <div className="flex gap-3 mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-5 py-2 rounded-full font-semibold text-sm transition-all
              ${activeTab === tab 
                ? "bg-[#FF4854] text-white shadow-[0_0_10px_rgba(255,72,84,0.7)]"
                : "bg-white text-gray-600 border hover:bg-gray-100"}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      {activeTab === "문제 활성/비활성" && <AdminProblemToggleList />}
      {activeTab === "문제 생성" && <AdminProblemCreatePage />}
    </div>
  );
}
