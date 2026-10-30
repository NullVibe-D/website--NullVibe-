import React, { useEffect, useRef, useState } from "react";
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
        <img src="/images/logo-mark.webp" alt="" width="44" height="36" />
      </span>
      <span>
        NullVibe<span className="red">.</span>
      </span>
    </Link>
  );
}
export function Header({ path }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  useEffect(() => {
    const escape = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", escape);
    const mq = matchMedia("(min-width: 901px)");
    const close = () => setOpen(false);
    mq.addEventListener("change", close);
    return () => {
      window.removeEventListener("keydown", escape);
      mq.removeEventListener("change", close);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="shell nav">
        <Logo />
        <nav
          id="navigation"
          aria-label="Main navigation"
          className={"nav-links " + (open ? "open" : "")}
        >
          {[
            ["/services", "Services"],
            ["/process", "Our process"],
            ["/demos", "Demos"],
            ["/about", "Company"],
          ].map(([url, label]) => (
            <Link
              key={url}
              to={url}
              aria-current={
                path === url || path.startsWith(url + "/") ? "page" : undefined
              }
            >
              {label}
            </Link>
          ))}
          <Link to="/contact" className="mobile-contact">
            Contact
          </Link>
          <Link to="/booking" className="mobile-book">
            Book a discovery call <ArrowUpRight />
          </Link>
        </nav>
        <div className="desktop-book">
          <Button to="/contact" variant="ink">
            Let’s talk
          </Button>
        </div>
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
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
        {title.replace(/[.!]$/, "")}
        <span className="red">.</span>
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
export function Motion() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const nodes = [...document.querySelectorAll("[data-reveal]")];
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top > innerHeight) {
        node.classList.add("will-reveal");
        obs.observe(node);
      }
    });
    const showAll = () => {
      if (reduce.matches) nodes.forEach((n) => n.classList.add("is-visible"));
    };
    reduce.addEventListener("change", showAll);
    return () => {
      obs.disconnect();
      reduce.removeEventListener("change", showAll);
    };
  }, []);
  return null;
}

