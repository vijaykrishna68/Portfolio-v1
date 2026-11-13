import { useEffect, useLayoutEffect } from "react";

import { NameCard } from "../components/NameCard/NameCard";

export default function NameCardPage() {
  // The card is always light. Leave the saved theme alone and put the page
  // back exactly as it was on the way out.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousClass = root.className;
    const previousScheme = root.style.colorScheme;
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    return () => {
      root.className = previousClass;
      root.style.colorScheme = previousScheme;
    };
  }, []);

  // Title and noindex apply to this route only; restore both on leave.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Vijay Krishna";
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;
    if (robots) robots.content = "noindex, nofollow";
    return () => {
      document.title = previousTitle;
      if (robots && previousRobots !== undefined) robots.content = previousRobots;
    };
  }, []);

  return <NameCard />;
}
