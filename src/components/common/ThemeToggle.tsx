import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Trees, Check } from 'lucide-react';
import { useFriends } from '../../context/FriendContext';
import { ThemeMode } from '../../types';

const THEME_OPTIONS: {
  id: ThemeMode;
  label: string;
  subtitle: string;
  swatch: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'light',
    label: 'Light',
    subtitle: 'Crisp Alabaster',
    swatch: 'bg-slate-100 border-slate-300',
    icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
  },
  {
    id: 'dark',
    label: 'Dark',
    subtitle: 'Midnight Slate',
    swatch: 'bg-slate-900 border-slate-700',
    icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
  },
  {
    id: 'forest',
    label: 'Forest',
    subtitle: 'Evergreen Night',
    swatch: 'bg-[#0a1a14] border-teal-500/60',
    icon: <Trees className="w-3.5 h-3.5 text-teal-400" />,
  },
];

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useFriends();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const activeOption =
    THEME_OPTIONS.find((opt) => opt.id === theme) || THEME_OPTIONS[0];

  const triggerButtonClasses =
    theme === 'light'
      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
      : theme === 'forest'
      ? 'bg-slate-900 border-slate-700 text-teal-300 hover:bg-slate-800 hover:text-teal-200 shadow-sm'
      : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750 hover:text-amber-200 shadow-sm';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center ${triggerButtonClasses} ${className}`}
        title={`Theme: ${activeOption.label} (${activeOption.subtitle})`}
        aria-label="Choose theme"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {theme === 'forest' ? (
          <Trees className="w-4 h-4 transition-transform duration-300" />
        ) : theme === 'dark' ? (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme selection"
          className="absolute right-0 mt-2 w-48 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 text-xs space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Appearance
          </div>
          {THEME_OPTIONS.map((option) => {
            const isActive = theme === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setTheme(option.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 font-medium'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${option.swatch}`}
                  >
                    {option.icon}
                  </span>
                  <span className="text-left">
                    <span className="block leading-tight">{option.label}</span>
                    <span className="block text-[10px] font-normal text-slate-400 dark:text-slate-500">
                      {option.subtitle}
                    </span>
                  </span>
                </span>
                {isActive && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
