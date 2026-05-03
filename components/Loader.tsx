"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let raf = 0;
    let value = 0;

    const tick = () => {
      const target = Math.min(100, value + Math.random() * 7 + 4);
      value = target;
      setProgress(Math.round(value));
      if (value < 100) {
        raf = window.setTimeout(tick, 70 + Math.random() * 70);
      } else {
        setDone(true);
        window.setTimeout(() => setHidden(true), 700);
      }
    };

    raf = window.setTimeout(tick, 100);
    return () => window.clearTimeout(raf);
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-graphite px-6 transition-[clip-path,opacity] duration-700 ease-[cubic-bezier(.7,0,.2,1)] sm:px-10 ${
        done ? "opacity-0 [clip-path:inset(0_0_100%_0)]" : "opacity-100 [clip-path:inset(0_0_0_0)]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(240,68,26,0.22),transparent_60%)]" />

      <div className="absolute left-6 top-6 flex items-center gap-3 sm:left-10 sm:top-10">
        <span className="h-2 w-2 animate-pulse rounded-full bg-ember" />
        <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.32em] text-paper/70">
          Mauritius · 2026
        </span>
      </div>

      <div className="absolute right-6 top-6 sm:right-10 sm:top-10">
        <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.32em] text-paper/55">
          {String(progress).padStart(3, "0")}
        </span>
      </div>

      <div className="relative z-10 flex w-full max-w-[900px] flex-col items-center gap-8">
        <div className="relative flex h-[clamp(5rem,16vw,11rem)] w-full items-center justify-center">
          <Image
            src="/assets/allfinanz-logo-transparent.png"
            alt="AllFinanz Consulting Ltd"
            fill
            priority
            sizes="(min-width: 768px) 900px, 92vw"
            className="object-contain object-center"
          />
        </div>

        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-4">
          <div className="relative h-px w-full overflow-hidden bg-paper/15">
            <div
              className="h-full bg-ember transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.24em] text-paper/55">
            Booting · Consulting Ltd
          </span>
        </div>
      </div>
    </div>
  );
}
