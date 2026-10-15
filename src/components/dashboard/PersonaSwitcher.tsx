import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Sparkles } from 'lucide-react';
import { PersonaCategory } from '../../types';

interface PersonaSwitcherProps {
  value: PersonaCategory | 'all';
  onChange: (val: PersonaCategory | 'all') => void;
  counts: {
    all: number;
    personal: number;
    career: number;
  };
  className?: string;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  value,
  onChange,
  counts,
  className = '',
}) => {
  const tabs: { id: PersonaCategory | 'all'; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: 'all',
      label: 'All Circles',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      count: counts.all,
    },
    {
      id: 'personal',
      label: 'Personal Circle',
      icon: <Users className="w-3.5 h-3.5" />,
      count: counts.personal,
    },
    {
      id: 'career',
      label: 'Career & Mentors',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      count: counts.career,
    },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md ${className}`}
      role="tablist"
      aria-label="Filter by relationship persona"
    >
      {tabs.map((tab) => {
        const isActive = value === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 select-none ${
              isActive
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="personaActiveTab"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/60 dark:border-white/10"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
