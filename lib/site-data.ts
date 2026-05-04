import {
  BarChart3,
  BadgeCheck,
  BriefcaseBusiness,
  Landmark,
  LineChart,
  ReceiptText
} from "lucide-react";

export const phoneNumber = "+230 2105209";

export const company = {
  name: "AllFinanz Consulting Ltd",
  strapline: "Chartered accountants, tax, and advisory",
  location: "Mauritius",
  phone: phoneNumber
};

export const navItems = [
  { href: "#hero", label: "Home" },
  { href: "#expertise", label: "Services" },
  { href: "#global", label: "Global" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" }
];

export const heroStats = [
  { value: "01", label: "clean reporting core" },
  { value: "02", label: "tax-aware decisions" },
  { value: "03", label: "cash and growth scenarios" }
];

export const headlineStats = [
  { numeric: 20, suffix: "+", label: "Years of experience across Mauritian finance" },
  { numeric: 98, suffix: "%", label: "Reporting clarity benchmark" },
  { numeric: 360, suffix: "°", label: "Tax, cash, and growth lens" },
  { numeric: 4, suffix: "", label: "Continents covered" }
];

export const marqueeTerms = [
  "Accounting",
  "Tax planning",
  "Financial planning",
  "Corporate finance",
  "Valuation",
  "Transaction support",
  "Corporate advisory",
  "Cash flow modelling",
  "Compliance",
  "Restructuring",
  "Forecasting",
  "Mauritius desk"
];

export const principles = [
  {
    code: "01",
    title: "Numbers earn trust",
    copy: "Reliable ledgers and reconciliations come before any narrative."
  },
  {
    code: "02",
    title: "Decisions over deliverables",
    copy: "Outputs are scoped to the call leadership has to make next."
  },
  {
    code: "03",
    title: "Local context, modern tooling",
    copy: "Mauritian compliance, paired with a contemporary advisory practice."
  },
  {
    code: "04",
    title: "Cross-border ready",
    copy: "Mauritian advisory grounding paired with reach across Africa, Asia, Europe and beyond."
  }
];

export const storySections = [
  {
    id: "story-1",
    kicker: "01",
    theme: "Chartered accountant insight",
    title: "A cleaner financial core",
    body:
      "Chartered accountant-led management accounts and reporting rhythms turn scattered records into decisions leadership can trust.",
    metric: "98%",
    metricLabel: "reporting clarity",
    proof: "Ledgers, reconciliations, and management views brought into one readable operating picture.",
    icon: ReceiptText
  },
  {
    id: "story-2",
    kicker: "02",
    theme: "Tax and compliance",
    title: "Every obligation in view",
    body:
      "Tax-aware planning keeps filings, governance, and major business choices aligned before pressure arrives.",
    metric: "360",
    metricLabel: "degree compliance lens",
    proof: "Deadlines, filings, records, and transaction context tracked as one compliance field.",
    icon: Landmark
  },
  {
    id: "story-3",
    kicker: "03",
    theme: "Strategic finance",
    title: "Scenarios before decisions",
    body:
      "Forecasts, budgets, and cash-flow models make important moves visible before capital is committed.",
    metric: "20+",
    metricLabel: "years guiding decisions",
    proof: "Board-ready scenarios shaped around cash, tax, exposure, and growth assumptions.",
    icon: LineChart
  }
];

export const capabilityCards = [
  {
    title: "Corporate advisory",
    copy: "Performance reviews, restructuring support, and execution roadmaps.",
    icon: BriefcaseBusiness
  },
  {
    title: "Corporate finance",
    copy: "Valuation, fundraising readiness, transaction support, and capital decision modelling.",
    icon: LineChart
  },
  {
    title: "Tax planning",
    copy: "Tax-aware guidance for companies, owners, and important transactions.",
    icon: BadgeCheck
  },
  {
    title: "Financial planning",
    copy: "Forecasts, budgets, cash-flow models, and capital planning.",
    icon: BarChart3
  },
  {
    title: "Accounting and reporting",
    copy: "Chartered accountant support for financial records, management reporting, and practical interpretation.",
    icon: ReceiptText
  }
];

export const processSteps = [
  {
    title: "Frame the signal",
    copy: "We isolate the decision, deadline, records, and risk before any heavy work begins."
  },
  {
    title: "Model the options",
    copy: "Financial data becomes scenarios, compliance checkpoints, and executive-ready tradeoffs."
  },
  {
    title: "Move with control",
    copy: "You leave with the reporting rhythm, action list, and governance needed to keep momentum."
  }
];

export const faqs = [
  {
    question: "What happens in the first consultation?",
    answer:
      "The first conversation frames the decision, the numbers available, the timeline, and the support needed. It is designed to be practical, not ceremonial."
  },
  {
    question: "Can AllFinanz support urgent tax or reporting questions?",
    answer:
      "Yes. If timing is sensitive, call the office directly on +230 2105209 and share the deadline so the request can be scoped quickly."
  },
  {
    question: "Do I need complete accounts before asking for advice?",
    answer:
      "No. Partial records, draft reports, bank data, budgets, and even a clear business question can be enough to start shaping the right work."
  },
  {
    question: "Can AllFinanz help with corporate finance decisions?",
    answer:
      "Yes. Corporate finance work can include valuation support, fundraising readiness, transaction review, due diligence preparation, and capital decision modelling."
  },
  {
    question: "How are advisory fees scoped?",
    answer:
      "Fees depend on the scope, urgency, complexity, and deliverables. The first step is to define the business question clearly."
  },
  {
    question: "Can the team work from incomplete records?",
    answer:
      "Yes. A partial ledger, draft trial balance, bank extracts, invoices, or a management question can be enough to start a focused diagnostic."
  },
  {
    question: "What should I prepare before calling?",
    answer:
      "Bring the question you need answered, the deadline, any current reports, and the constraint that worries you most. The team can help shape the rest."
  }
];
