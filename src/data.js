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
    title: "Custom Software Development Studio",
    description:
      "NullVibe is a custom software development studio building web apps, mobile apps, business websites and practical AI automation for businesses. Explore our services and demos.",
  },
  "/services": {
    title: "Custom Software Development Services",
    description:
      "Explore custom web application development, mobile app development, AI automation, business websites, e-commerce and software support from NullVibe.",
  },
  "/process": {
    title: "Our Software Development Process",
    description:
      "See how NullVibe discovers requirements, plans scope, designs interfaces, builds and tests software, then prepares a clear handover and ongoing support plan.",
  },
  "/demos": {
    title: "Interactive Web App & Software Demos",
    description:
      "Explore NullVibe's interactive booking platform, commerce experience and AI support assistant demos. Try sample workflows built to illustrate product ideas.",
  },
  "/about": {
    title: "About the Studio",
    description:
      "Learn about NullVibe's approach to custom software, web and mobile applications, business websites and practical AI automation.",
  },
  "/contact": {
    title: "Start a Software Project",
    description:
      "Talk with NullVibe about custom software development, a web application, mobile app, business website or AI automation project.",
  },
  "/booking": {
    title: "Book a Software Project Discovery Call",
    description:
      "Arrange an initial conversation with NullVibe about your business goals, software requirements, project scope and practical next steps.",
  },
  "/privacy": {
    title: "Privacy Policy",
    description:
      "Read the NullVibe privacy policy and learn how website enquiries, personal information and demonstration data are handled.",
  },
  "/faq": {
    title: "Custom Software Development FAQs",
    description:
      "Answers to common questions about custom software, app development, AI automation, project pricing, delivery timelines, ownership and support.",
  },
};
const serviceMeta = {
  "web-applications": {
    title: "Custom Web Application Development",
    description:
      "NullVibe designs custom web applications for customer portals, booking and scheduling platforms, SaaS products, dashboards and internal business workflows.",
  },
  "mobile-applications": {
    title: "Mobile App Development for iOS & Android",
    description:
      "Plan and build mobile applications for iOS and Android, from customer-facing apps and booking experiences to field-team tools and connected services.",
  },
  "ai-automation": {
    title: "AI Automation for Business Workflows",
    description:
      "Explore practical AI automation for customer support, internal knowledge search, document processing and repetitive business workflows, with human review.",
  },
  "websites-commerce": {
    title: "Business Website & E-commerce Development",
    description:
      "NullVibe builds responsive business websites, service pages, online stores and product catalogues with clear content, customer journeys and search foundations.",
  },
  "business-systems": {
    title: "Business Software & System Integration",
    description:
      "Connect business tools and data with tailored internal software, operations dashboards, customer-management workflows and third-party API integrations.",
  },
  "support-evolution": {
    title: "Software Maintenance & Development Support",
    description:
      "Improve existing software with application maintenance, performance work, new features, integrations and a clear plan for ongoing development.",
  },
};
const demoMeta = {
  booking: {
    title: "Booking Platform Demo",
    description:
      "Try a sample booking and scheduling platform concept, with an interactive customer flow created by NullVibe for demonstration purposes.",
  },
  commerce: {
    title: "E-commerce Platform Demo",
    description:
      "Explore a sample online shopping experience with product discovery and cart interactions. This is a demonstration concept by NullVibe.",
  },
  assistant: {
    title: "AI Customer Support Assistant Demo",
    description:
      "Try a sample AI customer-support assistant and see how a guided first response can work with people kept in the loop.",
  },
};
export function getPageMeta(path) {
  if (basePages[path]) return basePages[path];
  const service = services.find((item) => path === "/services/" + item.slug);
  if (service) return serviceMeta[service.slug];
  const demo = demos.find((item) => path === "/demos/" + item.slug);
  if (demo) return demoMeta[demo.slug];
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
