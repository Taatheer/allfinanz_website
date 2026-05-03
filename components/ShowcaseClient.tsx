"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  MessageCircle,
  PhoneCall,
  Sparkles
} from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";
import Chatbot from "@/components/Chatbot";
import Cursor from "@/components/Cursor";
import FAQSection from "@/components/FAQSection";
import GlobalReach from "@/components/GlobalReach";
import Loader from "@/components/Loader";
import Magnetic from "@/components/Magnetic";
import Marquee from "@/components/Marquee";
import MauritiusMap from "@/components/MauritiusMap";
import Navbar from "@/components/Navbar";
import SceneCanvas from "@/components/SceneCanvas";
import SmoothScroll from "@/components/SmoothScroll";
import SplitText from "@/components/SplitText";
import {
  capabilityCards,
  company,
  headlineStats,
  marqueeTerms,
  phoneNumber,
  principles,
  storySections
} from "@/lib/site-data";

const contactCards = [
  {
    title: "Call the office",
    copy: "Start with the decision, deadline, and the finance pressure point.",
    icon: PhoneCall
  },
  {
    title: "Shape the scope",
    copy: "We separate accounting, tax, planning, corporate finance, and advisory needs into a practical brief.",
    icon: Clock3
  },
  {
    title: "Move with records",
    copy: "Bring reports, extracts, budgets, invoices, or draft accounts when available.",
    icon: FileText
  }
];

const bentoSizes = [
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3"
] as const;

