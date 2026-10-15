import React, { useId } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | number;
  showText?: boolean;
  showBadge?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  showBadge = true,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const bgId = `kk-bg-${uid}`;
  const glowId = `kk-glow-${uid}`;
  const shadowId = `kk-shadow-${uid}`;

  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 28
      : size === 'lg'
      ? 44
      : 36;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Vector Emblem */}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 64 64"
        className="shrink-0 transition-transform group-hover:scale-105 duration-200"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="55%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#4F46E5" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Squircle Base */}
        <rect width="64" height="64" rx="16" fill={`url(#${bgId})`} filter={`url(#${shadowId})`} />
        <rect
          x="0.75"
          y="0.75"
          width="62.5"
          height="62.5"
          rx="15.25"
          stroke="#FFFFFF"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Orbit Cadence Arc */}
        <path
          d="M 40 14 C 54 20, 58 38, 48 50"
          fill="none"
          stroke="#6EE7B7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="2 3.5"
          strokeOpacity="0.8"
        />

        {/* Geometric 'K' Mark: Vertical Pillar */}
        <rect x="16" y="15" width="8" height="34" rx="4" fill={`url(#${glowId})`} />

        {/* Upper Arm */}
        <path
          d="M 23 31 L 38.5 15.5 C 40 14 42.5 14 44 15.5 C 45.5 17 45.5 19.5 44 21 L 29 36 Z"
          fill={`url(#${glowId})`}
        />

        {/* Lower Arm */}
        <path
          d="M 27 33 L 42 48 C 43.5 49.5 43.5 52 42 53.5 C 40.5 55 38 55 36.5 53.5 L 22 39 Z"
          fill={`url(#${glowId})`}
        />

        {/* Active Relationship Pulse Node */}
        <circle cx="46" cy="32" r="5" fill="#10B981" />
        <circle cx="46" cy="32" r="2.2" fill="#FFFFFF" />
      </svg>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
              KeenKeeper
            </span>
            {showBadge && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wide rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                v2.0
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-0.5">
            Relationship Intelligence OS
          </span>
        </div>
      )}
    </div>
  );
};
