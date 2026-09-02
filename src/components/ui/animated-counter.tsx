"use client";

import React, { useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number; // in milliseconds
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
}

export function AnimatedCounter({
  target,
  duration = 1200,
  prefix = "",
  suffix = "",
  separator = true,
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    // Snappy, fast ease-out
    const easeOutQuad = (t: number): number => {
      return 1 - (1 - t) * (1 - t);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);

      const currentVal = Math.round(easedProgress * target);
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  const formattedNumber = separator
    ? count.toLocaleString()
    : count.toString();

  return (
    <span className={`inline-block tabular-nums font-bold ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
