const ticks = ["19°S", "20°S", "21°S"];
const longTicks = ["57°E", "57.5°E", "58°E"];

export default function MauritiusMap() {
  return (
    <div className="map-shell relative min-h-[26rem] overflow-hidden rounded-md border border-paper/8 bg-graphite/60 p-5 sm:min-h-[30rem] sm:p-8">
      {/* Lat/long grid lines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(244,239,230,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,230,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_38%_30%,rgba(240,68,26,0.18),transparent_42%)]" />

      {/* Latitude ticks (left) */}
      <div className="pointer-events-none absolute left-3 top-10 bottom-10 hidden flex-col justify-between font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-paper/45 sm:flex">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      {/* Longitude ticks (top) */}
      <div className="pointer-events-none absolute left-12 right-6 top-3 hidden items-center justify-between font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-paper/45 sm:flex">
        {longTicks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      <div className="relative z-10 flex h-full min-h-[24rem] items-center justify-center sm:min-h-[26rem]">
        <div data-map-shape className="relative h-[22rem] w-[18rem] max-w-full sm:h-[26rem] sm:w-[22rem]">
          {/* Glow under the island */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(240,68,26,0.28),transparent_55%)]" />

          {/* Island outline */}
          <img
            src="/assets/mauritius-outline.svg"
            alt="Mauritius island outline"
            className="h-full w-full object-contain opacity-90 [filter:drop-shadow(0_0_24px_rgba(240,68,26,0.32))]"
          />

          {/* Crosshair extending from Port Louis */}
          <div data-map-line className="pointer-events-none absolute left-[34%] top-0 h-[34%] w-px bg-gradient-to-b from-transparent via-ember/55 to-ember" />
          <div data-map-line className="pointer-events-none absolute left-[34%] top-[34%] h-px w-[28%] bg-gradient-to-r from-ember to-transparent" />

          {/* Port Louis pin */}
          <span
            data-map-node
            className="absolute flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: "34%", top: "34%" }}
          >
            <span className="absolute h-12 w-12 rounded-full bg-ember/12 [animation:pulse_2.4s_ease-out_infinite]" />
            <span className="absolute h-7 w-7 rounded-full ring-1 ring-ember/40" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-ember shadow-[0_0_18px_rgba(240,68,26,0.95)]" />
          </span>

          {/* Pin label */}
          <div
            data-map-card
            className="absolute z-10 -translate-y-1/2"
            style={{ left: "44%", top: "34%" }}
          >
            <div className="flex flex-col gap-1 rounded-sm border border-ember/30 bg-graphite/85 px-3 py-2 backdrop-blur">
              <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.22em] text-ember">
                HQ · Port Louis
              </span>
              <span className="font-display text-[0.78rem] font-extrabold leading-tight text-paper">
                20.16°S · 57.50°E
              </span>
            </div>
          </div>

          {/* Decorative floating coordinate */}
          <div
            data-map-card
            className="absolute right-0 top-0 hidden rounded-full border border-paper/15 bg-graphite/85 px-3 py-1.5 font-mono text-[0.58rem] font-bold uppercase tracking-[0.22em] text-paper/65 backdrop-blur sm:block"
          >
            Mauritius · IO
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="pointer-events-none absolute inset-x-5 bottom-3 hidden items-center justify-between font-mono text-[0.58rem] font-bold uppercase tracking-[0.22em] text-paper/40 sm:flex">
        <span>Indian Ocean · 1,865 km²</span>
        <span className="flex items-center gap-2">
          <span className="block h-1 w-1 rounded-full bg-ember" />
          Local desk active
        </span>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.6);
            opacity: 0.6;
          }
          80%,
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