export default function ShowcaseClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const heroWordRef = useRef<HTMLDivElement>(null);
  const heroEyebrowRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(storySections[0].id);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: reduceMotion ? false : 0.7,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${self.progress})`;
          }
        }
      });

      if (!reduceMotion) {
        // Hero mega wordmark — letterspacing breathes on scroll
        if (heroWordRef.current) {
          gsap.fromTo(
            heroWordRef.current,
            { letterSpacing: "0", scale: 1, opacity: 1 },
            {
              letterSpacing: "0.04em",
              scale: 0.94,
              opacity: 0.18,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: "+=600",
                scrub: 0.6
              }
            }
          );
        }

        if (heroEyebrowRef.current) {
          gsap.from(heroEyebrowRef.current, {
            yPercent: 60,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.1
          });
        }

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 28, filter: "blur(10px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 86%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
          const speed = Number(element.dataset.speed ?? -80);
          gsap.to(element, {
            y: speed,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true
            }
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-story-card]").forEach((element) => {
          const fromX = element.dataset.align === "right" ? 70 : -70;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top 78%",
              toggleActions: "play none none reverse"
            }
          });

          tl.fromTo(
            element,
            { autoAlpha: 0, x: fromX, rotateY: fromX > 0 ? -8 : 8 },
            { autoAlpha: 1, x: 0, rotateY: 0, duration: 0.95, ease: "power3.out" }
          ).fromTo(
            element.querySelectorAll("[data-story-child]"),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" },
            "-=0.42"
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-section-number]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, x: -120 },
            {
              autoAlpha: 0.18,
              x: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-bento-card]").forEach((card, index) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 60, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              delay: index * 0.05,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 86%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-principle]").forEach((element, index) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              delay: index * 0.06,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-map-block]").forEach((block) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: "top 76%",
              toggleActions: "play none none reverse"
            }
          });

          tl.fromTo(
            block.querySelector("[data-map-shape]"),
            { autoAlpha: 0, scale: 0.82, transformOrigin: "center center" },
            { autoAlpha: 1, scale: 1, duration: 0.9, ease: "power3.out" }
          )
            .fromTo(
              block.querySelectorAll("[data-map-line]"),
              { autoAlpha: 0, strokeDashoffset: 40 },
              { autoAlpha: 1, strokeDashoffset: 0, duration: 0.75, stagger: 0.08, ease: "power2.out" },
              "-=0.35"
            )
            .fromTo(
              block.querySelectorAll("[data-map-node], [data-map-card]"),
              { autoAlpha: 0, scale: 0.75, y: 14, transformOrigin: "center center" },
              { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "back.out(1.6)" },
              "-=0.28"
            );
        });

        gsap.utils.toArray<HTMLElement>("[data-global-block]").forEach((block) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: "top 78%",
              toggleActions: "play none none reverse"
            }
          });

          tl.fromTo(
            block.querySelectorAll("[data-global-node]"),
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.42, stagger: 0.06, ease: "power2.out" }
          ).fromTo(
            block.querySelectorAll("[data-global-card]"),
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.06, ease: "power2.out" },
            "-=0.22"
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-faq-block]").forEach((block) => {
          gsap.fromTo(
            block.querySelectorAll("[data-faq-card], [data-faq-item]"),
            { autoAlpha: 0, y: 24, scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.62,
              stagger: 0.055,
              ease: "power2.out",
              scrollTrigger: {
                trigger: block,
                start: "top 78%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-contact-block]").forEach((block) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: "top 78%",
              toggleActions: "play none none reverse"
            }
          });

          tl.fromTo(
            block.querySelectorAll("[data-contact-card]"),
            { autoAlpha: 0, y: 30, rotateX: 8 },
            { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.72, stagger: 0.08, ease: "power3.out" }
          ).fromTo(
            block.querySelectorAll("[data-contact-row]"),
            { autoAlpha: 0, x: 24 },
            { autoAlpha: 1, x: 0, duration: 0.48, stagger: 0.07, ease: "power2.out" },
            "-=0.32"
          );
        });
      }

      const sectionIds = [
        "hero",
        ...storySections.map((section) => section.id),
        "expertise",
        "global",
        "map",
        "faq",
        "contact"
      ];

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id)
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden">
      <Loader />
      <SmoothScroll />
      <Cursor />
      <SceneCanvas progressRef={progressRef} />
      <Navbar activeSection={activeSection} />

      <div className="scroll-indicator origin-left" ref={progressBarRef} style={{ transform: "scaleX(0)" }} />

      <div className="grain" aria-hidden="true" />

      {/* Section rail */}
      <div className="pointer-events-none fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
        {[
          ...storySections,
          { id: "expertise", title: "Capabilities" },
          { id: "global", title: "Global" },
          { id: "contact", title: "Contact" }
        ].map(
          (section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-cursor
              className={`pointer-events-auto group flex items-center gap-3 transition`}
              aria-label={`Go to ${section.title}`}
            >
              <span
                className={`block h-8 w-px transition-all duration-500 ${
                  activeSection === section.id ? "bg-ember h-12" : "bg-paper/30 group-hover:bg-paper/60"
                }`}
              />
              <span
                className={`font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] transition-opacity duration-300 ${
                  activeSection === section.id ? "text-ember opacity-100" : "text-paper/40 opacity-0 group-hover:opacity-100"
                }`}
              >
                {String(index + 1).padStart(2, "0")} {section.title}
              </span>
            </a>
          )
        )}
      </div>

      <main className="content-layer">
        {/* HERO */}
        <section
          id="hero"
          className="relative flex min-h-screen flex-col justify-end overflow-hidden px-5 pb-12 pt-32 sm:px-8 sm:pb-20 lg:px-10"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-full bg-gradient-to-r from-graphite via-graphite/85 to-transparent lg:w-[58%]" />
          <div data-parallax data-speed="-120" className="pointer-events-none absolute inset-x-0 top-36 h-px bg-gradient-to-r from-transparent via-ember/55 to-transparent" />
          <div data-parallax data-speed="-70" className="pointer-events-none absolute bottom-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-paper/15 to-transparent" />

          <div className="relative z-[3] mx-auto grid w-full max-w-[1400px] flex-1 items-end gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="hero-copy">
              <div ref={heroEyebrowRef} className="flex items-center gap-3">
                <span className="hero-kicker">{company.location} · 2026 advisory desk</span>
              </div>

              <SplitText
                as="h1"
                text="Financial intelligence"
                className="headline mt-7 text-[clamp(2.6rem,7vw,5.2rem)] text-paper"
              />
              <SplitText
                as="h1"
                text="for ambitious leadership."
                className="headline mt-2 text-[clamp(2.6rem,7vw,5.2rem)] text-paper/55"
                stagger={0.018}
                delay={0.15}
              />

              <p data-reveal className="body-copy mt-7 max-w-xl text-pretty text-[1.05rem] sm:text-[1.1rem]">
                AllFinanz Consulting Ltd turns accounting, tax, corporate finance, cash-flow, and risk signals into decisions leadership can trust — from a Mauritian desk built for modern boardrooms.
              </p>

              <div data-reveal className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Magnetic strength={0.22}>
                  <a href="#story-1" className="cta-primary" data-cursor data-cursor-label="Explore">
                    Explore the advisory flow
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.18}>
                  <a href="#expertise" className="cta-secondary" data-cursor data-cursor-label="See">
                    View capabilities
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Magnetic>
              </div>

              <div data-reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {headlineStats.map((stat) => (
                  <div key={stat.label} className="metric-tile p-4">
                    <p className="font-display text-[2rem] font-black leading-none text-paper">
                      <AnimatedNumber value={stat.numeric} suffix={stat.suffix} />
                    </p>
                    <p className="mt-3 font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-paper/60">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column reserved for the 3D scene */}
            <div className="relative hidden h-full min-h-[28rem] lg:block" />
          </div>

          {/* Mega wordmark - decorative outline */}
          <div
            ref={heroWordRef}
            aria-hidden="true"
            className="pointer-events-none relative z-[1] mt-16 flex w-full items-end justify-start sm:mt-20"
          >
            <span className="display-mega select-none whitespace-nowrap text-[18vw] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(244,239,230,0.18)] sm:text-[15vw]">
              ALLFINANZ
            </span>
          </div>

          <div className="absolute bottom-6 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-3 text-paper/55 sm:bottom-10">
            <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.32em]">Scroll</span>
            <span className="relative flex h-7 w-px overflow-hidden bg-paper/20">
              <span className="absolute inset-x-0 top-0 block h-3 bg-ember [animation:scrollHint_1.6s_ease-in-out_infinite]" />
            </span>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="relative z-[3] -mt-px border-y border-paper/8 bg-graphite/85 py-7 backdrop-blur-sm sm:py-9">
          <div className="mask-fade-x">
            <Marquee
              items={marqueeTerms}
              speed={70}
              variant="outline"
              className="[mix-blend-mode:plus-lighter]"
            />
          </div>
        </section>

        {/* PRINCIPLES STRIP */}
        <section className="relative z-[3] px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div data-reveal className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="eyebrow">Operating principles</p>
                <h2 className="section-title mt-5 text-paper">
                  Practical work, scoped to the decisions in front of you.
                </h2>
              </div>
              <div className="flex items-center gap-3 text-paper/65">
                <Sparkles className="h-4 w-4 text-ember" />
                <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.2em]">
                  04 principles · 01 desk
                </span>
              </div>
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-paper/8 bg-paper/8 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((principle) => (
                <article
                  key={principle.code}
                  data-principle
                  className="relative bg-graphite/85 p-7 transition-colors duration-300 hover:bg-graphiteSoft/95 sm:p-8"
                >
                  <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.22em] text-ember">
                    {principle.code}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-extrabold leading-tight text-paper sm:text-2xl">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-[0.92rem] font-medium leading-7 text-paper/72">
                    {principle.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* STORY SECTIONS */}
        <div className="relative">
          {storySections.map((section, index) => {
            const Icon = section.icon;
            const alignRight = index % 2 === 1;
            const number = String(index + 1).padStart(2, "0");

            return (
              <section
                key={section.id}
                id={section.id}
                className={`relative flex min-h-screen items-center px-5 py-28 sm:px-8 lg:px-10 ${
                  alignRight ? "lg:justify-end" : "lg:justify-start"
                }`}
              >
                <span
                  data-section-number
                  aria-hidden="true"
                  className={`pointer-events-none absolute font-display text-[26vw] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(244,239,230,0.12)] sm:text-[20vw] ${
                    alignRight ? "right-2 sm:right-6" : "left-2 sm:left-6"
                  } top-[8%]`}
                >
                  {number}
                </span>

                <article data-story-card data-align={alignRight ? "right" : "left"} className="story-card p-7 sm:p-9 lg:p-10">
                  <div className="relative z-10">
                    <div data-story-child className="flex items-center justify-between gap-5">
                      <div>
                        <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.22em] text-ember">
                          Chapter {section.kicker}
                        </p>
                        <p className="mt-2 text-sm font-bold text-paper/82">{section.theme}</p>
                      </div>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember/12 text-ember ring-1 ring-ember/30">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                    <h2 data-story-child className="story-title mt-7 text-paper">
                      {section.title}
                    </h2>
                    <p data-story-child className="body-copy mt-5">
                      {section.body}
                    </p>
                    <div data-story-child className="mt-8 grid gap-3 sm:grid-cols-[0.82fr_1.18fr]">
                      <div className="story-stat p-4">
                        <p className="font-display text-3xl font-extrabold text-ember">{section.metric}</p>
                        <p className="mt-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-paper/72">
                          {section.metricLabel}
                        </p>
                      </div>
                      <div className="story-proof p-4">
                        <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ember">
                          Signal
                        </p>
                        <p className="mt-2 small-copy">{section.proof}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </section>
            );
          })}
        </div>

        {/* BENTO CAPABILITIES */}
        <section id="expertise" className="relative px-5 py-28 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p data-reveal className="eyebrow">Capabilities</p>
                <SplitText
                  as="h2"
                  text="A sharper operating layer for finance."
                  className="section-title mt-5 text-paper"
                  by="word"
                  stagger={0.04}
                />
                <p data-reveal className="body-copy mt-5 max-w-2xl">
                  Focused capabilities, presented as practical decisions rather than a wall of service copy.
                </p>
              </div>
              <div data-reveal className="flex items-center gap-3 text-paper/65">
                <span className="block h-px w-10 bg-ember/60" />
                <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.2em]">
                  AllFinanz / 2026 stack
                </span>
              </div>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-5 lg:auto-rows-[minmax(14rem,auto)]">
              {capabilityCards.map((card, index) => {
                const Icon = card.icon;
                const span = bentoSizes[index % bentoSizes.length];
                return (
                  <article
                    key={card.title}
                    data-bento-card
                    className={`capability-card group relative overflow-hidden p-7 sm:p-8 ${span}`}
                  >
                    <div className="card-glow" aria-hidden="true" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-start justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ember/10 text-ember ring-1 ring-ember/25">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-paper/45">
                          0{index + 1} / 0{capabilityCards.length}
                        </span>
                      </div>
                      <h3 className="mt-8 font-display text-2xl font-black leading-tight text-paper sm:text-[1.6rem]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-[0.95rem] font-medium leading-7 text-paper/76">
                        {card.copy}
                      </p>
                      <a
                        href="#contact"
                        data-cursor
                        data-cursor-label="Discuss"
                        className="mt-auto inline-flex items-center gap-2 self-start pt-8 text-sm font-extrabold uppercase tracking-[0.14em] text-ember transition group-hover:text-emberSoft"
                      >
                        Discuss this
                        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* GLOBAL REACH */}
        <GlobalReach />

        {/* MAP */}
        <section id="map" className="relative px-5 py-28 sm:px-8 lg:px-10">
          <div className="premium-panel relative mx-auto max-w-[1400px] overflow-hidden rounded-md">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(240,68,26,0.16),transparent_45%)]" />
            <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
              <div data-reveal>
                <p className="eyebrow">Mauritius desk</p>
                <h2 className="section-title mt-5 text-paper">
                  Local context, cleaner movement.
                </h2>
                <p className="body-copy mt-5 max-w-xl">
                  Mauritius-based context matters when accounting records, tax obligations, cash-flow pressure, and advisory decisions are moving at the same time.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="metric-tile p-4">
                    <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-paper/65">Office</p>
                    <p className="mt-2 font-display text-base font-extrabold text-paper">Port Louis</p>
                  </div>
                  <div className="metric-tile p-4">
                    <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-paper/65">Direct line</p>
                    <p className="mt-2 font-display text-base font-extrabold text-paper">{phoneNumber}</p>
                  </div>
                </div>
              </div>

              <div data-map-block>
                <MauritiusMap />
              </div>
            </div>
          </div>
        </section>

        <FAQSection />

        {/* CONTACT */}
        <section id="contact" data-contact-block className="relative px-5 py-28 sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-graphite/90 via-graphite/72 to-graphite/50 sm:hidden" />
          <div className="relative mx-auto max-w-[1400px]">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
              <div className="flex flex-col justify-between gap-8">
                <div data-reveal>
                  <p className="eyebrow">Contact</p>
                  <SplitText
                    as="h2"
                    text="Start with the decision. Leave with a clearer route."
                    className="section-title mt-5 text-paper"
                    by="word"
                    stagger={0.045}
                  />
                  <p className="body-copy mt-5 max-w-2xl">
                    The contact flow is built around action: what needs to be decided, what records exist, and how quickly the work has to move.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {contactCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <article
                        key={card.title}
                        data-contact-card
                        className="relative overflow-hidden rounded-sm border border-paper/8 bg-graphiteSoft/85 p-4 shadow-panel backdrop-blur-xl transition hover:border-ember/35 hover:bg-graphiteSoft/95 sm:bg-paper/[0.04] sm:shadow-none sm:hover:bg-paper/[0.07]"
                      >
                        <div className="flex items-start gap-4">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember/12 text-ember ring-1 ring-ember/25">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div>
                            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ember">
                              Route {String(index + 1).padStart(2, "0")}
                            </p>
                            <h3 className="mt-2 font-display text-lg font-extrabold leading-tight text-paper">
                              {card.title}
                            </h3>
                            <p className="mt-2 text-sm font-medium leading-6 text-paper/76">
                              {card.copy}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <aside data-contact-card className="premium-panel relative overflow-hidden rounded-md bg-graphiteSoft/90 p-7 sm:p-8 lg:p-10">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ember via-emberSoft to-champagne" />
                <div className="relative">
                  <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.22em] text-ember">
                    Port Louis office
                  </p>
                  <a
                    href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                    data-cursor
                    data-cursor-label="Call"
                    className="mt-5 block font-display text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.92] tracking-tight text-paper"
                  >
                    {phoneNumber}
                  </a>
                  <p className="body-copy mt-5 max-w-xl">
                    Speak directly with the team for accounting, tax, planning, corporate finance, compliance, or corporate advisory work in Mauritius.
                  </p>

                  <div className="mt-8 divide-y divide-paper/8 border-y border-paper/8">
                    <div data-contact-row className="flex items-start gap-4 py-5">
                      <MapPin className="mt-1 h-5 w-5 shrink-0 text-ember" aria-hidden="true" />
                      <div>
                        <p className="font-display text-lg font-extrabold text-paper">Address</p>
                        <p className="mt-1 text-sm font-medium leading-6 text-paper/82">Port Louis, Mauritius</p>
                      </div>
                    </div>
                    <div data-contact-row className="flex items-start gap-4 py-5">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emberSoft" aria-hidden="true" />
                      <div>
                        <p className="font-display text-lg font-extrabold text-paper">Best first brief</p>
                        <p className="mt-1 text-sm font-medium leading-6 text-paper/82">
                          Decision, deadline, records available, and the risk you want controlled.
                        </p>
                      </div>
                    </div>
                    <div data-contact-row className="flex items-start gap-4 py-5">
                      <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-champagne" aria-hidden="true" />
                      <div>
                        <p className="font-display text-lg font-extrabold text-paper">Assistant routing</p>
                        <p className="mt-1 text-sm font-medium leading-6 text-paper/82">
                          Use the chatbot for quick routing, then call when timing or scope matters.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Magnetic strength={0.22}>
                      <a href={`tel:${phoneNumber.replace(/\s/g, "")}`} className="cta-primary" data-cursor data-cursor-label="Call now">
                        <PhoneCall className="h-4 w-4" aria-hidden="true" />
                        Call now
                      </a>
                    </Magnetic>
                    <Magnetic strength={0.18}>
                      <a href="#openChat" className="cta-secondary" data-cursor data-cursor-label="Ask">
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        Ask the assistant
                      </a>
                    </Magnetic>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* MEGA FOOTER WORDMARK */}
        <section className="relative z-[3] -mt-12 overflow-hidden">
          <div className="mask-fade-x">
            <Marquee items={["AllFinanz", "Consulting Ltd", "·", "Port Louis", "·", "+230 2105209", "·", "Decisions, scoped"]} variant="outline" speed={50} />
          </div>
        </section>
      </main>

      <footer className="content-layer relative z-[3] border-t border-paper/8 bg-graphite/80 px-5 py-16 backdrop-blur sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="relative inline-flex h-12 w-44 items-center overflow-hidden">
              <Image
                src="/assets/allfinanz-logo-transparent.png"
                alt="AllFinanz"
                fill
                sizes="176px"
                className="object-contain object-left"
              />
            </span>
            <p className="mt-6 max-w-md text-sm font-medium leading-6 text-paper/78">
              Accounting, tax, planning, corporate finance, and corporate advisory for clearer decisions. Mauritius desk, modern operating layer.
            </p>
            <p className="mt-6 font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-paper/45">
              © {new Date().getFullYear()} {company.name} · All rights reserved
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-ember">Office</p>
              <p className="mt-3 font-display text-base font-extrabold text-paper">Port Louis</p>
              <p className="mt-1 text-sm font-medium text-paper/72">Mauritius</p>
            </div>
            <div>
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-ember">Direct</p>
              <a href={`tel:${phoneNumber.replace(/\s/g, "")}`} className="mt-3 block font-display text-base font-extrabold text-paper hover:text-emberSoft">
                {phoneNumber}
              </a>
            </div>
            <div>
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-ember">Map</p>
              <div className="mt-3 grid gap-1 text-sm font-medium text-paper/82">
                <a href="#expertise" className="hover:text-paper">Capabilities</a>
                <a href="#faq" className="hover:text-paper">FAQ</a>
                <a href="#contact" className="hover:text-paper">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Chatbot />

      <style jsx global>{`
        @keyframes scrollHint {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(150%); }
          100% { transform: translateY(150%); }
        }
      `}</style>
    </div>
  );
}
