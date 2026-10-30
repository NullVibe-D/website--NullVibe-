import React from "react";
import {
  ArrowRight,
  Check,
  Compass,
  CurrencyCircleDollar,
  Handshake,
  Sparkle,
  Target,
  ShieldCheck,
} from "@phosphor-icons/react";
import { PageHero, Eyebrow, Button, CTA, FAQList } from "./components.jsx";

const principles = [
  {
    icon: Target,
    title: "Start with the business.",
    text: "Understand your customers, your operations and the change you want to make. Give every feature a clear purpose.",
  },
  {
    icon: CurrencyCircleDollar,
    title: "Make the investment count.",
    text: "Prioritise the work that matters, explain the trade-offs and agree a clear scope. Fair pricing starts with a shared understanding.",
  },
  {
    icon: Handshake,
    title: "Keep the process human.",
    text: "Straightforward conversations, visible progress and useful feedback. You should understand what is being built and why.",
  },
  {
    icon: Sparkle,
    title: "Use technology thoughtfully.",
    text: "Choose the tools that fit the problem. Use AI where it can help, with attention to accuracy, privacy and human oversight.",
  },
];

export function About() {
  return (
    <>
      <PageHero
        label="ABOUT NULLVIBE"
        title="Built around your business."
        text="We bring design, engineering and practical AI together to help businesses serve customers better, simplify their work and make room for growth."
      />

      <section
        className="shell section split-section"
        aria-labelledby="our-purpose"
      >
        <div>
          <Eyebrow>OUR PURPOSE</Eyebrow>
          <h2 id="our-purpose">Good software should make a real difference.</h2>
          <div className="prose">
            <p>
              A growing business needs more than a new website or another tool.
              It needs a solution that fits the people, processes and
              opportunities behind it.
            </p>
            <p>
              That is the focus of NullVibe. We build custom web and mobile
              applications, connected business systems and AI-assisted
              experiences around what you want to achieve. From a first digital
              product to a better way of running your operations, we help turn
              the next step into a practical plan.
            </p>
            <p>
              Our aim is lasting value: software that is useful to your
              customers, manageable for your team and ready to develop with your
              business. We treat growth as a goal to work towards, with success
              measures agreed around your project.
            </p>
          </div>
          <a className="text-link" href="/services">
            Explore our capabilities <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="principle-card">
          <img
            src="/images/hero-logo.webp"
            alt="The sculptural NullVibe emblem, finished in silver with a crimson edge"
            width="1400"
            height="1100"
            loading="lazy"
            decoding="async"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
          <Eyebrow>THOUGHTFUL SOFTWARE. MEANINGFUL PROGRESS.</Eyebrow>
          <p>Clear thinking. Considered design. Purposeful technology.</p>
        </div>
      </section>

      <section className="dark-section" aria-labelledby="our-principles">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>WHAT GUIDES OUR WORK</Eyebrow>
              <h2 id="our-principles">
                A practical approach.
                <br />A thoughtful partnership.
              </h2>
            </div>
            <p>
              Four principles that shape how we approach your project, from the
              first conversation to the next improvement.
            </p>
          </div>
          <div className="principle-grid">
            {principles.map(({ icon: Icon, title, text }) => (
              <article className="principle-card" key={title}>
                <Icon size={32} weight="light" aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="shell section split-section"
        aria-labelledby="clear-from-start"
      >
        <div>
          <Eyebrow>CLARITY FROM THE START</Eyebrow>
          <h2 id="clear-from-start">
            The right next step.
            <br />
            At the right scale.
          </h2>
        </div>
        <div className="prose">
          <p>
            Some projects need a focused first release. Others need an existing
            system improved, a workflow connected or a customer experience
            rethought. We start by understanding the opportunity, then shape the
            scope around it.
          </p>
          <p>
            Before development, the proposal should make the deliverables,
            responsibilities, milestones and commercial terms clear. Optional
            features and ongoing costs belong in that conversation too.
          </p>
          <a className="text-link" href="/process">
            See how we work <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>
      <CTA />
    </>
  );
}

const processSteps = [
  {
    title: "Discover the opportunity.",
    label: "DISCOVERY & PLANNING",
    text: "Start with the business problem. We explore your goals, the people who will use the software and the constraints that shape a useful solution.",
    inputs:
      "Your goals, current workflows, existing tools, priorities and any budget or timing considerations.",
    outputs:
      "A shared problem definition, prioritised requirements, project scope and a proposal with assumptions and dependencies.",
    checkpoint:
      "Agree what success means and which features belong in the first release.",
  },
  {
    title: "Make the experience clear.",
    label: "EXPERIENCE & DESIGN",
    text: "Turn the requirements into user journeys and interface designs. Work through the important decisions before they become expensive development changes.",
    inputs:
      "Brand material, content, examples of your current experience and feedback from the people making decisions.",
    outputs:
      "An agreed page or feature structure, key screen designs and interaction states appropriate to the scope.",
    checkpoint:
      "Review the main journeys, mobile layouts and essential content together.",
  },
  {
    title: "Build in focused stages.",
    label: "ENGINEERING & INTEGRATION",
    text: "Develop the agreed features, connect the required services and make progress visible through working previews and milestone reviews.",
    inputs:
      "Timely feedback, approved content and access to agreed third-party systems through secure channels.",
    outputs:
      "Working software, relevant integrations, implementation documentation and testing against the agreed requirements.",
    checkpoint:
      "Check real behaviour, including empty states, validation and failures—not only the ideal path.",
  },
  {
    title: "Launch with a clear handover.",
    label: "VERIFICATION & RELEASE",
    text: "Review the complete experience in its intended environment. Confirm the details that make a release useful, reliable and manageable.",
    inputs:
      "Approval of the release, production accounts and domain access where required, plus any operational or policy content.",
    outputs:
      "The agreed deployment, launch checks, handover information and a record of remaining or future work.",
    checkpoint:
      "Verify core journeys, delivery channels, responsive layouts and the agreed support arrangements.",
  },
  {
    title: "Improve with purpose.",
    label: "CARE & EVOLUTION",
    text: "Use feedback and the measures agreed for your project to decide what deserves attention next. Keep the next investment connected to a business need.",
    inputs:
      "Customer feedback, operational experience and relevant performance or usage information.",
    outputs:
      "A prioritised improvement plan and, when included in your agreement, maintenance or further development.",
    checkpoint: "Agree the scope and cost of ongoing work before it begins.",
  },
];

export function Process() {
  return (
    <>
      <PageHero
        label="HOW WE WORK"
        title="A clear path from idea to impact."
        text="A collaborative process that connects each decision to your business. Clear milestones, practical feedback and a shared understanding of what comes next."
      >
        <Button to="/contact">Discuss your project</Button>
      </PageHero>

      <section className="shell section" aria-label="Our delivery process">
        <div className="timeline">
          {processSteps.map((step, index) => (
            <article className="timeline-step" key={step.label}>
              <div className="step-number" aria-hidden="true">
                0{index + 1}
              </div>
              <div>
                <Eyebrow>{step.label}</Eyebrow>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
                <div className="principle-grid">
                  <div className="principle-card">
                    <h3>What you bring</h3>
                    <p>{step.inputs}</p>
                  </div>
                  <div className="principle-card">
                    <h3>What we work towards</h3>
                    <p>{step.outputs}</p>
                  </div>
                </div>
                <ul className="checklist">
                  <li>
                    <Check size={18} aria-hidden="true" />
                    <span>{step.checkpoint}</span>
                  </li>
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-section" aria-labelledby="quality-expectations">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>CARE IN THE DETAILS</Eyebrow>
              <h2 id="quality-expectations">Quality is part of the process.</h2>
            </div>
            <p>
              The checks and deliverables depend on your product, its users and
              the agreed scope. These are the questions we bring to every
              project.
            </p>
          </div>
          <div className="principle-grid">
            <article className="principle-card">
              <Compass size={32} weight="light" aria-hidden="true" />
              <h3>Can people use it easily?</h3>
              <p>
                Clear navigation, readable content, responsive layouts and
                attention to accessible interactions.
              </p>
            </article>
            <article className="principle-card">
              <ShieldCheck size={32} weight="light" aria-hidden="true" />
              <h3>Does it behave reliably?</h3>
              <p>
                Appropriate validation, permissions, error handling and testing
                of the journeys your business depends on.
              </p>
            </article>
            <article className="principle-card">
              <Target size={32} weight="light" aria-hidden="true" />
              <h3>Can it move forward?</h3>
              <p>
                Considered performance, clear handover and an understanding of
                maintenance and future changes.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="shell section split-section"
        aria-labelledby="project-shape"
      >
        <div>
          <Eyebrow>ROOM FOR THE RIGHT DECISIONS</Eyebrow>
          <h2 id="project-shape">Every project has its own pace.</h2>
        </div>
        <div className="prose">
          <p>
            Timing depends on scope, complexity, integrations and the
            availability of content and feedback. We discuss those dependencies
            before agreeing milestones, rather than attaching a fixed duration
            to every project.
          </p>
          <p>
            If the requirements change, we explain the effect on cost and timing
            and agree the next step with you. A useful process makes change
            understandable.
          </p>
          <a className="text-link" href="/faq">
            Read common questions <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>
      <CTA />
    </>
  );
}

export const faqItems = [
  {
    q: "What kinds of software does NullVibe build?",
    a: "We focus on custom web applications, mobile apps, websites and e-commerce, business systems, integrations, and practical AI and automation. The right starting point depends on the problem you want to solve. Share your idea even if you are not sure which service it fits.",
  },
  {
    q: "Can you help if I only have an idea?",
    a: "Yes. A first conversation can clarify who the product is for, what it needs to achieve and which features are essential. We can then discuss an appropriate discovery or planning scope before committing to development.",
  },
  {
    q: "How do you price a project?",
    a: "Pricing depends on the requirements, integrations, design needs and delivery responsibilities. We discuss priorities and prepare a proposal with a defined scope, assumptions and commercial terms. Hosting, subscriptions and other third-party costs should be identified separately where they apply.",
  },
  {
    q: "Can we start small and expand later?",
    a: "Yes. A focused first release can help you address the most important need before investing in additional features. We discuss which decisions need to support future growth and which work can reasonably wait.",
  },
  {
    q: "How long will my project take?",
    a: "A useful estimate needs a clear scope. Complexity, external integrations, content and review availability all affect timing. Milestones and dependencies are discussed in your proposal; there is no single timeline that fits every project.",
  },
  {
    q: "Do you build for both iOS and Android?",
    a: "We can discuss mobile applications for both platforms. The approach depends on the required device features, user experience, budget and maintenance needs. Store accounts, submission responsibilities and release requirements are agreed as part of the project.",
  },
  {
    q: "Does every solution need AI?",
    a: "No. AI is useful when it addresses a clear need, such as searching approved knowledge or assisting a repetitive workflow. We assess the data, expected accuracy, operating costs and need for human review before recommending it. A straightforward software feature may be the better fit.",
  },
  {
    q: "Can you improve or connect our existing systems?",
    a: "Potentially. We first need to understand the existing technology, available integrations, access rights and any limitations. That review helps establish whether an improvement, integration or replacement is a sensible option.",
  },
  {
    q: "Who owns the finished software and accounts?",
    a: "Ownership, licensing, source-code handover and account responsibilities must be stated in the project agreement. Third-party software and services can carry their own terms. We discuss these details before work begins so you understand what will be delivered and what remains a separate service.",
  },
  {
    q: "What happens after launch?",
    a: "Maintenance, issue resolution and future development depend on the support arrangements included in your agreement. We discuss the scope, responsibilities and costs before launch. Response times or ongoing work are not assumed unless they are agreed.",
  },
  {
    q: "Are the demo projects real client work?",
    a: "No. They are interactive demonstration concepts using sample data. They illustrate possible experiences and do not create real bookings, orders or conversations with a live AI service. Their features and sample figures are not client results.",
  },
  {
    q: "How can I start a conversation?",
    a: "Use the contact page or email contact@nullvibe.tech with a short explanation of your business and what you want to improve. If an online calendar is connected, the booking page lets you continue to the scheduling provider. An email request does not reserve a meeting until the time is confirmed.",
  },
];

export function FAQ() {
  return (
    <>
      <PageHero
        label="COMMON QUESTIONS"
        title="A little clarity before we begin."
        text="What to expect when exploring a project with NullVibe. Specific deliverables, costs and responsibilities are agreed in your proposal."
      />
      <section
        className="shell section split-section"
        aria-labelledby="getting-started"
      >
        <div>
          <Eyebrow>YOUR FIRST STEP</Eyebrow>
          <h2 id="getting-started">
            The idea.
            <br />
            The scope.
            <br />
            The investment.
          </h2>
          <p>
            You do not need a finished specification to start a useful
            conversation.
          </p>
        </div>
        <FAQList items={faqItems.slice(0, 5)} />
      </section>
      <section
        className="shell section split-section"
        aria-labelledby="building-together"
      >
        <div>
          <Eyebrow>BUILDING TOGETHER</Eyebrow>
          <h2 id="building-together">Technology that fits.</h2>
          <p>
            The technical approach follows the needs of your business and the
            people using the product.
          </p>
        </div>
        <FAQList items={faqItems.slice(5, 8)} />
      </section>
      <section
        className="shell section split-section"
        aria-labelledby="next-steps"
      >
        <div>
          <Eyebrow>THE PRACTICAL DETAILS</Eyebrow>
          <h2 id="next-steps">
            Clear expectations.
            <br />
            Confident next steps.
          </h2>
          <p>
            Still have something on your mind?{" "}
            <a href="mailto:contact@nullvibe.tech">contact@nullvibe.tech</a>
          </p>
        </div>
        <FAQList items={faqItems.slice(8)} />
      </section>
      <CTA />
    </>
  );
}

const privacySections = [
  ["information", "Information you choose to share"],
  ["enquiries", "How enquiries are handled"],
  ["providers", "Service providers"],
  ["booking", "Booking a conversation"],
  ["demos", "Demonstration projects"],
  ["storage", "Cookies, storage and logs"],
  ["choices", "Your choices and requests"],
];

export function Privacy() {
  return (
    <>
      <PageHero
        label="YOUR INFORMATION"
        title="Privacy, in plain language."
        text="This notice explains how the NullVibe website handles information you choose to share with us."
      />
      <div className="shell section legal-layout">
        <nav className="legal-nav" aria-label="Privacy notice contents">
          <Eyebrow>IN THIS NOTICE</Eyebrow>
          {privacySections.map(([id, label]) => (
            <a href={"#" + id} key={id}>
              {label}
            </a>
          ))}
        </nav>
        <article className="legal-content prose">
          <p>
            <strong>Website:</strong> nullvibe.tech
            <br />
            <strong>Privacy contact:</strong>{" "}
            <a href="mailto:contact@nullvibe.tech">contact@nullvibe.tech</a>
          </p>

          <section id="information">
            <h2>Information you choose to share</h2>
            <p>
              When you contact NullVibe, you may provide your name, email
              address, company, service interests, budget or timing preferences,
              and information about your project. We use this information to
              understand and respond to your enquiry and discuss a possible
              working relationship.
            </p>
            <p>
              Please share only what is needed for the conversation. Do not
              include passwords, payment details, confidential customer records
              or other sensitive information in the form or demonstration
              projects.
            </p>
          </section>

          <section id="enquiries">
            <h2>How enquiries are handled</h2>
            <p>
              When online form delivery is enabled, submitting the form sends
              your enquiry to NullVibe through the configured email delivery
              service. The form asks you to acknowledge this notice before
              submitting. A confirmation is shown only after the delivery
              service accepts the enquiry; it does not confirm that a person has
              read it.
            </p>
            <p>
              If online delivery is unavailable, the website explains this and
              provides an email alternative. Opening an email link prepares a
              message in your own email application. You decide whether to send
              it, and your email provider handles that message under its own
              terms.
            </p>
            <p>
              Enquiries are not automatically added to a marketing list.
              Information shared during a later project may be covered by a
              separate agreement.
            </p>
          </section>

          <section id="providers">
            <h2>Service providers</h2>
            <p>
              The website supports Resend for email delivery. When that
              integration is enabled, Resend processes the form information
              needed to deliver the enquiry to our mailbox. Our email provider
              processes messages we receive and send. The hosting provider
              processes requests needed to serve and protect the website.
            </p>
            <p>
              These providers may process information on infrastructure outside
              your country. Their handling of service data is governed by the
              applicable provider terms and privacy notices. This notice will be
              updated when changes to the services used affect how your
              information is handled.
            </p>
          </section>

          <section id="booking">
            <h2>Booking a conversation</h2>
            <p>
              When a scheduling calendar is connected, the booking page links to
              an external scheduling provider. That provider handles the
              availability, booking details and confirmation under its own
              privacy notice. Opening the booking page alone does not reserve an
              appointment.
            </p>
            <p>
              You may also request a conversation by email. A requested time is
              not confirmed until you receive an agreed appointment.
            </p>
          </section>

          <section id="demos">
            <h2>Demonstration projects</h2>
            <p>
              The interactive demos use sample data and temporary page state.
              Demo bookings and shopping actions do not create real
              appointments, orders or payments. The assistant demonstration uses
              scripted responses and does not send your messages to a live AI
              service.
            </p>
            <p>
              Treat the demos as examples of an experience and avoid entering
              personal or confidential information.
            </p>
          </section>

          <section id="storage">
            <h2>Cookies, storage and logs</h2>
            <p>
              This website does not include advertising trackers or analytics
              scripts, and it does not use non-essential cookies to track you.
              Form and demo interactions use temporary page state rather than a
              persistent visitor profile.
            </p>
            <p>
              When online form delivery is enabled, temporary request
              information may be used to limit repeated submissions and reduce
              abuse. Hosting and email providers may also keep operational logs,
              including request times, network information and delivery status,
              as part of running their services. Retention of those logs depends
              on the provider and its configuration.
            </p>
          </section>

          <section id="choices">
            <h2>Your choices and requests</h2>
            <p>
              You can choose not to submit the contact form and contact us
              directly by email instead. To ask about information you have
              shared, request a correction or enquire about deletion, email{" "}
              <a href="mailto:contact@nullvibe.tech">contact@nullvibe.tech</a>.
              We may need enough information to identify the relevant
              conversation before responding.
            </p>
            <p>
              Enquiries may remain in the business mailbox while the
              conversation is relevant. This notice does not set a fixed
              deletion period; any request will be considered alongside
              applicable record-keeping obligations and the capabilities of the
              services used.
            </p>
            <p>
              This notice may be updated when the way the website handles
              information changes. Please review it before sharing information
              through a new feature.
            </p>
          </section>
        </article>
      </div>
    </>
  );
}
