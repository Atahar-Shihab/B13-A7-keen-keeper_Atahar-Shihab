import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Clock,
  BarChart3,
  Search,
  Plus,
  RotateCcw,
  Menu,
  X,
  Compass,
  Zap,
  MoreHorizontal,
} from 'lucide-react';
import { useFriends } from '../../context/FriendContext';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const {
    openCommandPalette,
    openAddFriendModal,
    resetToDemoData,
    openGuideModal,
    openSprintModal,
  } = useFriends();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    if (moreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreMenuOpen]);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <Users className="w-3.5 h-3.5" /> },
    { name: 'Timeline', path: '/timeline', icon: <Clock className="w-3.5 h-3.5" /> },
    { name: 'Analytics', path: '/stats', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  const handleResetDemo = () => {
    resetToDemoData();
    setShowResetConfirm(false);
    setMoreMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/70 dark:border-slate-800/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
          {/* Left: Brand Identity & Segmented Nav */}
          <div className="flex items-center gap-6 sm:gap-8">
            <NavLink to="/" className="flex items-center group transition-transform active:scale-95">
              <BrandLogo size={30} showText={true} showBadge={false} showSubtitle={false} />
            </NavLink>

            {/* Desktop Segmented Navigation Pills */}
            <nav className="hidden md:flex items-center p-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center/Right: Human-Crafted Search, Action & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Minimal Command Bar Trigger */}
            <button
              type="button"
              onClick={() => openCommandPalette()}
              className="hidden sm:flex items-center justify-between gap-3 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs transition-all w-40 md:w-48 lg:w-56 group shadow-2xs"
              title="Search relationships or log check-in (Cmd+K)"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span className="text-slate-500 dark:text-slate-400 truncate">Search or jump to...</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Primary Action: Add Contact */}
            <button
              type="button"
              onClick={openAddFriendModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Contact</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Secondary Utilities Dropdown ("•••") */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  moreMenuOpen ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : ''
                }`}
                title="More options & tools"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      openSprintModal();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>5-Min Reconnect Sprint</span>
                    </span>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
                      ⌘J
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      openGuideModal();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-indigo-500" />
                    <span>How It Works (Guide)</span>
                  </button>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      setShowResetConfirm(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Sandbox Demo Data</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCommandPalette();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-3">
                <Search className="w-4 h-4" />
                <span>Quick Command</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-xs font-mono rounded bg-slate-100 dark:bg-slate-800">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openSprintModal();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <span className="flex items-center gap-3">
                <Zap className="w-4 h-4" />
                <span>5-Minute Sprint</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-xs font-mono rounded bg-amber-100 dark:bg-amber-900/50">
                ⌘J
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openGuideModal();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Compass className="w-4 h-4 text-indigo-500" />
              <span>Platform Guide & Tour</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowResetConfirm(true);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Sandbox Demo Data</span>
            </button>
          </div>
        )}
      </header>

      {/* Reset Demo Data Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset to Sandbox Demo Data?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                This will restore the full 6-month CRM benchmark with 12 realistic contacts,
                63 categorized historical interactions, and reset health decay calculations.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDemo}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
