import { useEffect, useRef, useState } from "react";

import { CURRENTLY_ITEMS } from "../../content/site";
import { INTERACTION } from "../../lib/interaction";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export function HeroStatus() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);
  const swapRef = useRef<number | null>(null);

  const items = CURRENTLY_ITEMS;

  useEffect(() => {
    if (prefersReducedMotion || isPaused || items.length <= 1) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);

      swapRef.current = window.setTimeout(() => {
        setIndex((current) => (current + 1) % items.length);
        window.requestAnimationFrame(() => setIsVisible(true));
      }, 180);
    }, 4500);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      if (swapRef.current !== null) {
        window.clearTimeout(swapRef.current);
      }
    };
  }, [index, isPaused, items.length, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      if (swapRef.current !== null) {
        window.clearTimeout(swapRef.current);
      }
    };
  }, []);

  const statusClasses = prefersReducedMotion
    ? "relative mt-5 min-h-[1.4rem]"
    : `relative mt-5 min-h-[1.4rem] overflow-hidden ${INTERACTION.fadeMove}`;

  return (
    <div
      className={statusClasses}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-live="polite"
    >
      <div
        key={index}
        className={`absolute left-0 top-0 flex items-center gap-2 text-[13px] text-muted-foreground ${
          prefersReducedMotion ? "" : INTERACTION.fadeMove
        } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[4px]"}`}
        style={{
          fontFamily: "var(--font-mono)",
          transitionDuration: prefersReducedMotion ? "0ms" : "220ms",
        }}
      >
        <span>{items[index].label}</span>
        <span className="text-[#68b1f5]">→</span>
        <span className="text-foreground/85">{items[index].value}</span>
      </div>
    </div>
  );
}