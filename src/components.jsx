import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  List,
  X,
  Plus,
  Minus,
  Envelope,
} from "@phosphor-icons/react";
import { contactEmail, services } from "./data.js";

export function Link({ to, children, ...props }) {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
}
export function Button({
  to = "/contact",
  children = "Discuss your project",
  variant = "",
  ...props
}) {
  return (
    <Link to={to} className={"button " + variant} {...props}>
      {children}
      <ArrowUpRight size={19} />
    </Link>
  );
}
export function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <span aria-hidden="true" />
      {children}
    </div>
  );
}
export function Logo() {
  return (
    <Link to="/" className="brand" aria-label="NullVibe home">
      <span className="brand-mark">
        <img
          src="/images/chrome-mark-192.webp"
          alt=""
          width="192"
          height="151"
        />
      </span>
      <span>
        NullVibe<span className="red">.</span>
      </span>
    </Link>
  );
}
function NavLinks({ path }) {
  return [
    ["/services", "Services"],
    ["/process", "Our process"],
    ["/demos", "Demos"],
    ["/about", "Company"],
  ].map(([url, label]) => (
    <Link
      key={url}
      to={url}
      aria-current={
        path === url
          ? "page"
          : path.startsWith(url + "/")
            ? "location"
            : undefined
      }
    >
      {label}
    </Link>
  ));
}

export function Header({ path }) {
  return (
    <header className="site-header">
      <div className="shell nav">
        <Logo />
        <nav className="nav-links primary-nav" aria-label="Main navigation">
          <NavLinks path={path} />
        </nav>
        <div className="desktop-book">
          <Button to="/contact" variant="ink">
            Let’s talk
          </Button>
        </div>
        <details className="mobile-menu">
          <summary className="menu-toggle" aria-controls="navigation">
            <span className="when-closed">
              <List size={24} />
              <span className="sr-only">Open menu</span>
            </span>
            <span className="when-open">
              <X size={24} />
              <span className="sr-only">Close menu</span>
            </span>
          </summary>
          <nav
            id="navigation"
            className="nav-links open"
            aria-label="Main navigation"
          >
            <NavLinks path={path} />
            <Link
              to="/contact"
              aria-current={path === "/contact" ? "page" : undefined}
            >
              Contact
            </Link>
            <Link
              to="/booking"
              className="mobile-book"
              aria-current={path === "/booking" ? "page" : undefined}
            >
              Plan a discovery call <ArrowUpRight />
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>
              Thoughtful software.
              <br />
              Meaningful progress.
            </p>
            <a className="email-link" href={"mailto:" + contactEmail}>
              {contactEmail}
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="footer-group">
            <h2>Explore</h2>
            <Link to="/about">Our company</Link>
            <Link to="/process">Our process</Link>
            <Link to="/demos">Demo projects</Link>
            <Link to="/faq">Common questions</Link>
            <Link to="/insights">Software & AI guides</Link>
          </div>
          <div className="footer-group">
            <h2>Expertise</h2>
            {services.slice(0, 4).map((s) => (
              <Link key={s.slug} to={"/services/" + s.slug}>
                {s.title}
              </Link>
            ))}
          </div>
          <div className="footer-group">
            <h2>Start something</h2>
            <Link to="/contact">Discuss your project</Link>
            <Link to="/booking">Book a discovery call</Link>
            <Link to="/services/support-evolution">Ongoing support</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} NullVibe. All rights reserved.
          </span>
          <span>Designed with care. Built with purpose.</span>
          <a href="#top">
            Back to top <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
export function CTA() {
  return (
    <section className="cta-band">
      <div className="shell cta">
        <div data-reveal>
          <Eyebrow>YOUR NEXT CHAPTER</Eyebrow>
          <h2>
            Let’s build something
            <br />
            that moves you forward<span className="red">.</span>
          </h2>
        </div>
        <div data-reveal>
          <p>
            A new idea. A better way of working.
            <br />A conversation is a good place to start.
          </p>
          <Button to="/contact">Discuss your project</Button>
          <Link className="text-link" to="/booking">
            Prefer a call? <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
export function PageHero({ label, title, text, children }) {
  return (
    <section className="page-hero shell">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{label}</span>
      </div>
      <Eyebrow>{label}</Eyebrow>
      <h1>
        {title.replace(/[.!?]$/, "")}
        <span className="red">
          {/[!?]$/.test(title) ? title.slice(-1) : "."}
        </span>
      </h1>
      <p>{text}</p>
      {children}
    </section>
  );
}
export function FAQList({ items }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={item.q} className="faq-item">
          <summary>
            <span className="faq-number">{String(i + 1).padStart(2, "0")}</span>
            <span>{item.q}</span>
            <Plus className="faq-plus" size={20} />
            <Minus className="faq-minus" size={20} />
          </summary>
          <div className="faq-answer">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
export function NotFound() {
  return (
    <section className="shell page-hero not-found">
      <Eyebrow>404 / A DIFFERENT DIRECTION</Eyebrow>
      <h1>
        Let’s get you
        <br />
        back on track<span className="red">.</span>
      </h1>
      <p>
        That page isn’t here. Explore our services or start a conversation about
        your project.
      </p>
      <div className="actions">
        <Button to="/">Back to home</Button>
        <Link className="text-link" to="/services">
          Explore services <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
