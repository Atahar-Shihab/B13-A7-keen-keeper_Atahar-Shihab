import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>(
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()
  );
  const proxyRef = useRef<{ val: number }>({ val: 0 });
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tween = gsap.to(proxyRef.current, {
      val: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        const cur = proxyRef.current.val;
        setDisplayValue(decimals > 0 ? cur.toFixed(decimals) : Math.round(cur).toString());
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration, decimals]);

  return (
    <span ref={spanRef} className={`tabular-nums font-bold ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
