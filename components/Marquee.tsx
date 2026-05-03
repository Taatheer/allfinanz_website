"use client";

import { useEffect, useRef } from "react";

type MarqueeProps = {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  variant?: "default" | "outline";
};

export default function Marquee({
  items,
  speed = 60,
  direction = "left",
  className = "",
  variant = "default"
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const first = track.firstElementChild as HTMLElement | null;
      if (first) widthRef.current = first.offsetWidth;
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    let raf = 0;
    let last = performance.now();
    const dir = direction === "left" ? -1 : 1;

    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      offsetRef.current += dir * speed * delta;

      if (widthRef.current > 0) {
        offsetRef.current = ((offsetRef.current % widthRef.current) + widthRef.current) % widthRef.current;
      }
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [direction, speed]);

  const renderGroup = (key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-12 pr-12 sm:gap-20 sm:pr-20">
      {items.map((item, index) => (
        <span
          key={`${key}-${index}`}
          className={
            variant === "outline"
              ? "select-none font-display text-[clamp(2.4rem,8vw,7rem)] font-black uppercase leading-none tracking-[-0.02em] text-transparent [-webkit-text-stroke:1px_rgba(248,245,239,0.55)]"
              : "select-none font-display text-[clamp(1.6rem,3.6vw,2.6rem)] font-black uppercase leading-none tracking-[0.08em] text-paper"
          }
        >
          {item}
        </span>
      ))}
      {items.map((_, index) => (
        <span
          key={`${key}-dot-${index}`}
          className="hidden h-2 w-2 shrink-0 rounded-full bg-ember sm:inline-block"
          style={{ display: index === items.length - 1 ? "none" : undefined }}
          aria-hidden="true"
        />
      ))}
    </div>
  );

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {renderGroup("a")}
        {renderGroup("b")}
        {renderGroup("c")}
      </div>
    </div>
  );
}
