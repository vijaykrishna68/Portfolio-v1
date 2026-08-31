import { useEffect, useState } from "react";

/** True on devices with no pointer capable of hovering (touch/mobile). */
export function useNoHover() {
  const [noHover, setNoHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = (e: MediaQueryListEvent) => setNoHover(e.matches);
    setNoHover(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return noHover;
}
