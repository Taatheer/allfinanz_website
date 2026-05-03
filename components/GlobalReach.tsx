"use client";

import { useEffect, useRef, useState } from "react";
import { MapPinned, Network } from "lucide-react";
import { useInView } from "@/lib/useInView";

type Region = {
  code: string;
  name: string;
  label: string;
  x: number;
  y: number;
};

const hq = {
  code: "MU",
  name: "Port Louis",
  x: 62.7,
  y: 66.4
};

const regions: Region[] = [
  { code: "AF", name: "Africa", label: "Africa", x: 50.6, y: 56.5 },
  { code: "EU", name: "Europe", label: "Europe", x: 49.3, y: 32.6 },
  { code: "AS", name: "Asia", label: "Asia", x: 72.2, y: 39.6 },
  { code: "SEA", name: "South East Asia", label: "S.E. Asia", x: 78.5, y: 57.6 }
];

function pointToSvg(point: { x: number; y: number }) {
  return {
    x: point.x * 10,
    y: point.y * 5.07
  };
}

function routePath(region: Region, index: number) {
  const start = pointToSvg(hq);
  const end = pointToSvg(region);
  const lift = region.y < hq.y ? -96 : -34;
  const sidePull = region.x > hq.x ? 62 : -58;
  const midX = (start.x + end.x) / 2 + sidePull;
  const midY = (start.y + end.y) / 2 + lift - index * 4;

  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

export default function GlobalReach() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { threshold: 0.12, rootMargin: "180px" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % regions.length);
    }, 2600);

    return () => window.clearInterval(id);
  }, [inView]);

  const activeRegion = regions[active];

  return (
    <section id="global" ref={sectionRef} data-global-block className="relative px-5 py-28 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-graphite" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(240,68,26,0.13),transparent_38%),radial-gradient(circle_at_74%_58%,rgba(240,68,26,0.1),transparent_42%)]" />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div data-reveal>
            <p className="eyebrow">Global clients</p>
            <h2 className="section-title mt-5 text-paper">
              Mauritius perspective, international movement.
            </h2>
            <p className="body-copy mt-5 max-w-2xl">
              Client activity spans Africa, Asia, Europe, and South East Asia, with Mauritius acting as the advisory anchor.
            </p>
          </div>

          <div data-reveal className="flex items-center gap-3 text-paper/65">
            <Network className="h-4 w-4 text-ember" aria-hidden="true" />
            <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.2em]">
              Live route map
            </span>
          </div>
        </div>

        <div data-global-card className="global-map-shell mt-12 overflow-hidden rounded-md p-3 sm:p-5 lg:p-7">
          <div className="relative aspect-[2048/1039] min-h-[24rem] w-full overflow-hidden rounded-sm border border-paper/8 bg-graphite/70">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(244,239,230,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,230,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_62%_62%,rgba(240,68,26,0.22),transparent_28%),radial-gradient(circle_at_72%_42%,rgba(243,228,200,0.08),transparent_24%)]" />

            <img
              src="/assets/world-map-robinson.svg"
              alt="World map showing international client coverage"
              className="absolute inset-[5%_4%] h-[90%] w-[92%] object-contain opacity-[0.82] [filter:drop-shadow(0_0_26px_rgba(240,68,26,0.14))]"
            />

            <svg
              className="pointer-events-none absolute inset-[5%_4%] h-[90%] w-[92%]"
              viewBox="0 0 1000 507"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="routeGlow" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#f0441a" stopOpacity="0.95" />
                  <stop offset="52%" stopColor="#ff6938" stopOpacity="0.88" />
                  <stop offset="100%" stopColor="#f3e4c8" stopOpacity="0.7" />
                </linearGradient>
                <filter id="routeBloom" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {regions.map((region, index) => {
                const isActive = active === index;
                return (
                  <g key={region.code}>
                    <path
                      d={routePath(region, index)}
                      fill="none"
                      stroke="rgba(244,239,230,0.13)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <path
                      d={routePath(region, index)}
                      className={`global-flow ${isActive ? "is-active" : ""}`}
                      fill="none"
                      stroke={isActive ? "url(#routeGlow)" : "rgba(240,68,26,0.42)"}
                      strokeWidth={isActive ? 2.8 : 1.5}
                      strokeLinecap="round"
                      filter={isActive ? "url(#routeBloom)" : undefined}
                      opacity={isActive ? 1 : 0.44}
                    />
                  </g>
                );
              })}
            </svg>

            <div
              data-global-node
              className="global-node is-active absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-ember/55 bg-graphite/92 px-3 py-2 shadow-ember backdrop-blur"
              style={{ left: `${hq.x}%`, top: `${hq.y}%` }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-ember shadow-[0_0_18px_rgba(240,68,26,0.95)]" />
              <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-paper">
                <span className="hidden sm:inline">Port Louis</span>
                <span className="sm:hidden">MU</span>
              </span>
            </div>

            {regions.map((region, index) => {
              const isActive = active === index;

              return (
                <button
                  key={region.code}
                  type="button"
                  data-global-node
                  data-cursor
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  className={`global-node absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-2 backdrop-blur transition ${
                    isActive
                      ? "is-active border-ember/70 bg-ember text-paper shadow-ember"
                      : "border-paper/15 bg-graphite/88 text-paper/78 hover:border-ember/50 hover:text-paper"
                  }`}
                  style={{ left: `${region.x}%`, top: `${region.y}%` }}
                  aria-label={`Show route to ${region.name}`}
                >
                  <span className={`h-2 w-2 rounded-full ${isActive ? "bg-paper" : "bg-ember"}`} />
                  <span className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.18em]">
                    <span className="hidden sm:inline">{region.label}</span>
                    <span className="sm:hidden">{region.code}</span>
                  </span>
                </button>
              );
            })}

            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-paper/10 bg-graphite/82 px-3 py-2 backdrop-blur sm:left-6 sm:top-6">
              <MapPinned className="h-3.5 w-3.5 text-ember" aria-hidden="true" />
              <span className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.2em] text-paper/75">
                Mauritius to {activeRegion.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
