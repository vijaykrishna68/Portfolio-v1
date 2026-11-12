import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Adaptive nav text. For every element marked `data-nav-item` inside the nav we
 * look at what sits beneath its centre, work out the effective background
 * luminance (clear glass is the ground colour at 77% over that backdrop), and
 * give the item dark ink or bone, whichever contrasts more. Runs on scroll,
 * resize, load, image load and theme change, throttled with requestAnimationFrame.
 *
 * Backdrop detection, top layer first (document.elementsFromPoint, ignoring the nav):
 *   1. an explicit `data-surface="dark|light"` on any element wins;
 *   2. <img>: the pixel under the point (same-origin or CORS-clean images);
 *   3. SVG shapes: their fill;
 *   4. otherwise the computed background-color, compositing translucent layers.
 * Photos we cannot read (cross-origin, no data-surface) fall through to whatever
 * sits behind them, which the cover overlays on the Playground make a safe guess.
 */

type Rgb = [number, number, number];

const DARK_TEXT: Rgb = [32, 39, 42]; // #20272A
const LIGHT_TEXT: Rgb = [233, 230, 218]; // #E9E6DA
const CLEAR_GLASS_ALPHA = 0.77; // keep in sync with --nav-glass-fill in theme.css (raised from 40% to clear 4.5:1 worst case)
const MUTED_ALPHA = 0.78;

function lin(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function luminance(c: Rgb) {
  return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
}
function contrast(a: Rgb, b: Rgb) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
function mix(top: Rgb, bottom: Rgb, a: number): Rgb {
  return [top[0] * a + bottom[0] * (1 - a), top[1] * a + bottom[1] * (1 - a), top[2] * a + bottom[2] * (1 - a)];
}
const css = (c: Rgb) => `rgb(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])})`;

/** Parse rgb()/rgba()/color(srgb ...) / #hex into [r,g,b,a]. */
function parseColor(raw: string): [number, number, number, number] | null {
  const v = raw.trim();
  if (!v || v === "transparent") return null;
  if (v.startsWith("#")) {
    let h = v.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    if (h.length === 6) h += "ff";
    if (h.length !== 8) return null;
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), n(6) / 255];
  }
  const rgb = v.match(/^rgba?\(([^)]+)\)/);
  if (rgb) {
    const p = rgb[1].replace("/", " ").split(/[\s,]+/).filter(Boolean).map(parseFloat);
    return [p[0], p[1], p[2], p[3] ?? 1];
  }
  const srgb = v.match(/^color\(srgb\s+([^)]+)\)/);
  if (srgb) {
    const p = srgb[1].replace("/", " ").split(/\s+/).filter(Boolean).map(parseFloat);
    return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] ?? 1];
  }
  return null;
}

const imageCache = new WeakMap<HTMLImageElement, { data: Uint8ClampedArray; w: number; h: number } | null>();

function sampleImage(img: HTMLImageElement, x: number, y: number): Rgb | null {
  if (!img.complete || !img.naturalWidth) return null;
  let entry = imageCache.get(img);
  if (entry === undefined) {
    try {
      const w = 64;
      const h = Math.max(1, Math.round((64 * img.naturalHeight) / img.naturalWidth));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("no ctx");
      ctx.drawImage(img, 0, 0, w, h);
      entry = { data: ctx.getImageData(0, 0, w, h).data, w, h };
    } catch {
      entry = null; // cross-origin without CORS: pixels are unreadable
    }
    imageCache.set(img, entry);
  }
  if (!entry) return null;

  const rect = img.getBoundingClientRect();
  const cs = getComputedStyle(img);
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const cover = cs.objectFit === "cover";
  const scale = cover ? Math.max(rect.width / nw, rect.height / nh) : Math.min(rect.width / nw, rect.height / nh);
  const dw = nw * scale;
  const dh = nh * scale;
  const pos = cs.objectPosition.split(" ").map((p) => (p.endsWith("%") ? parseFloat(p) / 100 : 0.5));
  const ox = (rect.width - dw) * (pos[0] ?? 0.5);
  const oy = (rect.height - dh) * (pos[1] ?? 0.5);
  const u = (x - rect.left - ox) / dw;
  const v = (y - rect.top - oy) / dh;
  if (u < 0 || u > 1 || v < 0 || v > 1) return null;
  const px = Math.min(entry.w - 1, Math.max(0, Math.floor(u * entry.w)));
  const py = Math.min(entry.h - 1, Math.max(0, Math.floor(v * entry.h)));
  // average a 5x5 neighbourhood: the blur softens detail anyway
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const sx = Math.min(entry.w - 1, Math.max(0, px + dx));
      const sy = Math.min(entry.h - 1, Math.max(0, py + dy));
      const i = (sy * entry.w + sx) * 4;
      r += entry.data[i];
      g += entry.data[i + 1];
      b += entry.data[i + 2];
      n++;
    }
  }
  return [r / n, g / n, b / n];
}

