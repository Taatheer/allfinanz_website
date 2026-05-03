"use client";

import { createElement, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SplitTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  trigger?: string;
  start?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  by?: "char" | "word";
};

export default function SplitText({
  text,
  as = "h1",
  className = "",
  trigger,
  start = "top 82%",
  delay = 0,
  stagger = 0.022,
  duration = 0.95,
  by = "char"
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  const words = useMemo(() => text.split(/(\s+)/).filter((segment) => segment.length > 0), [text]);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(ref.current.querySelectorAll("[data-split-char]"), { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(ref.current!.querySelectorAll("[data-split-char]"), { yPercent: 110, opacity: 0 });
      gsap.to(ref.current!.querySelectorAll("[data-split-char]"), {
        yPercent: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: trigger ?? ref.current!,
          start,
          toggleActions: "play none none reverse"
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, duration, stagger, start, trigger]);

  const children = (
    <>
      {words.map((word, wordIndex) => {
        if (/^\s+$/.test(word)) {
          return (
            <span key={`s-${wordIndex}`} aria-hidden="true">
              {" "}
            </span>
          );
        }

        const chars = by === "char" ? word.split("") : [word];

        return (
          <span
            key={`w-${wordIndex}`}
            className="inline-block whitespace-nowrap align-top leading-[inherit]"
            aria-hidden="true"
          >
            {chars.map((char, charIndex) => (
              <span
                key={`c-${wordIndex}-${charIndex}`}
                className="inline-block overflow-hidden align-top leading-[inherit]"
              >
                <span data-split-char className="inline-block will-change-transform">
                  {char}
                </span>
              </span>
            ))}
          </span>
        );
      })}
      <span className="sr-only">{text}</span>
    </>
  );

  return createElement(as, { ref, className }, children);
}
