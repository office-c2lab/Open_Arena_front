import { Routes, Route } from 'react-router-dom';
import DefaultLayout from '../ui/DefaultLayout';
import ChallengeLayout from '../ui/ChallengeLayout';

import Home from '../pages/Home';
import About from '../pages/About';
import Challenge from '../pages/Challenge';
import Login from '../pages/Login/Login';

export default function AppRouter() {
  return (
    <Routes>
      {/* DefaultLayout 하위 Route */}
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ChallengeLayout 하위 Route */}
      <Route element={<ChallengeLayout />}>
        <Route path="/challenge" element={<Challenge />} />
      </Route>
    </Routes>
  );
}
