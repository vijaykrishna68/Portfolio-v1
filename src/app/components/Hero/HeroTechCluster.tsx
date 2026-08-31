import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { TECHNOLOGIES, type TechId } from "../shared/TechIcons";

type Tier = "sm" | "md" | "lg";

type Slot = {
  id: string;
  top: string;
  left: string;
  tier: Tier;
  duration: number;
  delay: number;
  ax: number;
  ay: number;
};

// Hand-placed, organic positions — deliberately not a grid or a circle.
// duration/delay/ax/ay are individually tuned so no two slots drift in sync.
// Each slot is a fixed point in the composition; which technology occupies
// it rotates over time (see the rotation effect below). Seeded with the
// original 8 technologies so first paint is pixel-identical to before.
const SLOTS: Slot[] = [
  { id: "js", top: "10%", left: "60%", tier: "md", duration: 7.4, delay: 0, ax: 10, ay: 14 },
  { id: "ts", top: "6%", left: "20%", tier: "lg", duration: 8.6, delay: 0.4, ax: 12, ay: 9 },
  { id: "react", top: "34%", left: "80%", tier: "lg", duration: 6.9, delay: 0.9, ax: 9, ay: 15 },
  { id: "node", top: "48%", left: "12%", tier: "md", duration: 7.8, delay: 0.2, ax: 13, ay: 10 },
  { id: "postgres", top: "66%", left: "46%", tier: "sm", duration: 9.2, delay: 1.3, ax: 8, ay: 12 },
  { id: "mongo", top: "76%", left: "74%", tier: "md", duration: 7.1, delay: 0.6, ax: 11, ay: 8 },
  { id: "tailwind", top: "84%", left: "24%", tier: "sm", duration: 8.3, delay: 1.6, ax: 9, ay: 13 },
  { id: "git", top: "22%", left: "42%", tier: "sm", duration: 7.6, delay: 0.8, ax: 10, ay: 9 },
];

// Tablet shows a reduced set of slots rather than all 8, per the responsive spec.
const TABLET_SLOT_IDS = new Set(["ts", "react", "node", "mongo", "tailwind"]);

// Initial slot → technology assignment. Slot ids match the original 8 tech
// ids 1:1, so the starting arrangement is exactly what the Hero looked like
// before rotation existed.
const INITIAL_ASSIGNMENT: Record<string, TechId> = Object.fromEntries(
  SLOTS.map((slot) => [slot.id, slot.id as TechId]),
);

const TECH_BY_ID: Record<TechId, (typeof TECHNOLOGIES)[number]> = Object.fromEntries(
  TECHNOLOGIES.map((tech) => [tech.id, tech]),
) as Record<TechId, (typeof TECHNOLOGIES)[number]>;

const TIER_STYLES: Record<Tier, { pad: string; text: string; icon: number }> = {
  sm: { pad: "px-2.5 py-2", text: "text-[8.5px]", icon: 13 },
  md: { pad: "px-3 py-2.5", text: "text-[9px]", icon: 15 },
  lg: { pad: "px-3.5 py-3", text: "text-[9.5px]", icon: 17 },
};

// Rotation cadence: one slot swap somewhere in the cluster every ~3.5–5s
// (jittered so slots never appear to change in lockstep).
const MIN_INTERVAL_MS = 3500;
const JITTER_MS = 1500;
const CROSSFADE_SECONDS = 0.25;

function pickNextTech(visibleTechIds: Set<TechId>, previousTechId: TechId): TechId {
  const candidates = TECHNOLOGIES.filter(
    (tech) => !visibleTechIds.has(tech.id) && tech.id !== previousTechId,
  );
  const pool = candidates.length > 0 ? candidates : TECHNOLOGIES.filter((tech) => tech.id !== previousTechId);
  return pool[Math.floor(Math.random() * pool.length)].id;
}

function StaticChip({ techId, tier }: { techId: TechId; tier: Tier }) {
  const tech = TECH_BY_ID[techId];
  const tierStyle = TIER_STYLES[tier];
  return (
    <div
      className={`inline-flex flex-col items-center justify-center gap-1 ${tierStyle.pad} rounded-2xl border border-border-strong bg-surface-glass text-foreground/70 select-none`}
    >
      {tech.icon(tierStyle.icon)}
      <span className={`${tierStyle.text} uppercase tracking-wider text-muted-foreground`} style={{ fontFamily: "var(--font-mono)" }}>
        {tech.name}
      </span>
    </div>
  );
}

