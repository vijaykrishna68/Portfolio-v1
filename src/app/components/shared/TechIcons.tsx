// Hand-drawn, currentColor line-icon language shared by every place the
// portfolio represents its technology stack visually (currently the Hero's
// floating tech cluster; previously also About's now-removed TechStrip).
// One source of truth so the icon set and the "what I work with" list never
// drift apart between components.

export type TechId = "js" | "ts" | "react" | "node" | "postgres" | "mongo" | "tailwind" | "git";

function IconJS({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none">
      <rect x="2" y="2" width="20" height="20" rx="2.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 8.5V16a2 2 0 01-4 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14 8.5h4M16 8.5v9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconTS({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none">
      <rect x="2" y="2" width="20" height="20" rx="2.5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 8.5h10M12 8.5V18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M16.5 13.5c0-1.5-1.12-2-2.5-2s-2.5.5-2.5 2 1 2 2.5 2 2.5.6 2.5 2-1.12 2-2.5 2S11.5 19 11.5 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconReact({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
      <ellipse cx="12" cy="12" rx="9" ry="3.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconNode({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M12 2L21 7v10L12 22L3 17V7z" />
      <path d="M9 9v3.5a1.5 1.5 0 003 0V9" strokeLinecap="round" />
    </svg>
  );
}

function IconPostgres({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <ellipse cx="12" cy="6" rx="8" ry="2.5" />
      <path d="M4 6v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V6" />
      <path d="M4 11v6c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-6" />
    </svg>
  );
}

function IconMongo({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9 6.5 6.5 10 6.5 14a5.5 5.5 0 0011 0C17.5 10 15 6.5 12 2z" />
      <line x1="12" y1="7.5" x2="12" y2="22" />
    </svg>
  );
}

function IconTailwind({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 10C7.5 7 9.5 5.5 12 5.5s4 2 5 5c1-3 2.5-4.5 4.5-4.5" />
      <path d="M2 15c1-3 3-4.5 5.5-4.5s4 2 5 5c1-3 2.5-4.5 4.5-4.5" />
    </svg>
  );
}

function IconGit({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="7" cy="18" r="2" fill="currentColor" stroke="none" />
      <circle cx="7" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="10" r="2" fill="currentColor" stroke="none" />
      <line x1="7" y1="8" x2="7" y2="16" />
      <path d="M7 8C7 5.8 9 4.5 11.5 4.5C14.5 4.5 17 6.5 17 10" />
    </svg>
  );
}

export type Technology = {
  id: TechId;
  name: string;
  icon: (size: number) => JSX.Element;
};

// The technology set the portfolio represents visually. Edit here to add,
// remove, or rename a technology — every consumer (currently the Hero's
// tech cluster) reads from this one list.
export const TECHNOLOGIES: Technology[] = [
  { id: "js", name: "JavaScript", icon: (s) => <IconJS size={s} /> },
  { id: "ts", name: "TypeScript", icon: (s) => <IconTS size={s} /> },
  { id: "react", name: "React", icon: (s) => <IconReact size={s} /> },
  { id: "node", name: "Node.js", icon: (s) => <IconNode size={s} /> },
  { id: "postgres", name: "PostgreSQL", icon: (s) => <IconPostgres size={s} /> },
  { id: "mongo", name: "MongoDB", icon: (s) => <IconMongo size={s} /> },
  { id: "tailwind", name: "Tailwind", icon: (s) => <IconTailwind size={s} /> },
  { id: "git", name: "Git", icon: (s) => <IconGit size={s} /> },
];
