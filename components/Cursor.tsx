"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const ring = ringRef.current;
    const labelEl = labelRef.current;
    if (!ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId = 0;
    let isHovering = false;
    let currentLabel: string | null = null;

    const update = () => {
      ring.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      rafId = 0;
    };

    const requestUpdate = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      ring.style.opacity = "1";
      requestUpdate();
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a, button, input, textarea, [data-cursor], [role='button']") as HTMLElement | null;
      const nextHover = !!interactive;
      const nextLabel = (interactive?.dataset?.cursorLabel as string | undefined) ?? null;

      if (nextHover !== isHovering) {
        isHovering = nextHover;
        ring.classList.toggle("is-hovering", isHovering);
      }

      if (nextLabel !== currentLabel) {
        currentLabel = nextLabel;
        if (labelEl) labelEl.textContent = nextLabel ?? "";
      }
    };

    const onLeave = () => {
      ring.style.opacity = "0";
    };

    const onEnter = () => {
      ring.style.opacity = "1";
    };

    update();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-ember/80 bg-graphite/10 opacity-0 backdrop-blur-[1px]"
      style={{ willChange: "transform, opacity" }}
    >
      <span
        ref={labelRef}
        className="cursor-label select-none whitespace-nowrap font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-paper opacity-0"
      />
    </div>
  );
}
