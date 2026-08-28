import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { TECHNOLOGIES, type TechId } from "../shared/TechIcons";

type Tier = "sm" | "md" | "lg";

type ChipLayout = {
  top: string;
  left: string;
  tier: Tier;
  duration: number;
  delay: number;
  ax: number;
  ay: number;
};

// Hand-placed, organic positions — deliberately not a grid or a circle.
// duration/delay/ax/ay are individually tuned so no two chips drift in sync.
const LAYOUT: Record<TechId, ChipLayout> = {
  js: { top: "10%", left: "60%", tier: "md", duration: 7.4, delay: 0, ax: 10, ay: 14 },
  ts: { top: "6%", left: "20%", tier: "lg", duration: 8.6, delay: 0.4, ax: 12, ay: 9 },
  react: { top: "34%", left: "80%", tier: "lg", duration: 6.9, delay: 0.9, ax: 9, ay: 15 },
  node: { top: "48%", left: "12%", tier: "md", duration: 7.8, delay: 0.2, ax: 13, ay: 10 },
  postgres: { top: "66%", left: "46%", tier: "sm", duration: 9.2, delay: 1.3, ax: 8, ay: 12 },
  mongo: { top: "76%", left: "74%", tier: "md", duration: 7.1, delay: 0.6, ax: 11, ay: 8 },
  tailwind: { top: "84%", left: "24%", tier: "sm", duration: 8.3, delay: 1.6, ax: 9, ay: 13 },
  git: { top: "22%", left: "42%", tier: "sm", duration: 7.6, delay: 0.8, ax: 10, ay: 9 },
};

type TechChip = ChipLayout & { id: TechId; name: string; icon: (size: number) => JSX.Element };

const CHIPS: TechChip[] = TECHNOLOGIES.map((tech) => ({ ...tech, ...LAYOUT[tech.id] }));

// Tablet shows a reduced set rather than the full 8, per the responsive spec.
const TABLET_IDS = new Set(["ts", "react", "node", "mongo", "tailwind"]);

const TIER_STYLES: Record<Tier, { pad: string; text: string; icon: number }> = {
  sm: { pad: "px-2.5 py-2", text: "text-[8.5px]", icon: 13 },
  md: { pad: "px-3 py-2.5", text: "text-[9px]", icon: 15 },
  lg: { pad: "px-3.5 py-3", text: "text-[9.5px]", icon: 17 },
};

function Chip({ chip, animated }: { chip: TechChip; animated: boolean }) {
  const tier = TIER_STYLES[chip.tier];
  const className = `inline-flex flex-col items-center justify-center gap-1 ${tier.pad} rounded-2xl border border-border-strong bg-surface-glass text-foreground/70 select-none`;
  const label = (
    <span className={`${tier.text} uppercase tracking-wider text-muted-foreground`} style={{ fontFamily: "var(--font-mono)" }}>
      {chip.name}
    </span>
  );

  if (!animated) {
    return (
      <div className={className}>
        {chip.icon(tier.icon)}
        {label}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      animate={{ x: [0, chip.ax, 0, -chip.ax, 0], y: [0, -chip.ay, 0, chip.ay, 0] }}
      transition={{ duration: chip.duration, delay: chip.delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {chip.icon(tier.icon)}
      {label}
    </motion.div>
  );
}

type HeroTechClusterProps = {
  /** desktop: full 8-chip cluster. tablet: reduced 5-chip cluster. mobile: static wrapped row. */
  variant: "desktop" | "tablet" | "mobile";
  className?: string;
};

/**
 * The hero's "these are the technologies I build with" visual.
 * Desktop/tablet: chips float on independent, staggered loops (transform/opacity
 * only) with a very subtle mouse-parallax on the whole cluster. Mobile renders
 * the same chips as a static wrapped row — no continuous animation at all.
 * Fully frozen (no motion, no parallax) under prefers-reduced-motion.
 */
export function HeroTechCluster({ variant, className = "" }: HeroTechClusterProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 120, damping: 20, mass: 0.4 });
  const springY = useSpring(py, { stiffness: 120, damping: 20, mass: 0.4 });

  if (variant === "mobile") {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`.trim()}>
        {CHIPS.map((chip) => (
          <Chip key={chip.id} chip={chip} animated={false} />
        ))}
      </div>
    );
  }

  const chips = variant === "tablet" ? CHIPS.filter((chip) => TABLET_IDS.has(chip.id)) : CHIPS;
  const stageHeightClass = variant === "desktop" ? "h-[440px]" : "h-[320px]";

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    const MAX_SHIFT = 6;
    px.set(relX * MAX_SHIFT * 2);
    py.set(relY * MAX_SHIFT * 2);
  }

  function handleMouseLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={reducedMotion ? undefined : handleMouseMove}
      onMouseLeave={reducedMotion ? undefined : handleMouseLeave}
      className={`relative w-full ${stageHeightClass} ${className}`.trim()}
    >
      <motion.div className="absolute inset-0" style={reducedMotion ? undefined : { x: springX, y: springY }}>
        {chips.map((chip) => (
          <div key={chip.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: chip.top, left: chip.left }}>
            <Chip chip={chip} animated={!reducedMotion} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
