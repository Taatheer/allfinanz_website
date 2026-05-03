"use client";

import { useState } from "react";
import { Clock3, FileText, ListChecks, Minus, Plus } from "lucide-react";
import { faqs } from "@/lib/site-data";

const prepCards = [
  {
    title: "Frame the decision",
    copy: "The question, entity, deadline, and pressure point.",
    icon: ListChecks
  },
  {
    title: "Bring the records",
    copy: "Draft accounts, bank data, tax notes, or current reports.",
    icon: FileText
  },
  {
    title: "Name the timeline",
    copy: "Urgent filing, board date, transaction, or planning window.",
    icon: Clock3
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" data-faq-block className="relative z-10 px-5 py-28 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-graphite/90 via-graphite/70 to-graphite/45 sm:hidden" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <div data-reveal>
              <p className="eyebrow">FAQ</p>
              <h2 className="section-title mt-5 max-w-xl text-white">
                Clear answers before anything gets complicated.
              </h2>
              <p className="body-copy mt-5 max-w-lg">
                The first conversation works best when the business question is sharp. These prompts keep the call focused and useful.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {prepCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    data-faq-card
                    className="group relative overflow-hidden rounded-[8px] border border-white/10 bg-graphiteSoft/85 p-4 shadow-panel backdrop-blur-xl transition hover:border-signal/35 hover:bg-graphiteSoft/95 sm:bg-white/[0.055] sm:shadow-none sm:hover:bg-white/[0.08]"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-ember via-signal to-transparent opacity-70" />
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal/12 text-signal ring-1 ring-signal/20">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-champagne">
                          Step {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-2 font-display text-lg font-extrabold leading-tight text-white">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-sm font-semibold leading-6 text-white/[0.78]">
                          {card.copy}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="premium-panel overflow-hidden rounded-[8px] bg-graphiteSoft/90 p-3 sm:p-4">
            <div data-faq-card className="flex flex-col gap-3 border-b border-white/10 px-3 pb-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-signal">Decision Desk</p>
                <p className="mt-2 font-display text-2xl font-extrabold text-white">Fast questions, practical answers.</p>
              </div>
              <span className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-extrabold uppercase text-white/[0.82]">
                {faqs.length} answers
              </span>
            </div>

            <div className="mt-3 grid gap-3">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div key={item.question} data-faq-item className="faq-button overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                      aria-expanded={isOpen}
                    >
                      <span className="flex min-w-0 items-center gap-4">
                        <span className={`hidden h-2.5 w-2.5 shrink-0 rounded-full sm:block ${isOpen ? "bg-ember shadow-[0_0_18px_rgba(240,68,26,0.8)]" : "bg-white/30"}`} />
                        <span className="font-display text-base font-extrabold leading-snug text-white sm:text-lg">
                          {item.question}
                        </span>
                      </span>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${isOpen ? "bg-ember text-white" : "bg-white/10 text-white"}`}>
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-4 pb-5 text-sm font-semibold leading-7 text-white/[0.84] sm:px-12">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
