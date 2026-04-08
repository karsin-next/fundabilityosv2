export type QuestionType = "text" | "textarea" | "select";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface StructuredQuestion {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
}

export const QUESTIONNAIRE: StructuredQuestion[] = [
  {
    id: "companyName",
    title: "What is your startup's name?",
    description: "Enter your legal or trading name.",
    type: "text",
    placeholder: "e.g., FundabilityOS",
  },
  {
    id: "problemStatement",
    title: "What specific problem do you solve?",
    description: "In 1 to 2 sentences, clearly describe the pain point and who suffers from it.",
    type: "textarea",
    placeholder: "Our customers struggle with...",
  },
  {
    id: "targetMarket",
    title: "Who is your primary target customer?",
    description: "Select the model that best describes your core focus.",
    type: "select",
    options: [
      { value: "B2B Enterprise", label: "Enterprise (B2B SaaS / Services)" },
      { value: "B2B SMB", label: "Small / Medium Businesses (SMB)" },
      { value: "B2C Consumer", label: "Consumers (B2C App / DTC)" },
      { value: "Marketplace", label: "Two-Sided Marketplace" },
      { value: "B2G / DeepTech", label: "Government / DeepTech / Healthcare" },
    ],
  },
  {
    id: "businessModel",
    title: "How do you make money?",
    description: "Select your primary business model.",
    type: "select",
    options: [
      { value: "SaaS / Subscription", label: "SaaS / Subscription" },
      { value: "Transaction Fee", label: "Transaction / Commission Fee" },
      { value: "E-Commerce", label: "E-Commerce / Direct-to-Consumer" },
      { value: "Hardware", label: "Hardware / IoT Sales" },
      { value: "Usage-Based", label: "Usage-Based / API" },
    ],
  },
  {
    id: "productStage",
    title: "Where is your product today?",
    description: "Choose the stage that accurately reflects your current technical progress.",
    type: "select",
    options: [
      { value: "Live with paying customers", label: "Live with paying customers" },
      { value: "Live/beta with active free users", label: "Live in beta with active free users" },
      { value: "Working prototype", label: "Working prototype / MVP (Pre-launch)" },
      { value: "Idea only", label: "Idea / Wireframes only" },
    ],
  },
  {
    id: "revenueStage",
    title: "What is your current monthly revenue?",
    description: "Select your MRR or average monthly gross revenue.",
    type: "select",
    options: [
      { value: ">$100k/month", label: "Above $100k / month" },
      { value: "$10k-$100k/month", label: "$10k – $100k / month" },
      { value: "$1k-$10k/month", label: "$1k – $10k / month" },
      { value: "<$1k/month or LOIs", label: "Under $1k / month or Strong LOIs" },
      { value: "Pre-revenue", label: "Pre-revenue" },
    ],
  },
  {
    id: "runway",
    title: "How much financial runway do you have left?",
    description: "How many months can you survive without new funding?",
    type: "select",
    options: [
      { value: ">12 months", label: "More than 12 months (or Profitable)" },
      { value: "6-12 months", label: "6 to 12 months" },
      { value: "3-6 months", label: "3 to 6 months" },
      { value: "<3 months", label: "Less than 3 months" },
    ],
  },
  {
    id: "teamSize",
    title: "What does your founding team look like?",
    description: "Investors look for team durability and commitment.",
    type: "select",
    options: [
      { value: "4+ full-time", label: "4+ full-time dedicated team members" },
      { value: "2-3 full-time", label: "2 to 3 full-time co-founders" },
      { value: "2-3 part-time", label: "2 to 3 part-time co-founders" },
      { value: "Solo founder", label: "Solo founder" },
    ],
  },
  {
    id: "previousFunding",
    title: "Have you raised outside funding before?",
    description: "Select the most advanced round you have closed.",
    type: "select",
    options: [
      { value: "Institutional VC", label: "Institutional VC (Seed / Series A+)" },
      { value: "Angel / Friends & Family", label: "Angel Investors / Friends & Family" },
      { value: "Bootstrapped with revenue", label: "Bootstrapped (with active revenue)" },
      { value: "None", label: "Completely self-funded (Pre-revenue)" },
    ],
  },
  {
    id: "marketSize",
    title: "How large is your Total Addressable Market (TAM)?",
    description: "Be realistic. Investors prefer highly targeted markets over vague massive ones.",
    type: "select",
    options: [
      { value: "Large (>$1B)", label: "Massive (>$1 Billion)" },
      { value: "Medium ($100M-$1B)", label: "Medium ($100M – $1 Billion)" },
      { value: "Niche (<$100M)", label: "Niche (<$100 Million)" },
      { value: "Unknown", label: "We haven't sized it yet" },
    ],
  },
  {
    id: "customerAcquisition",
    title: "What is your primary customer acquisition channel?",
    description: "Select the strategy that brings in the most users right now.",
    type: "select",
    options: [
      { value: "Outbound Sales", label: "Outbound Sales / Cold Outreach" },
      { value: "Paid Ads", label: "Paid Advertising (Meta, Google, LinkedIn)" },
      { value: "SEO / Content", label: "Inbound SEO / Content Marketing" },
      { value: "Viral / Referral", label: "Viral / Word of Mouth / Product-Led" },
      { value: "Partnerships", label: "Channel Partnerships / B2B Distribution" },
    ],
  },
  {
    id: "competitiveMoat",
    title: "What is your strongest competitive moat?",
    description: "Why will it be hard for competitors to beat you?",
    type: "select",
    options: [
      { value: "Proprietary Tech / AI", label: "Proprietary Technology / Patented IP" },
      { value: "Network Effects", label: "Network Effects / High liquidity" },
      { value: "High Switching Costs", label: "High Switching Costs for users" },
      { value: "Exclusive Data", label: "Exclusive Data or Unique Partnerships" },
      { value: "Speed to Market", label: "First-to-Market Speed (No deep moat yet)" },
    ],
  },
  {
    id: "targetRaise",
    title: "How much are you looking to raise?",
    description: "Select your target funding amount for this upcoming round.",
    type: "select",
    options: [
      { value: "<$250k", label: "Under $250k (Pre-Seed)" },
      { value: "$250k-$1M", label: "$250k – $1M (Strong Pre-Seed / Small Seed)" },
      { value: "$1M-$3M", label: "$1M – $3M (Core Seed)" },
      { value: "$3M-$10M", label: "$3M – $10M (Series A)" },
      { value: ">$10M", label: "Above $10M (Series B+)" },
    ],
  },
  {
    id: "keyMilestone",
    title: "What is the primary milestone this funding will unlock?",
    description: "What will you explicitly achieve with this new capital?",
    type: "select",
    options: [
      { value: "Finish MVP", label: "Finish building our MVP" },
      { value: "Product-Market Fit", label: "Prove initial Product-Market Fit" },
      { value: "Scale Revenue 3x", label: "Scale Go-To-Market / Triple Revenue" },
      { value: "Expand Markets", label: "Expand into new geographical markets" },
      { value: "Key Hires", label: "Hire key technical/executive talent" },
    ],
  },
  {
    id: "investorConcern",
    title: "What do you think investors will push back on hardest?",
    description: "Being honest actually improves your AI confidence score.",
    type: "select",
    options: [
      { value: "Too early / Unproven revenue", label: "We are too early / unproven revenue" },
      { value: "Crowded market", label: "The market is highly crowded / competitive" },
      { value: "High CAC", label: "Customer Acquisition Cost (CAC) is currently too high" },
      { value: "Team lacks domain expertise", label: "Our team lacks specific technical / domain expertise" },
      { value: "Tech scalability", label: "Our technology is hard/expensive to scale" },
    ],
  },
];
