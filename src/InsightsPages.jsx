import React from "react";
import { ArrowRight, ArrowUpRight, CheckCircle } from "@phosphor-icons/react";
import { Button, CTA, Eyebrow, Link, PageHero } from "./components.jsx";
import { insightArticles } from "./data.js";

const guides = {
  "plan-a-custom-software-project": {
    intro:
      "A successful custom software project starts with a clear business outcome, not a long feature list. A little structure before development helps teams make better decisions about scope, budget, risk and what to build first.",
    sections: [
      {
        heading: "1. Describe the problem before choosing features",
        paragraphs: [
          "Write down what is difficult today, who experiences it and what should improve. “We need an app” is a solution idea; “customers cannot see booking availability without calling us” is a problem that can be investigated and measured.",
          "Choose one or two observable outcomes. Examples include reducing duplicate data entry, helping customers complete a task without staff assistance, or giving managers a reliable view of a workflow. Record the current baseline where you can."
        ]
      },
      {
        heading: "2. Map the people and the real workflow",
        paragraphs: [
          "List the people who will use, approve, administer and support the software. Their needs may differ. A customer, an operations team member and an administrator may all touch the same process but need different screens and permissions.",
          "Map the current process from its starting point to its finish. Include hand-offs, exceptions, approvals, notifications and the information that must be retained. This is often where hidden requirements appear."
        ],
        points: [
          "Who starts the workflow, and what information do they need?",
          "Which decisions require a person or a manager?",
          "What happens when information is missing or a step fails?",
          "Which existing tools or people receive the output?"
        ]
      },
      {
        heading: "3. Prioritise the first useful release",
        paragraphs: [
          "Separate essential capabilities from improvements that can wait. The first release should let a real user complete one meaningful end-to-end task; it should not be a collection of disconnected screens.",
          "For each proposed feature, ask which user problem it solves and what happens if it is postponed. Keep a short list of explicit exclusions as well as the included work. This protects the scope from quietly expanding."
        ],
        points: [
          "Must have: required for the main workflow to work safely.",
          "Should have: materially improves the experience, but has a reasonable workaround.",
          "Later: useful once the first release is in use and the need is clearer."
        ]
      },
      {
        heading: "4. Surface data, integration and security needs early",
        paragraphs: [
          "Identify where important information currently lives and which system should remain its source of truth. Check whether data needs to be imported, exported, synchronised or retained for reporting. Confirm who can provide access to existing systems and documentation.",
          "Describe the data the product will handle, who should see it, and which markets or contractual requirements apply. Authentication, role permissions, backups, audit trails and retention should be considered during planning—not added as last-minute polish."
        ]
      },
      {
        heading: "5. Estimate work with assumptions visible",
        paragraphs: [
          "A useful proposal explains deliverables, dependencies, milestones, review points and assumptions. Estimates become more meaningful when the team knows what content, integrations, decisions and third-party access are available.",
          "Ask how changes will be assessed, who approves them and how the impact on cost or timing will be communicated. A clear change process is more useful than a single estimate that hides uncertainty."
        ]
      },
      {
        heading: "6. Plan for testing, launch and ownership",
        paragraphs: [
          "Testing should cover the core user journeys, error states, permissions, supported devices and important integrations. Decide who supplies realistic test data and who signs off the release.",
          "Before launch, agree on hosting, domains, analytics where appropriate, backups, monitoring, support responsibilities and access to the source code or project documentation. Include a handover so the people operating the product know how it works."
        ]
      }
    ],
    takeaway:
      "A useful project brief can fit on one or two pages: the problem, users, desired outcomes, core workflow, first-release priorities, integrations, constraints and open questions. It is a starting point for discovery—not a substitute for technical planning.",
    links: [
      ["/services/web-applications", "Explore custom web application development"],
      ["/services/business-systems", "Explore business systems and integrations"],
      ["/process", "See the NullVibe delivery process"]
    ]
  },
  "custom-software-vs-off-the-shelf": {
    intro:
      "The choice between custom software and an off-the-shelf product is not simply a choice between expensive and cheap. It is a decision about workflow fit, time to value, control, integration, ongoing responsibility and the cost of changing direction later.",
    sections: [
      {
        heading: "When an off-the-shelf product is a good fit",
        paragraphs: [
          "Buying an existing product is often the sensible first option when your process is common, the product already covers the important requirements and your team can work comfortably within its configuration choices.",
          "You may get a quicker start, established support and a maintained product without funding a complete build. Before committing, check the full subscription and usage model, implementation effort, data-export options, integration limits and the vendor's approach to security and service continuity."
        ]
      },
      {
        heading: "When custom software deserves consideration",
        paragraphs: [
          "Custom development becomes worth exploring when a workflow is central to how your business operates, existing products force costly workarounds, or several systems need to work together in a way that standard integrations cannot support.",
          "A tailored application can give you more control over user journeys and business rules. That control comes with responsibility: someone must own maintenance, hosting, security updates, monitoring, documentation and future improvements."
        ],
        points: [
          "Your process is meaningfully different from the standard product workflow.",
          "The gaps create recurring delays, errors or manual work.",
          "Required integrations or permissions are not supported reliably.",
          "You need control over the roadmap or customer experience."
        ]
      },
      {
        heading: "Compare the whole cost, not only the first invoice",
        paragraphs: [
          "For a purchased product, consider subscriptions, seats, add-ons, implementation, integration, training, data migration and the cost of working around limitations. For custom software, consider discovery, design, development, infrastructure, support, maintenance and the time your team needs to manage the product.",
          "The right comparison uses the same time horizon and the same business requirements on both sides. Include the cost of doing nothing when the current workflow already creates measurable friction."
        ]
      },
      {
        heading: "A hybrid approach is often possible",
        paragraphs: [
          "You do not have to replace every existing tool. A business may keep its accounting or CRM product while adding a custom portal, workflow layer or integration around a specific gap.",
          "This approach can keep familiar systems in place while improving the part of the process that matters most. It still needs clear ownership of data, integration failure handling and a plan for changes to third-party APIs."
        ]
      },
      {
        heading: "Ask these questions before deciding",
        points: [
          "Does a standard product cover the essential workflow without fragile workarounds?",
          "Can the vendor support the integrations, access controls and data exports we need?",
          "What will the total cost look like over the next few years?",
          "Which parts of the experience actually differentiate our business?",
          "Who will maintain a custom solution after launch?",
          "Can we start with a smaller integration or first release before committing to a larger build?"
        ]
      }
    ],
    takeaway:
      "Choose the least complex option that reliably solves the business problem. Buy when the standard workflow fits; configure or integrate when there is a manageable gap; build when the gap is important enough to justify owning a tailored product.",
    links: [
      ["/services/web-applications", "Explore custom web applications"],
      ["/services/business-systems", "Explore business systems and integrations"],
      ["/contact", "Discuss a software decision with NullVibe"]
    ]
  },
  "where-ai-automation-helps": {
    intro:
      "AI automation is most useful when it supports a specific, repeatable task and the business can check whether the result is good enough. Starting with a small workflow is safer and more informative than adding a chatbot or model simply because the technology is available.",
    sections: [
      {
        heading: "Start with a task, not a model",
        paragraphs: [
          "Look for work that happens frequently, follows a recognisable process and consumes time without requiring every step to be a new judgement. Examples may include classifying incoming enquiries, extracting fields from standard documents, finding answers in an approved internal knowledge base or preparing a first draft for a staff member to review.",
          "Write down the input, expected output, current owner and what a successful result looks like. If the process itself is unclear or the source information is unreliable, automation will not fix the underlying problem."
        ]
      },
      {
        heading: "Check data readiness and permission",
        paragraphs: [
          "Identify the information the workflow needs, where it comes from, how current it is and who is allowed to access it. Confirm whether the information contains personal, confidential or regulated data and which contractual or legal requirements apply to the business and its customers.",
          "Use approved sources and limit access to what the workflow needs. Decide what can be sent to external services, how long records should be retained and how a user can request correction or human review."
        ]
      },
      {
        heading: "Measure a small pilot",
        paragraphs: [
          "Before building, record how the task works today. Useful measures might include time spent per case, number of cases handled, correction rate, missed items, response time and operating cost. Choose measures that reflect the actual business outcome rather than model output alone.",
          "Test the pilot against representative examples, including incomplete, unusual and deliberately confusing inputs. Have a person compare the output with the expected result and record the types of mistakes that occur."
        ]
      },
      {
        heading: "Keep people in control of consequential decisions",
        paragraphs: [
          "A useful system makes uncertainty visible and gives a person a clear way to correct, reject or escalate an output. High-impact decisions—such as decisions about eligibility, money, employment, health or legal rights—need a much more careful assessment and should not be delegated to an unchecked model.",
          "Set boundaries for what the system may do automatically. For example, it might prepare a response for approval rather than send it, or extract information for a person to verify rather than update a critical record without review."
        ]
      },
      {
        heading: "Design for failure and ongoing monitoring",
        points: [
          "Provide a reliable fallback when the model, integration or source system is unavailable.",
          "Log enough information to investigate errors while respecting privacy and retention rules.",
          "Track output quality, exception rates, latency and operating cost after launch.",
          "Re-test when prompts, models, source documents or connected systems change.",
          "Make it clear to users when they are interacting with an automated system."
        ]
      },
      {
        heading: "Decide whether to expand, change or stop",
        paragraphs: [
          "Compare the pilot with the baseline and agree what level of quality is acceptable for the task. If the system saves time but creates more correction work, it may not be a useful improvement. If it works only on a narrow set of cases, keep its scope narrow.",
          "Expand gradually when the evidence supports it. Document who owns the workflow, who monitors it and who can pause it if quality or risk changes."
        ]
      }
    ],
    takeaway:
      "A good AI pilot has one workflow, approved data, a measurable baseline, representative tests, a human fallback and a named owner. If those pieces are missing, improve the process first and revisit automation later.",
    links: [
      ["/services/ai-automation", "Explore AI automation for business workflows"],
      ["/services/business-systems", "Explore connected business systems"],
      ["/contact", "Discuss an AI automation use case with NullVibe"]
    ]
  }
};

