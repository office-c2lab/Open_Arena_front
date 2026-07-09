import React from 'react';

function SessionCard({ session, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(session.id)}
      className={`p-3 rounded-[14px] cursor-pointer border backdrop-blur-md transition-all duration-200 hover:bg-white/64 ${
        isActive
          ? 'border-[#837BBD]/70 bg-white/66 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_6px_16px_rgba(131,123,189,0.14)]'
          : 'border-white/60 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(15,23,42,0.05)]'
      } mb-2`}
    >
      <p className="font-bold text-[#0F172A]">{session.title}</p>
      <p className="text-sm text-gray-500">{new Date(session.created_at).toLocaleString()}</p>
    </div>
  );
}

export default function SessionList({ sessions = [], sessionId, onSessionClick }) {
  if (!Array.isArray(sessions) || sessions.length === 0) return null;

  return (
    <div className="p-4 flex flex-col max-h-[200px] overflow-y-auto">
      {sessions.map(s => (
        <SessionCard
          key={s.id}
          session={s}
          isActive={s.id === sessionId}
          onClick={onSessionClick}
        />
      ))}
    </div>
  );
}