/** Effective backdrop colour beneath a point, ignoring the nav itself. */
function backdropAt(x: number, y: number, nav: HTMLElement, fallback: Rgb): Rgb {
  const stack = document.elementsFromPoint(x, y).filter((el) => !nav.contains(el));
  const translucent: Array<[Rgb, number]> = [];
  let base: Rgb | null = null;

  for (const el of stack) {
    const surface = (el as HTMLElement).dataset?.surface;
    if (surface === "dark") {
      base = DARK_TEXT;
      break;
    }
    if (surface === "light") {
      base = LIGHT_TEXT;
      break;
    }
    if (el instanceof HTMLImageElement) {
      const px = sampleImage(el, x, y);
      if (px) {
        base = px;
        break;
      }
      continue;
    }
    const cs = getComputedStyle(el);
    if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) {
      const fill = cs.fill;
      if (fill && fill !== "none" && !fill.startsWith("url(")) {
        const c = parseColor(fill);
        const a = (c?.[3] ?? 1) * (parseFloat(cs.fillOpacity) || 1);
        if (c && a > 0.02) {
          if (a >= 0.95) {
            base = [c[0], c[1], c[2]];
            break;
          }
          translucent.push([[c[0], c[1], c[2]], a]);
        }
      }
      continue;
    }
    const bg = parseColor(cs.backgroundColor);
    if (bg && bg[3] > 0.02) {
      if (bg[3] >= 0.95) {
        base = [bg[0], bg[1], bg[2]];
        break;
      }
      translucent.push([[bg[0], bg[1], bg[2]], bg[3]]);
    }
  }

  let out: Rgb = base ?? fallback;
  for (let i = translucent.length - 1; i >= 0; i--) out = mix(translucent[i][0], out, translucent[i][1]);
  return out;
}

const VARS = ["--foreground", "--ink", "--ink-muted", "--muted-foreground", "--line", "--border", "--accent", "--ring"] as const;

function paint(item: HTMLElement, fg: Rgb) {
  const strong = css(fg);
  const muted = `color-mix(in srgb, ${strong} ${MUTED_ALPHA * 100}%, transparent)`;
  item.style.setProperty("--foreground", strong);
  item.style.setProperty("--ink", strong);
  item.style.setProperty("--ink-muted", muted);
  item.style.setProperty("--muted-foreground", muted);
  item.style.setProperty("--line", strong);
  item.style.setProperty("--border", muted);
  item.style.setProperty("--accent", strong);
  item.style.setProperty("--ring", strong);
  item.dataset.navInk = fg === LIGHT_TEXT ? "light" : "dark";
}

function clear(item: HTMLElement) {
  for (const v of VARS) item.style.removeProperty(v);
  delete item.dataset.navInk;
}

function glassIsSolid() {
  const noBackdrop = !(CSS.supports("backdrop-filter", "blur(1px)") || CSS.supports("-webkit-backdrop-filter", "blur(1px)"));
  return noBackdrop || window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
}

/**
 * @param navRef the nav element
 * @param glass  true while the clear glass is showing (false: nav is transparent over the page)
 * @param key    change to force a re-sample (e.g. the route)
 */
export function useAdaptiveNav(navRef: RefObject<HTMLElement | null>, glass: boolean, key: string) {
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const items = () => Array.from(nav.querySelectorAll<HTMLElement>("[data-nav-item]"));

    // Static fallback: solid ground and theme text. No adaptation.
    if (glassIsSolid()) {
      items().forEach(clear);
      return;
    }

    let frame = 0;
    const last = new WeakMap<HTMLElement, { fg: Rgb; ratio: number }>();

    const run = () => {
      frame = 0;
      const root = getComputedStyle(document.documentElement);
      const groundParsed = parseColor(root.getPropertyValue("--ground"));
      const ground: Rgb = groundParsed ? [groundParsed[0], groundParsed[1], groundParsed[2]] : LIGHT_TEXT;

      for (const item of items()) {
        const r = item.getBoundingClientRect();
        if (r.width === 0) continue;
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const behind = backdropAt(x, y, nav, ground);
        const effective = glass ? mix(ground, behind, CLEAR_GLASS_ALPHA) : behind;

        const cDark = contrast(DARK_TEXT, effective);
        const cLight = contrast(LIGHT_TEXT, effective);
        let fg = cDark >= cLight ? DARK_TEXT : LIGHT_TEXT;

        // hysteresis: only flip when the other colour wins by a clear margin
        const prev = last.get(item);
        if (prev) {
          const prevNow = prev.fg === DARK_TEXT ? cDark : cLight;
          const other = prev.fg === DARK_TEXT ? cLight : cDark;
          if (other < prevNow * 1.15) fg = prev.fg;
        }
        last.set(item, { fg, ratio: Math.max(cDark, cLight) });
        paint(item, fg);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };

    schedule();
    const later = window.setTimeout(schedule, 250);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    document.addEventListener("load", schedule, true); // image loads (capture)
    const mo = new MutationObserver(schedule); // theme class on <html>
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    return () => {
      window.clearTimeout(later);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      document.removeEventListener("load", schedule, true);
      mo.disconnect();
      ro.disconnect();
      items().forEach(clear);
    };
  }, [navRef, glass, key]);
}