function GuideCard({ article }) {
  return (
    <article className="service-card insight-card">
      <span className="micro-label">{article.category}</span>
      <h2>
        <Link to={"/insights/" + article.slug}>{article.title}</Link>
      </h2>
      <p>{article.description}</p>
      <div className="insight-card-bottom">
        <span>{article.readTime}</span>
        <Link to={"/insights/" + article.slug} className="text-link">
          Read the guide <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export function InsightsIndex() {
  return (
    <>
      <PageHero
        label="NULLVIBE INSIGHTS"
        title="Practical guides to software and AI decisions"
        text="Clear, useful guidance for teams planning custom software, comparing technology options or exploring where AI automation can help."
      />
      <section className="shell section">
        <div className="insights-grid">
          {insightArticles.map((article) => (
            <GuideCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}

export function InsightDetail({ slug }) {
  const article = insightArticles.find((item) => item.slug === slug);
  const content = guides[slug];
  if (!article || !content) {
    return (
      <section className="shell section">
        <h1>Guide not found</h1>
        <p>This guide is not available.</p>
        <Link to="/insights">Browse all guides <ArrowRight /></Link>
      </section>
    );
  }

  return (
    <>
      <PageHero
        label={article.category.toUpperCase()}
        title={article.title}
        text={article.description}
      >
        <div className="actions">
          <Link to="/insights" className="text-link">
            All insights <ArrowRight />
          </Link>
        </div>
      </PageHero>
      <article className="shell section insight-article">
        <p className="insight-meta">
          By <Link to="/about">NullVibe</Link> · Published <time dateTime={article.published}>{article.publishedLabel}</time> <span aria-hidden="true">·</span> {article.readTime}
        </p>
        <p className="lead">{content.intro}</p>
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.points && (
              <ul>
                {section.points.map((point) => (
                  <li key={point}><CheckCircle size={18} />{point}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <aside className="insight-takeaway">
          <Eyebrow>THE PRACTICAL TAKEAWAY</Eyebrow>
          <p>{content.takeaway}</p>
        </aside>
        <section className="insight-related">
          <h2>Explore the next step</h2>
          <ul>
            {content.links.map(([url, label]) => (
              <li key={url}>
                <Link to={url}>{label} <ArrowUpRight size={17} /></Link>
              </li>
            ))}
          </ul>
          <Button to="/contact">Discuss your project</Button>
        </section>
      </article>
      <CTA />
    </>
  );
}
