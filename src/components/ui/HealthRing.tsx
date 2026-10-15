import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HealthStatus } from '../../types';

interface HealthRingProps {
  score: number;
  status?: HealthStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  strokeWidth?: number;
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

const SIZE_MAP = {
  sm: { diameter: 44, stroke: 4, textClass: 'text-[10px] font-extrabold' },
  md: { diameter: 56, stroke: 5, textClass: 'text-xs font-black' },
  lg: { diameter: 80, stroke: 7, textClass: 'text-lg font-black' },
  xl: { diameter: 120, stroke: 10, textClass: 'text-2xl font-black' },
};

export const HealthRing: React.FC<HealthRingProps> = ({
  score,
  status,
  size = 'md',
  strokeWidth: customStroke,
  showText = true,
  className = '',
  animate = true,
}) => {
  const circleRef = useRef<SVGCircleElement>(null);

  const config =
    typeof size === 'number'
      ? { diameter: size, stroke: customStroke || 6, textClass: 'text-sm font-black' }
      : SIZE_MAP[size];

  const diameter = config.diameter;
  const strokeWidth = customStroke || config.stroke;
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  // Determine color based on score or status
  const getColor = () => {
    if (status === 'Thriving' || score >= 80) {
      return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', text: 'text-emerald-500' };
    }
    if (status === 'Steady' || score >= 50) {
      return { stroke: '#6366f1', glow: 'rgba(99, 102, 241, 0.45)', text: 'text-indigo-500' };
    }
    if (status === 'Drifting' || score >= 25) {
      return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)', text: 'text-amber-500' };
    }
    return { stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.45)', text: 'text-rose-500' };
  };

  const { stroke, glow, text } = getColor();

  useEffect(() => {
    if (!circleRef.current) return;

    if (animate) {
      gsap.fromTo(
        circleRef.current,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: targetOffset,
          duration: 1.4,
          ease: 'power3.out',
        }
      );
    } else {
      circleRef.current.style.strokeDashoffset = `${targetOffset}`;
    }
  }, [score, targetOffset, circumference, animate]);

  const filterId = `glow-${Math.round(score)}-${diameter}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: diameter, height: diameter }}
    >
      <svg width={diameter} height={diameter} className="transform -rotate-90">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={glow} />
          </filter>
        </defs>

        {/* Track circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200/80 dark:text-slate-800/80"
        />

        {/* Dynamic score ring */}
        <circle
          ref={circleRef}
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={targetOffset}
          strokeLinecap="round"
          fill="transparent"
          filter={`url(#${filterId})`}
        />
      </svg>

      {showText && (
        <div className="absolute inset-0 flex items-center justify-center text-center select-none">
          <span className={`${config.textClass} text-slate-900 dark:text-white leading-none`}>
            {Math.round(score)}%
          </span>
        </div>
      )}
    </div>
  );
};
