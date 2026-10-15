import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Clock,
  BarChart3,
  Search,
  UserPlus,
  RotateCcw,
  Menu,
  X,
  Command,
  Compass,
  Zap,
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <Users className="w-4 h-4" /> },
    { name: 'Timeline', path: '/timeline', icon: <Clock className="w-4 h-4" /> },
    { name: 'Analytics', path: '/stats', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleResetDemo = () => {
    resetToDemoData();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center group">
              <BrandLogo size="md" showText={true} showBadge={true} />
            </NavLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Actions, Command Trigger, Theme & Modals */}
          <div className="flex items-center gap-2.5">
            {/* 5-Min Reconnect Sprint CTA */}
            <button
              type="button"
              onClick={openSprintModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-amber-500/30 dark:border-amber-400/30 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs"
              title="5-Minute Reconnect Sprint (Cmd+J)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-current animate-pulse" />
              <span className="hidden sm:inline">Sprint</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                <Command className="w-2.5 h-2.5" /> J
              </kbd>
            </button>

            {/* Quick Command Trigger Badge Button */}
            <button
              type="button"
              onClick={() => openCommandPalette()}
              className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-all group shadow-2xs"
              title="Quick Check-In / Search"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              <span>Quick Action</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Add Friend Trigger */}
            <button
              type="button"
              onClick={openAddFriendModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Contact</span>
            </button>

            {/* Platform Guide Tour Trigger */}
            <button
              type="button"
              onClick={openGuideModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-semibold transition-colors shadow-2xs"
              title="Platform Guide & Walkthrough"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline">Guide</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset Sandbox Demo Data (12 contacts & 60+ logs)"
              aria-label="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

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
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCommandPalette();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="w-4 h-4" />
              Quick Command (⌘K)
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openGuideModal();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              Platform Guide & Tour
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
