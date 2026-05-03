"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, PhoneCall, Send, Sparkles, X } from "lucide-react";
import { phoneNumber } from "@/lib/site-data";

type ChatAction = {
  label: string;
  href: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  actions?: ChatAction[];
};

const prompts = [
  "What services do you offer?",
  "Corporate finance support",
  "I need tax advice",
  "How do we start?"
];

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi, I am the AllFinanz assistant. Tell me whether you need accounting, tax, planning, corporate finance, or advisory support and I will point you to the right next step.",
      actions: [{ label: `Call ${phoneNumber}`, href: "tel:+2302105209" }]
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading, open]);

  async function sendMessage(nextText = input) {
    const text = nextText.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: text
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error("Chatbot request failed");
      }

      const data = (await response.json()) as Pick<ChatMessage, "content" | "actions">;
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: data.content,
          actions: data.actions
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content:
            "I could not reach the assistant service just now. For urgent accounting, tax, corporate finance, or advisory requests, please call the office directly.",
          actions: [{ label: `Call ${phoneNumber}`, href: "tel:+2302105209" }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 max-sm:bottom-4 max-sm:right-4 max-sm:left-4">
      {open ? (
        <section
          id="chatbox"
          className="chat-panel flex h-[34rem] w-[24rem] max-w-full flex-col overflow-hidden max-sm:h-[32rem] max-sm:w-full"
          aria-label="AllFinanz chatbot"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember text-white shadow-glow">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm font-extrabold text-white">AllFinanz assistant</p>
                <p className="text-xs font-semibold text-white/[0.76]">Accounting, tax, finance</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <p>{message.content}</p>
                {message.actions?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions.map((action) => (
                      <a
                        key={`${message.id}-${action.href}`}
                        href={action.href}
                        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.08] px-3 text-xs font-extrabold text-white transition hover:border-signal/40 hover:bg-signal/10"
                      >
                        {action.href.startsWith("tel:") ? <PhoneCall className="h-3.5 w-3.5" /> : null}
                        {action.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {loading ? (
              <div className="message assistant">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
                  Reading the signal...
                </span>
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white/[0.82] transition hover:bg-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form className="chat-form flex items-center gap-2" onSubmit={handleSubmit}>
              <input
                id="userInput"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about services, tax, finance..."
                className="min-h-12 flex-1 rounded-full border border-white/10 bg-white/[0.08] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-ember/50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember text-white transition hover:bg-emberDark disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        id="openChat"
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-14 items-center gap-3 rounded-full border border-white/[0.14] bg-graphiteSoft/90 px-4 font-extrabold text-white shadow-panel backdrop-blur-xl transition hover:border-ember/45 hover:bg-graphiteSoft"
        aria-expanded={open}
        aria-controls="chatbox"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="pr-1 max-sm:hidden">Ask AllFinanz</span>
      </button>
    </div>
  );
}
