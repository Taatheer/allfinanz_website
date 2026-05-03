"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, PhoneCall, X } from "lucide-react";
import { company, navItems, phoneNumber } from "@/lib/site-data";

export default function Navbar({ activeSection }: { activeSection?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 px-4 transition-[padding] duration-500 sm:px-6 lg:px-8 ${scrolled ? "pt-3" : "pt-5"}`}>
      <nav
        className={`nav-shell mx-auto grid items-center gap-4 rounded-full px-3 py-2 transition-[max-width,border-radius,background] duration-500 ease-out ${
          scrolled ? "max-w-6xl" : "max-w-7xl"
        } grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr]`}
      >
        <a
          href="#hero"
          onClick={close}
          data-cursor
          className="flex min-w-0 items-center gap-3 rounded-full pl-2 pr-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
          aria-label={`${company.name} home`}
        >
          <span className="relative flex h-9 w-32 items-center justify-center overflow-hidden sm:w-40">
            <Image
              src="/assets/allfinanz-logo-transparent.png"
              alt="AllFinanz"
              fill
              priority
              sizes="160px"
              className="object-contain"
            />
          </span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-paper/8 bg-paper/[0.03] p-1 lg:flex">
          {navItems.map((item) => {
            const isActive = activeSection ? item.href === `#${activeSection}` : false;
            return (
              <a
                key={item.href}
                href={item.href}
                data-cursor
                className={`nav-link text-[0.78rem] font-extrabold uppercase tracking-[0.16em] ${isActive ? "is-active" : ""}`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2">
          <a
            href={`tel:${phoneNumber.replace(/\s/g, "")}`}
            data-cursor
            data-cursor-label="Call"
            className="hidden h-11 items-center gap-2 rounded-full bg-ember pl-4 pr-3 text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-paper shadow-ember transition hover:-translate-y-0.5 hover:shadow-glow lg:inline-flex"
          >
            <PhoneCall className="h-4 w-4" />
            {phoneNumber}
            <span className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-paper/10">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 bg-paper/[0.04] text-paper transition hover:bg-paper/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember lg:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="nav-shell mx-auto mt-3 max-w-7xl rounded-2xl p-3 lg:hidden">
          <div className="grid gap-2 sm:grid-cols-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="rounded-xl border border-paper/8 bg-paper/[0.04] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-paper/85 transition hover:border-ember/40 hover:bg-ember/10"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              onClick={close}
              className="col-span-full inline-flex items-center justify-center gap-2 rounded-xl bg-ember px-4 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-paper shadow-ember"
            >
              <PhoneCall className="h-4 w-4" />
              {phoneNumber}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
