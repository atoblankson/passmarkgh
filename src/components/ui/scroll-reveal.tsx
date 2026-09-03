"use client";

import { useEffect, useRef, useState } from "react";

type ScrollRevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "fade";

interface UseScrollRevealOptions {
  threshold?: number;
  once?: boolean;
}

export function useScrollReveal({
  threshold = 0.15,
  once = true,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, isVisible };
}

const BASE = "transition-all duration-700 ease-out will-change-[opacity,transform]";

type HiddenMap = Record<ScrollRevealVariant, string>;

const HIDDEN: HiddenMap = {
  "fade-up": "opacity-0 translate-y-8",
  "fade-down": "opacity-0 -translate-y-8",
  "fade-left": "opacity-0 -translate-x-8",
  "fade-right": "opacity-0 translate-x-8",
  "zoom-in": "opacity-0 scale-95",
  fade: "opacity-0",
};

const VISIBLE = "opacity-100 translate-y-0 translate-x-0 scale-100";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollRevealVariant;
  delay?: number;
  className?: string;
  threshold?: number;
}

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
  threshold = 0.15,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ threshold });
  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: delay + "ms" } : undefined}
      className={[BASE, isVisible ? VISIBLE : HIDDEN[variant], className].join(" ")}
    >
      {children}
    </div>
  );
}