// Mobile's lightweight equivalent of AnimatedSlot: the same crossfade
// between whichever technology currently occupies this position, but with
// no floating drift loop and no mouse-parallax wrapper — mobile has no
// cursor, and the static wrapped row has no per-slot absolute positioning
// to float within. This keeps mobile's rotation substantially cheaper than
// desktop/tablet: one occasional opacity crossfade per swap, nothing else
// ever animating continuously.
function MobileChip({ techId, tier }: { techId: TechId; tier: Tier }) {
  const tierStyle = TIER_STYLES[tier];
  const tech = TECH_BY_ID[techId];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={techId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: CROSSFADE_SECONDS, ease: "easeInOut" }}
        className={`inline-flex flex-col items-center justify-center gap-1 ${tierStyle.pad} rounded-2xl border border-border-strong bg-surface-glass text-foreground/70 select-none`}
      >
        {tech.icon(tierStyle.icon)}
        <span className={`${tierStyle.text} uppercase tracking-wider text-muted-foreground`} style={{ fontFamily: "var(--font-mono)" }}>
          {tech.name}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

// Fixed-position, permanently-mounted slot: owns the float-drift loop and
// the mouse-independent crossfade between whichever technology currently
// occupies it. The float loop never restarts when the occupant changes.
function AnimatedSlot({ slot, techId }: { slot: Slot; techId: TechId }) {
  const tierStyle = TIER_STYLES[slot.tier];
  const tech = TECH_BY_ID[techId];

  return (
    <motion.div
      className="inline-flex flex-col items-center justify-center"
      animate={{ x: [0, slot.ax, 0, -slot.ax, 0], y: [0, -slot.ay, 0, slot.ay, 0] }}
      transition={{ duration: slot.duration, delay: slot.delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={techId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: CROSSFADE_SECONDS, ease: "easeInOut" }}
          className={`inline-flex flex-col items-center justify-center gap-1 ${tierStyle.pad} rounded-2xl border border-border-strong bg-surface-glass text-foreground/70 select-none`}
        >
          {tech.icon(tierStyle.icon)}
          <span className={`${tierStyle.text} uppercase tracking-wider text-muted-foreground`} style={{ fontFamily: "var(--font-mono)" }}>
            {tech.name}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

type HeroTechClusterProps = {
  /** desktop: full 8-slot cluster. tablet: reduced 5-slot cluster. mobile: static wrapped row, same 8 slots. */
  variant: "desktop" | "tablet" | "mobile";
  className?: string;
};

/**
 * The hero's "these are the technologies I build with" visual.
 * Desktop/tablet: a fixed set of slots float on independent, staggered
 * loops (transform/opacity only) with a very subtle mouse-parallax on the
 * whole cluster, and — independently of the mouse — one slot at a time
 * periodically crossfades to a different technology drawn from a larger
 * pool. Mobile shares the same rotation timer and pool, but renders as a
 * static wrapped row with no floating drift and no mouse-parallax wrapper
 * (no cursor to parallax against) — each chip only ever animates via the
 * same brief opacity crossfade when its own occupant changes, nothing
 * continuous. Fully frozen (no motion, no parallax, no rotation) under
 * prefers-reduced-motion, for every variant.
 */
export function HeroTechCluster({ variant, className = "" }: HeroTechClusterProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 120, damping: 20, mass: 0.4 });
  const springY = useSpring(py, { stiffness: 120, damping: 20, mass: 0.4 });

  const [assignment, setAssignment] = useState<Record<string, TechId>>(INITIAL_ASSIGNMENT);

  const slots = variant === "tablet" ? SLOTS.filter((slot) => TABLET_SLOT_IDS.has(slot.id)) : SLOTS;

  // Single coordinated timer for the whole cluster — not one interval per
  // slot. Recursive setTimeout (rather than setInterval) so each swap is
  // independently jittered and can never overlap the next one. Runs for
  // every variant, including mobile (mobile's render is just visually
  // lighter — see MobileChip — not exempt from rotation itself). Disabled
  // entirely under reduced motion, in which case the cluster simply keeps
  // showing the seeded initial arrangement forever.
  useEffect(() => {
    if (reducedMotion) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function scheduleNext() {
      const delay = MIN_INTERVAL_MS + Math.random() * JITTER_MS;
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        setAssignment((prev) => {
          const slotIds = slots.map((slot) => slot.id);
          const visibleTechIds = new Set(slotIds.map((id) => prev[id]));
          const targetSlotId = slotIds[Math.floor(Math.random() * slotIds.length)];
          const nextTechId = pickNextTech(visibleTechIds, prev[targetSlotId]);
          return { ...prev, [targetSlotId]: nextTechId };
        });
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
    // slots' identity is derived from `variant` alone (SLOTS is a module-level
    // constant), so `variant` is the only real dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, reducedMotion]);

  if (variant === "mobile") {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`.trim()}>
        {SLOTS.map((slot) =>
          reducedMotion ? (
            <StaticChip key={slot.id} techId={assignment[slot.id]} tier={slot.tier} />
          ) : (
            <MobileChip key={slot.id} techId={assignment[slot.id]} tier={slot.tier} />
          ),
        )}
      </div>
    );
  }

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
        {slots.map((slot) => (
          <div key={slot.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: slot.top, left: slot.left }}>
            {reducedMotion ? (
              <StaticChip techId={assignment[slot.id]} tier={slot.tier} />
            ) : (
              <AnimatedSlot slot={slot} techId={assignment[slot.id]} />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
