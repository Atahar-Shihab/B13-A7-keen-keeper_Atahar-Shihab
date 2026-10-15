import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { Toaster } from 'sonner';

import { FriendProvider, useFriends } from './context/FriendContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CommandPalette } from './components/command/CommandPalette';
import { AddFriendModal } from './components/common/AddFriendModal';
import { PlatformGuideModal } from './components/common/PlatformGuideModal';
import { ReconnectSprintModal } from './components/sprint/ReconnectSprintModal';

import Home from './pages/Home';
import FriendDetails from './pages/FriendDetails';
import Timeline from './pages/Timeline';
import Stats from './pages/Stats';
import NotFound from './pages/NotFound';

const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

const GlobalShortcutsAndModals: React.FC = () => {
  const {
    openCommandPalette,
    isCommandPaletteOpen,
    closeCommandPalette,
    openSprintModal,
    isSprintModalOpen,
    closeSprintModal,
  } = useFriends();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K -> Quick check-in command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isCommandPaletteOpen) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
      }
      // Cmd/Ctrl + J -> 5-Minute Reconnect Sprint
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        if (isSprintModalOpen) {
          closeSprintModal();
        } else {
          openSprintModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    openCommandPalette,
    isCommandPaletteOpen,
    closeCommandPalette,
    openSprintModal,
    isSprintModalOpen,
    closeSprintModal,
  ]);

  return (
    <>
      <CommandPalette />
      <AddFriendModal />
      <PlatformGuideModal />
      <ReconnectSprintModal />
      <Toaster richColors position="bottom-right" closeButton />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <FriendProvider>
      <SmoothScrollProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
            <Navbar />
            <GlobalShortcutsAndModals />
            <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/friend/:id" element={<FriendDetails />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </SmoothScrollProvider>
    </FriendProvider>
  );
};

export default App;
