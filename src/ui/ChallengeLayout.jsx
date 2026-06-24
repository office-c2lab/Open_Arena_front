// src/layouts/ChallengeLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function ChallengeLayout() {
  return (
    <div className="min-h-screen w-full bg-[#F2F4F6]">
      <main className="h-screen overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
