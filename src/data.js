export const services = [
  {
    slug: "web-applications",
    icon: "Desktop",
    title: "Web applications",
    short: "Software that works the way your business does.",
    detail:
      "From customer portals to the tools behind your operations, we design and build web applications around the people who use them.",
    category: "CUSTOM SOFTWARE",
    outcome: "Turn a complicated workflow into a clearer way of working.",
    examples: [
      "Customer & partner portals",
      "Booking and scheduling platforms",
      "SaaS products & dashboards",
      "Internal operations tools",
    ],
    deliverables: [
      "A shared requirements and scope document",
      "User journeys and interface designs",
      "Responsive application development",
      "Integrations, testing and release preparation",
    ],
    fit: "For businesses outgrowing spreadsheets, disconnected tools or off-the-shelf systems.",
    approach:
      "We map the workflow first, identify the essential features, and build a focused first release. You review progress throughout, so the product stays connected to the original business need.",
    related: "booking",
  },
  {
    slug: "mobile-applications",
    icon: "DeviceMobile",
    title: "Mobile applications",
    short: "Your business, closer to your customers.",
    detail:
      "Purposeful iOS and Android experiences that make it easier for customers and teams to get things done on the move.",
    category: "MOBILE EXPERIENCES",
    outcome: "Make the important moments simple, wherever they happen.",
    examples: [
      "Customer-facing mobile products",
      "Booking & service applications",
      "Field-team tools",
      "Companion apps for existing platforms",
    ],
    deliverables: [
      "Mobile user journeys and prototypes",
      "Platform and architecture recommendations",
      "Application and integration development",
      "Device testing and release support",
    ],
    fit: "For businesses with a clear mobile use case, from repeat customer interactions to work away from a desk.",
    approach:
      "We start with the tasks people need to complete, then choose a native or cross-platform approach to suit the experience, budget and maintenance needs.",
    related: "booking",
  },
  {
    slug: "ai-automation",
    icon: "Sparkle",
    title: "AI & automation",
    short: "Less busywork. More room to move forward.",
    detail:
      "Practical AI and connected workflows that help teams respond faster, find useful information and spend less time on repetitive tasks.",
    category: "APPLIED INTELLIGENCE",
    outcome: "Put useful intelligence where it makes a difference.",
    examples: [
      "Customer-support assistants",
      "Internal knowledge search",
      "Document processing workflows",
      "Automated operational tasks",
    ],
    deliverables: [
      "Workflow and data-readiness review",
      "A focused proof of concept",
      "Approved-source integrations",
      "Evaluation, human handoff and monitoring plans",
    ],
    fit: "For teams with repetitive tasks, a defined information source and a clear way to measure whether automation helps.",
    approach:
      "We test a small, useful workflow before expanding it. We account for incorrect answers, sensitive information, running costs and the points where a person should take over.",
    related: "assistant",
  },
  {
    slug: "websites-commerce",
    icon: "ShoppingBag",
    title: "Websites & commerce",
    short: "A better first impression. A clearer next step.",
    detail:
      "Company websites and online stores that make it easier to understand your offer, trust your business and take action.",
    category: "DIGITAL EXPERIENCES",
    outcome: "Give your business a digital presence with purpose.",
    examples: [
      "Company and service websites",
      "Online stores & product catalogues",
      "Campaign landing pages",
      "Content-managed websites",
    ],
    deliverables: [
      "Content structure and page planning",
      "Responsive interface design",
      "Performance and search foundations",
      "Enquiry or commerce integrations",
    ],
    fit: "For businesses launching, repositioning or improving the way customers discover and buy from them.",
    approach:
      "We connect clear messaging with an intentional customer journey. The design supports the content, and performance is part of the build from the beginning.",
    related: "commerce",
  },
  {
    slug: "business-systems",
    icon: "Plugs",
    title: "Business systems",
    short: "Bring your tools, teams and information together.",
    detail:
      "Connected systems and tailored internal tools that reduce duplicate work and give your team a more useful view of the business.",
    category: "CONNECTED OPERATIONS",
    outcome: "Make the work behind the scenes work better.",
    examples: [
      "Operations and reporting dashboards",
      "Customer-management tools",
      "Inventory and service workflows",
      "Third-party API integrations",
    ],
    deliverables: [
      "Process and system mapping",
      "Integration and migration planning",
      "Role-based application workflows",
      "Testing and handover documentation",
    ],
    fit: "For businesses spending too much time moving information between tools or keeping the same records in several places.",
    approach:
      "We examine the existing systems before recommending new ones. The aim is a practical solution that fits your team and keeps important information connected.",
    related: "booking",
  },
  {
    slug: "support-evolution",
    icon: "Wrench",
    title: "Support & evolution",
    short: "A good launch is a beginning.",
    detail:
      "A clear plan for maintaining, improving and extending your software as your business changes.",
    category: "LONG-TERM PROGRESS",
    outcome: "Keep your software useful as your business evolves.",
    examples: [
      "Application maintenance",
      "Performance improvements",
      "Feature development",
      "Technical reviews & modernization",
    ],
    deliverables: [
      "A review of the existing product",
      "Prioritized maintenance or improvement scope",
      "Agreed support responsibilities",
      "Release notes and handover updates",
    ],
    fit: "For businesses with existing software that needs care, a clearer improvement plan or room for its next stage.",
    approach:
      "We assess the product and agree on responsibilities, response expectations and priorities. Support terms are defined in the proposal so you know what is included.",
    related: "assistant",
  },
];
export const demos = [
  {
    slug: "booking",
    name: "Meetwell",
    category: "BOOKING & OPERATIONS",
    title: "Booking platform",
    text: "A simpler way to make time for your customers.",
  },
  {
    slug: "commerce",
    name: "Forma",
    category: "COMMERCE & RETAIL",
    title: "Commerce platform",
    text: "A considered shopping experience, from discovery to bag.",
  },
  {
    slug: "assistant",
    name: "Assist",
    category: "AI & CUSTOMER EXPERIENCE",
    title: "Support assistant",
    text: "A faster first response, with people in the loop.",
  },
];
export const contactEmail =
  import.meta.env.VITE_CONTACT_EMAIL || "contact@nullvibe.tech";
