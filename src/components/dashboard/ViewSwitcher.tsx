import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Orbit, Columns3 } from 'lucide-react';

export type DashboardViewMode = 'grid' | 'radar' | 'pipeline';

interface ViewSwitcherProps {
  value: DashboardViewMode;
  onChange: (val: DashboardViewMode) => void;
  className?: string;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const views: { id: DashboardViewMode; label: string; icon: React.ReactNode }[] = [
    {
      id: 'grid',
      label: 'Bento Grid',
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
    },
    {
      id: 'radar',
      label: 'Orbital Radar',
      icon: <Orbit className="w-3.5 h-3.5" />,
    },
    {
      id: 'pipeline',
      label: 'Pipeline Board',
      icon: <Columns3 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md ${className}`}
      role="tablist"
      aria-label="Switch dashboard view"
    >
      {views.map((v) => {
        const isActive = value === v.id;
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(v.id)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 select-none ${
              isActive
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="viewActiveTab"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/60 dark:border-white/10"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {v.icon}
              <span className="hidden sm:inline">{v.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
