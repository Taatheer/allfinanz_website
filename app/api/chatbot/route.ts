import { NextResponse } from "next/server";

const phoneNumber = "+230 2105209";

type ChatAction = {
  label: string;
  href: string;
};

type ChatReply = {
  content: string;
  actions?: ChatAction[];
};

const callAction = { label: `Call ${phoneNumber}`, href: "tel:+2302105209" };

function includesAny(message: string, terms: string[]) {
  return terms.some((term) => message.includes(term));
}

function buildReply(input: string): ChatReply {
  const message = input.toLowerCase();

  if (
    includesAny(message, [
      "corporate finance",
      "valuation",
      "fundraise",
      "fundraising",
      "capital raise",
      "capital",
      "investor",
      "transaction",
      "acquisition",
      "merger",
      "m&a",
      "due diligence",
      "debt",
      "equity"
    ])
  ) {
    return {
      content:
        "For corporate finance, AllFinanz can help frame valuation, fundraising readiness, transaction review, due diligence preparation, and capital decision modelling. Start with the transaction goal, latest numbers, timeline, and any investor or lender requirements.",
      actions: [
        { label: "View corporate finance", href: "#expertise" },
        callAction
      ]
    };
  }

  if (includesAny(message, ["service", "offer", "do you do", "what do you", "support"])) {
    return {
      content:
        "AllFinanz supports accounting and reporting, tax consulting, financial planning, cash-flow modelling, controls, corporate advisory, and corporate finance. The best starting point is to define the decision, deadline, and records available.",
      actions: [
        { label: "View capabilities", href: "#expertise" },
        callAction
      ]
    };
  }

  if (includesAny(message, ["tax", "vat", "filing", "compliance", "mra"])) {
    return {
      content:
        "For tax work, start with the entity type, period, deadline, current records, and the transaction or filing that needs attention. If timing is tight, call the office directly.",
      actions: [
        { label: "Go to tax section", href: "#story-2" },
        callAction
      ]
    };
  }

  if (includesAny(message, ["account", "ledger", "book", "report", "statement"])) {
    return {
      content:
        "For accounting and reporting, the team can begin from management accounts, ledgers, bank extracts, draft statements, or a practical reporting question. The goal is to create numbers leadership can trust.",
      actions: [
        { label: "Open ledger section", href: "#story-1" },
        callAction
      ]
    };
  }

  if (includesAny(message, ["cash", "forecast", "budget", "plan", "financial planning", "scenario"])) {
    return {
      content:
        "For financial planning, AllFinanz can shape budgets, cash-flow forecasts, board scenarios, and capital planning. Bring the latest numbers, assumptions, and the decision you need to make.",
      actions: [
        { label: "View scenarios", href: "#story-3" },
        callAction
      ]
    };
  }

  if (includesAny(message, ["fee", "cost", "price", "quote"])) {
    return {
      content:
        "Fees depend on urgency, complexity, records quality, and deliverables. A short scoping call is the cleanest way to avoid vague estimates.",
      actions: [callAction]
    };
  }

  if (includesAny(message, ["start", "begin", "consultation", "appointment", "meeting"])) {
    return {
      content:
        "To start, prepare the question, the deadline, current reports or records, and the constraint that worries you most. Then call the office so the work can be scoped properly.",
      actions: [
        { label: "Read FAQ", href: "#faq" },
        callAction
      ]
    };
  }

  if (includesAny(message, ["phone", "call", "contact", "number", "urgent"])) {
    return {
      content: `The direct office number is ${phoneNumber}. For urgent tax, reporting, or advisory work, calling is the fastest route.`,
      actions: [callAction]
    };
  }

  return {
    content:
      "I can help route questions about accounting, tax, financial planning, corporate finance, compliance, controls, and corporate advisory. Share the business question and deadline, or call the office for direct support.",
    actions: [
      { label: "View capabilities", href: "#expertise" },
      callAction
    ]
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: unknown };
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        {
          content:
            "Please share a short question about accounting, tax, planning, corporate finance, or advisory support.",
          actions: [callAction]
        },
        { status: 400 }
      );
    }

    return NextResponse.json(buildReply(message.slice(0, 900)));
  } catch {
    return NextResponse.json(
      {
        content:
          "I could not read that message. Please try again or call the office directly.",
        actions: [callAction]
      },
      { status: 400 }
    );
  }
}