export const bookingUrl = import.meta.env.VITE_BOOKING_URL || "";
export const basePages = {
  "/": {
    title: "Custom software, mobile apps & AI for business",
    description:
      "NullVibe builds custom web applications, mobile apps and practical AI solutions. Clear scope, thoughtful design and fair pricing for your next stage of growth.",
  },
  "/services": {
    title: "Software development services",
    description:
      "Explore custom web and mobile development, AI automation, websites, business systems and software support from NullVibe.",
  },
  "/process": {
    title: "Our process — from discovery to launch",
    description:
      "How NullVibe plans, designs, builds and improves business software, with clear scope and practical milestones.",
  },
  "/demos": {
    title: "Interactive software demos",
    description:
      "Explore NullVibe demonstration concepts for booking, commerce and customer support. Try working interactions with sample data.",
  },
  "/about": {
    title: "About NullVibe",
    description:
      "A software partner focused on useful technology, clear communication and fair value for growing businesses.",
  },
  "/contact": {
    title: "Discuss your project",
    description:
      "Tell NullVibe about your business, your project and what you want to achieve. Contact contact@nullvibe.tech.",
  },
  "/booking": {
    title: "Book a discovery call",
    description:
      "Start a conversation about your business goals, software requirements and a practical next step.",
  },
  "/privacy": {
    title: "Privacy",
    description:
      "How NullVibe handles website enquiries, demonstration data and external booking links.",
  },
  "/faq": {
    title: "Frequently asked questions",
    description:
      "Answers about scope, pricing, software delivery, AI, ownership and ongoing support.",
  },
};
export function getPageMeta(path) {
  if (basePages[path]) return basePages[path];
  const service = services.find((s) => path === "/services/" + s.slug);
  if (service)
    return {
      title: service.title + " development",
      description: service.detail,
    };
  const demo = demos.find((d) => path === "/demos/" + d.slug);
  if (demo)
    return {
      title: demo.title + " demo",
      description:
        demo.text + " An interactive demonstration concept from NullVibe.",
    };
  return {
    title: "Page not found",
    description: "The requested page could not be found.",
    notFound: true,
  };
}
export const routes = [
  ...Object.keys(basePages),
  ...services.map((s) => "/services/" + s.slug),
  ...demos.map((d) => "/demos/" + d.slug),
];
