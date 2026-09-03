"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number; // in milliseconds
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
  threshold?: number;
}

export function AnimatedCounter({
  target,
  duration = 1600,
  prefix = "",
  suffix = "",
  separator = true,
  className = "",
  threshold = 0.2,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation only when scrolled into view
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    // Smooth ease-out cubic for realistic, satisfying acceleration & deceleration
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

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
  }, [isVisible, target, duration]);

  const formattedNumber = separator
    ? count.toLocaleString()
    : count.toString();

  return (
    <span
      ref={elementRef}
      className={`inline-block tabular-nums font-bold ${className}`}
    >
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
