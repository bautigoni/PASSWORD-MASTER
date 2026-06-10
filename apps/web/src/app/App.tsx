import { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainMenuPage } from '@/features/menu/MainMenuPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { CampaignPage } from '@/features/campaign/CampaignPage';
import { GamePage } from '@/features/game/GamePage';
import { SandboxPage } from '@/features/sandbox/SandboxPage';
import { LaboratoryPage } from '@/features/laboratory/LaboratoryPage';
import { ShopPage } from '@/features/shop/ShopPage';
import { AchievementsPage } from '@/features/achievements/AchievementsPage';
import { PetsPage } from '@/features/pets/PetsPage';
import { MultiplayerPage } from '@/features/multiplayer/MultiplayerPage';
import { TeacherPage } from '@/features/teacher/TeacherPage';
import { ChallengePage } from '@/features/challenge/ChallengePage';
import { ToastViewport } from '@/shared/ui/Toast';
import { useAuth } from '@/shared/state/authStore';

export default function App() {
  const hydrate = useAuth((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route path="/" element={<MainMenuPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/campaign" element={<CampaignPage />} />
        <Route path="/play/:levelId" element={<GamePage mode="campaign" />} />
        <Route path="/sandbox" element={<SandboxPage />} />
        <Route path="/play/sandbox/:levelId" element={<GamePage mode="sandbox" />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/play/challenge/:levelId" element={<GamePage mode="challenge" />} />
        <Route path="/laboratory" element={<LaboratoryPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/multiplayer" element={<MultiplayerPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastViewport />
    </Suspense>
  );
}

function SplashScreen() {
  return (
    <div className="min-h-screen grid place-items-center">
      <motion.div
        className="font-display text-4xl title-grad"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        PASSWORD MASTER
      </motion.div>
    </div>
  );
}
