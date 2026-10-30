import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Desktop,
  DeviceMobile,
  Sparkle,
  ShoppingBag,
  Plugs,
  Wrench,
  Check,
} from "@phosphor-icons/react";
import {
  Link,
  Button,
  Eyebrow,
  PageHero,
  CTA,
  FAQList,
  NotFound,
} from "./components.jsx";
import { services, demos } from "./data.js";
import { DemoCard } from "./Demos.jsx";
const icons = { Desktop, DeviceMobile, Sparkle, ShoppingBag, Plugs, Wrench };
const homeQuestions = [
  {
    q: "Where do we start?",
    a: "With your business, the problem you want to solve and who will use the software. We’ll discuss a practical starting point before recommending a scope.",
  },
  {
    q: "How do you keep pricing fair?",
    a: "We agree on priorities and deliverables before development. A focused first release can make better use of your budget, with additional features planned separately.",
  },
  {
    q: "Can you improve our existing software?",
    a: "Yes. We first review the current application and constraints, then propose a realistic scope for maintenance, integration or new development.",
  },
  {
    q: "Do we need AI in our product?",
    a: "Only when it helps solve a real problem. We assess data readiness, accuracy, operating costs and where human review is needed before recommending an AI feature.",
  },
];
export function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <Eyebrow>SOFTWARE WITH A BUSINESS PURPOSE</Eyebrow>
          <h1>
            Built for business.
            <br />
            <span className="tone">Designed for</span>
            <br />
            progress<span className="red">.</span>
          </h1>
          <p>
            Custom web applications, mobile experiences and practical AI.
            Thoughtfully built to help your business work better and grow.
          </p>
          <div className="actions">
            <Button to="/contact">Discuss your project</Button>
            <Link to="/demos" className="text-link">
              Explore our demos <ArrowRight />
            </Link>
          </div>
          <div className="hero-note">
            <span />
            Clear scope. Fair pricing. Shared ambition.
          </div>
        </div>
        <div className="hero-art">
          <img
            src="/images/hero-logo.webp"
            alt="NullVibe’s sculptural chrome emblem with a crimson edge"
            width="1200"
            height="942"
            fetchPriority="high"
          />
          <div className="art-caption">
            <span>DESIGN × ENGINEERING</span>
            <span>Made to move you forward.</span>
          </div>
        </div>
      </section>
      <div className="capability-bar">
        <div className="shell">
          <span>IDEA TO IMPACT</span>
          <p>Strategy & discovery</p>
          <span className="bar-separator" />
          <p>Design & development</p>
          <span className="bar-separator" />
          <p>AI & automation</p>
          <span className="bar-separator" />
          <p>Ongoing evolution</p>
        </div>
      </div>
      <section className="shell section intro-section">
        <div data-reveal>
          <Eyebrow>THE RIGHT PARTNER. THE RIGHT NEXT STEP.</Eyebrow>
          <h2>
            Your ambition.
            <br />A clearer way forward<span className="red">.</span>
          </h2>
        </div>
        <div className="intro-body" data-reveal>
          <p className="lead">
            Technology should make a meaningful difference to your business.
          </p>
          <p>
            We connect thoughtful design with dependable engineering to help you
            serve customers, simplify operations and create new opportunities.
            We start with what matters to you, then build what makes sense.
          </p>
          <Link to="/about" className="text-link">
            Get to know NullVibe <ArrowUpRight />
          </Link>
        </div>
      </section>
      <section className="shell section expertise-section">
        <div className="section-heading" data-reveal>
          <div>
            <Eyebrow>OUR EXPERTISE</Eyebrow>
            <h2>
              One partner.
              <br />
              Plenty of possibilities.
            </h2>
          </div>
          <p>
            From your first digital product to the systems
            <br className="desktop-only" /> that support your next stage of
            growth.
          </p>
        </div>
        <div className="service-rows">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Link
                key={s.slug}
                to={"/services/" + s.slug}
                className="service-row"
                data-reveal
              >
                <span className="row-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon size={30} weight="light" />
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <ArrowUpRight className="row-arrow" size={25} />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="dark-section showcase">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <Eyebrow>LESS ABSTRACT. MORE INTERACTIVE.</Eyebrow>
              <h2>
                See the possibilities<span className="red">.</span>
              </h2>
            </div>
            <p>
              Explore working demonstration concepts.
              <br />
              Sample experiences, built to spark ideas.
            </p>
          </div>
          <div className="demo-grid">
            {demos.slice(0, 2).map((d) => (
              <div key={d.slug} data-reveal>
                <DemoCard demo={d} />
              </div>
            ))}
          </div>
          <div className="section-bottom">
            <span>Demonstration projects. No client results implied.</span>
            <Link to="/demos" className="text-link">
              Explore all demos <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="shell section partnership">
        <div data-reveal>
          <Eyebrow>A CLEAR WAY OF WORKING</Eyebrow>
          <h2>
            Good software.
            <br />
            No guesswork.
          </h2>
          <p>
            Know what we’re building, why it matters
            <br />
            and what comes next.
          </p>
          <Link to="/process" className="text-link">
            Our delivery process <ArrowRight />
          </Link>
        </div>
        <div className="value-list">
          {[
            [
              "01",
              "Start with the business",
              "Understand the goals, the people and the problem before choosing the technology.",
            ],
            [
              "02",
              "Make the scope clear",
              "Agree on priorities, deliverables and a proposal that makes the investment understandable.",
            ],
            [
              "03",
              "Build with you",
              "Review progress at meaningful milestones and make informed decisions along the way.",
            ],
            [
              "04",
              "Plan beyond launch",
              "Define handover, support and the next improvements as part of a considered release.",
            ],
          ].map(([n, t, p]) => (
            <div key={n} data-reveal>
              <span>{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="soft-section">
        <div className="shell section faq-section">
          <div data-reveal>
            <Eyebrow>A LITTLE MORE CLARITY</Eyebrow>
            <h2>
              Good questions.
              <br />
              Straight answers.
            </h2>
            <Link to="/faq" className="text-link">
              More about working together <ArrowRight />
            </Link>
          </div>
          <div data-reveal>
            <FAQList items={homeQuestions} />
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
export function Services() {
  return (
    <>
      <PageHero
        label="OUR EXPERTISE"
        title="The right technology. For your next step"
        text="Custom software, considered design and practical AI—connected by one purpose: helping your business move forward."
      />
      <section className="shell services-grid">
        {services.map((s, i) => {
          const Icon = icons[s.icon];
          return (
            <article key={s.slug} className="service-card" data-reveal>
              <div className="service-card-top">
                <Icon size={36} weight="light" />
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <span className="micro-label">{s.category}</span>
              <h2>
                <Link to={"/services/" + s.slug}>{s.title}</Link>
              </h2>
              <p>{s.detail}</p>
              <ul>
                {s.examples.slice(0, 3).map((item) => (
                  <li key={item}>
                    <Check size={15} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to={"/services/" + s.slug} className="text-link">
                Explore this service <ArrowUpRight />
              </Link>
            </article>
          );
        })}
      </section>
      <section className="dark-section">
        <div className="shell split-section">
          <div data-reveal>
            <Eyebrow>VALUE BY DESIGN</Eyebrow>
            <h2>
              Your priorities.
              <br />A practical investment.
            </h2>
          </div>
          <div className="prose" data-reveal>
            <p>
              We help you separate essential features from the ones that can
              wait. That gives your budget a clear purpose and your first
              release a manageable scope.
            </p>
            <p>
              Pricing, timelines, responsibilities and support are agreed in the
              proposal. If the scope changes, we discuss the impact before
              moving ahead.
            </p>
            <Button to="/contact">Talk through your requirements</Button>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
export function ServiceDetail({ slug }) {
  const s = services.find((item) => item.slug === slug);
  if (!s) return <NotFound />;
  const Icon = icons[s.icon];
  return (
    <>
      <PageHero label={s.category} title={s.title} text={s.detail}>
        <div className="actions">
          <Button to={"/contact?service=" + encodeURIComponent(s.title)}>
            Discuss your project
          </Button>
          <Link to="/services" className="text-link">
            All services <ArrowRight />
          </Link>
        </div>
      </PageHero>
      <section className="shell section service-detail-intro">
        <div className="service-feature" data-reveal>
          <Icon size={64} weight="light" />
          <h2>{s.outcome}</h2>
          <p>{s.fit}</p>
        </div>
        <div data-reveal>
          <Eyebrow>WHAT WE CAN BUILD</Eyebrow>
          <ul className="large-list">
            {s.examples.map((v, i) => (
              <li key={v}>
                <span>0{i + 1}</span>
                <h3>{v}</h3>
                <ArrowUpRight size={20} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="soft-section">
        <div className="shell section split-section">
          <div data-reveal>
            <Eyebrow>WHAT TO EXPECT</Eyebrow>
            <h2>
              A clear scope.
              <br />A considered delivery.
            </h2>
            <p>{s.approach}</p>
          </div>
          <div data-reveal>
            <h3 className="list-title">A typical engagement includes</h3>
            <ul className="checklist">
              {s.deliverables.map((d) => (
                <li key={d}>
                  <Check size={19} />
                  {d}
                </li>
              ))}
            </ul>
            <p className="small-print">
              Your exact deliverables, timeline, pricing and support terms are
              defined in your project proposal.
            </p>
            <Link to="/process" className="text-link">
              See how we work <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="shell section related-demo" data-reveal>
        <div>
          <Eyebrow>FROM IDEA TO EXPERIENCE</Eyebrow>
          <h2>Explore a related concept.</h2>
          <p>
            Try a demonstration and imagine what a tailored experience could
            look like for your business.
          </p>
        </div>
        <Button to={"/demos/" + s.related} variant="ink">
          Open interactive demo
        </Button>
      </section>
      <CTA />
    </>
  );
}
