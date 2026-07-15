import { useCallback, useRef } from "react";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tracks pointer position over an element and exposes CSS custom properties
// (--tilt-x, --tilt-y, --glow-x, --glow-y) that the stylesheet reads to
// produce a gentle 3D tilt and a cursor-following glow - all CSS-driven,
// no animation library needed.
export function useTiltGlow({ maxTilt = 6 } = {}) {
  const ref = useRef(null);

  const onMouseMove = useCallback(
    (event) => {
      if (prefersReducedMotion || !ref.current) return;
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;
      el.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      el.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
    },
    [maxTilt]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("--tilt-x", "0deg");
    ref.current.style.setProperty("--tilt-y", "0deg");
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
