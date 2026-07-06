import { INTERACTION } from "../../lib/interaction";

// ─────────────────────────────────────────────────────────
// SVG icons — viewBox 0 0 24 24, currentColor throughout
// so the parent's text-color CSS drives both icon and label.
// ─────────────────────────────────────────────────────────

function IconJS() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none">
      <rect x="2" y="2" width="20" height="20" rx="2.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M9 8.5V16a2 2 0 01-4 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M14 8.5h4M16 8.5v9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function IconTS() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none">
      <rect x="2" y="2" width="20" height="20" rx="2.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M7 8.5h10M12 8.5V18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M16.5 13.5c0-1.5-1.12-2-2.5-2s-2.5.5-2.5 2 1 2 2.5 2 2.5.6 2.5 2-1.12 2-2.5 2S11.5 19 11.5 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function IconReact() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
      <ellipse cx="12" cy="12" rx="9" ry="3.5"/>
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconNode() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M12 2L21 7v10L12 22L3 17V7z"/>
      <path d="M9 9v3.5a1.5 1.5 0 003 0V9" strokeLinecap="round"/>
    </svg>
  );
}

function IconPostgres() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <ellipse cx="12" cy="6" rx="8" ry="2.5"/>
      <path d="M4 6v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V6"/>
      <path d="M4 11v6c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-6"/>
    </svg>
  );
}

function IconMongo() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9 6.5 6.5 10 6.5 14a5.5 5.5 0 0011 0C17.5 10 15 6.5 12 2z"/>
      <line x1="12" y1="7.5" x2="12" y2="22"/>
    </svg>
  );
}

function IconTailwind() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 10C7.5 7 9.5 5.5 12 5.5s4 2 5 5c1-3 2.5-4.5 4.5-4.5"/>
      <path d="M2 15c1-3 3-4.5 5.5-4.5s4 2 5 5c1-3 2.5-4.5 4.5-4.5"/>
    </svg>
  );
}

function IconGit() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="7" cy="18" r="2" fill="currentColor" stroke="none"/>
      <circle cx="7" cy="6" r="2" fill="currentColor" stroke="none"/>
      <circle cx="17" cy="10" r="2" fill="currentColor" stroke="none"/>
      <line x1="7" y1="8" x2="7" y2="16"/>
      <path d="M7 8C7 5.8 9 4.5 11.5 4.5C14.5 4.5 17 6.5 17 10"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// Technology list — edit this array to add, remove, or
// reorder technologies. Each entry needs a name and icon.
// ─────────────────────────────────────────────────────────

const TECHS = [
  { name: "JavaScript", icon: <IconJS /> },
  { name: "TypeScript", icon: <IconTS /> },
  { name: "React",      icon: <IconReact /> },
  { name: "Node.js",    icon: <IconNode /> },
  { name: "PostgreSQL", icon: <IconPostgres /> },
  { name: "MongoDB",    icon: <IconMongo /> },
  { name: "Tailwind",   icon: <IconTailwind /> },
  { name: "Git",        icon: <IconGit /> },
];

export function TechStrip() {
  return (
    <div className="mt-10 pt-7 border-t border-border">
      <p
        className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Core Stack
      </p>
      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {TECHS.map(({ name, icon }) => (
          <div
            key={name}
            className={`flex items-center gap-1.5 text-[12px] text-muted-foreground ${INTERACTION.color} hover:text-[#68b1f5] cursor-default select-none`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {icon}
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
