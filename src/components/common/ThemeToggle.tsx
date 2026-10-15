import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useFriends } from '../../context/FriendContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useFriends();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750 hover:text-amber-200 shadow-sm'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
      } ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};
