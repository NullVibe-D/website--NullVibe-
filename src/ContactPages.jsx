import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarBlank,
  Check,
  DownloadSimple,
  Envelope,
  WarningCircle,
} from "@phosphor-icons/react";
import { Link, PageHero, Eyebrow, Button } from "./components.jsx";
import { services, contactEmail, bookingUrl } from "./data.js";
const budgets = [
  "Let’s discuss",
  "Under $2,500 USD",
  "$2,500–$10,000 USD",
  "$10,000–$25,000 USD",
  "$25,000+ USD",
];
export function Contact() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    service: "Not sure yet",
    budget: "Let’s discuss",
    message: "",
    website: "",
    consent: false,
  });
  const [state, setState] = useState("idle");
  const [notice, setNotice] = useState("");
  const [configured, setConfigured] = useState(null);
  const statusRef = useRef(null);
  useEffect(() => {
    const requested = new URLSearchParams(location.search).get("service");
    if (services.some((s) => s.title === requested))
      setValues((v) => ({ ...v, service: requested }));
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setConfigured(d?.contactConfigured === true))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (state === "success" || state === "error") statusRef.current?.focus();
  }, [state]);
  const field = (name) => ({
    name,
    value: values[name],
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });
  function brief() {
    return `NullVibe project enquiry\n\nName: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company || "Not specified"}\nService: ${values.service}\nBudget: ${values.budget}\n\nProject:\n${values.message}`;
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([brief()], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "nullvibe-project-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function submit(e) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setNotice("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok)
        throw new Error(
          response.status === 503
            ? "Online delivery is not connected yet. Your enquiry has not been sent. You can email us directly or download your brief below."
            : response.status === 429
              ? "Please wait a few minutes before trying again. You can also email us directly."
              : result?.errors
                ? Object.values(result.errors).join(" ")
                : result?.message ||
                "We couldn’t send your enquiry. Your details are still here; please try again or email us directly.",
        );
      setState("success");
      setNotice(
        "Your enquiry has been sent. We’ll review your project details and reply by email.",
      );
    } catch (error) {
      setState("error");
      setNotice(
        error.name === "TimeoutError"
          ? "The request timed out. Delivery could not be confirmed; please email us if you need to check."
          : error.message ||
              "Unable to connect. Please try again or email us directly.",
      );
    }
  }
  return (
    <>
      <PageHero
        label="START A CONVERSATION"
        title="What’s your next move?"
        text="Tell us about your business, what you want to build and the difference you want it to make."
      />
      <section className="shell contact-layout">
        <aside>
          <Eyebrow>LET’S MAKE IT CLEAR</Eyebrow>
          <h2>
            Good conversations.
            <br />
            Better starting points.
          </h2>
          <p>
            You don’t need a finished specification. A challenge, an idea or a
            direction is enough to start.
          </p>
          <a href={"mailto:" + contactEmail} className="contact-email">
            <Envelope size={22} />
            <span>{contactEmail}</span>
            <ArrowUpRight size={18} />
          </a>
          <div className="contact-note">
            <h3>What happens next?</h3>
            <ol>
              <li>We review your goals and requirements.</li>
              <li>We discuss the scope and any open questions.</li>
              <li>We outline a practical next step.</li>
            </ol>
            <Link to="/process" className="text-link">
              How we work <ArrowRight />
            </Link>
          </div>
          <div className="contact-note">
            <CalendarBlank size={24} />
            <h3>Prefer a conversation?</h3>
            <Link to="/booking" className="text-link">
              Plan a discovery call <ArrowUpRight />
            </Link>
          </div>
        </aside>
        <div className="form-panel">
          {state === "success" ? (
            <div
              className="success-panel"
              role="status"
              ref={statusRef}
              tabIndex={-1}
            >
              <Check size={40} />
              <Eyebrow>MESSAGE RECEIVED</Eyebrow>
              <h2>
                Thank you for
                <br />
                starting the conversation.
              </h2>
              <p>{notice}</p>
              <button className="button secondary" onClick={download}>
                Save your brief <DownloadSimple />
              </button>
              <Link to="/services" className="text-link">
                Explore our services <ArrowRight />
              </Link>
            </div>
          ) : (
            <form method="post" action="/api/contact" onSubmit={submit}>
              <noscript>
                <p className="form-notice">
                  Online form submission requires JavaScript. Please email
                  contact@nullvibe.tech to discuss your project.
                </p>
              </noscript>
              <div className="form-intro">
                <h2>A little about your project.</h2>
                <p>Fields marked * are required.</p>
              </div>
              <div className="form-row">
                <label htmlFor="name">
                  Your name <span>*</span>
                  <input
                    id="name"
                    {...field("name")}
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Alex Taylor"
                  />
                </label>
                <label htmlFor="email">
                  Email address <span>*</span>
                  <input
                    id="email"
                    {...field("email")}
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="alex@company.com"
                  />
                </label>
              </div>
              <label htmlFor="company">
                Company <span className="optional">Optional</span>
                <input
                  id="company"
                  {...field("company")}
                  autoComplete="organization"
                  maxLength={150}
                  placeholder="Your company"
                />
              </label>
              <div className="form-row">
                <label htmlFor="service">
                  What can we help with?
                  <select id="service" {...field("service")}>
                    {["Not sure yet", ...services.map((s) => s.title)].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                </label>
                <label htmlFor="budget">
                  Approximate budget
                  <select id="budget" {...field("budget")}>
                    {budgets.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label htmlFor="message">
                Tell us about your project <span>*</span>
                <textarea
                  id="message"
                  {...field("message")}
                  required
                  minLength={15}
                  maxLength={5000}
                  rows={5}
                  placeholder="What would you like to build or improve? Who is it for?"
                />
              </label>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Leave this blank
                  <input
                    {...field("website")}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>
              <label className="consent">
                <input
                  type="checkbox"
                  checked={values.consent}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, consent: e.target.checked }))
                  }
                  required
                />
                <span>
                  I agree to NullVibe using these details to respond to my
                  enquiry. <Link to="/privacy">Privacy details</Link>.
                </span>
              </label>
              {state === "error" && (
                <div
                  className="form-status error"
                  role="alert"
                  tabIndex={-1}
                  ref={statusRef}
                >
                  <WarningCircle size={21} />
                  <p>{notice}</p>
                </div>
              )}
              {configured === false && state !== "error" && (
                <p className="form-notice">
                  Online delivery is being connected. You can email{" "}
                  <a href={"mailto:" + contactEmail}>{contactEmail}</a>{" "}
                  directly, or prepare and save a brief here.
                </p>
              )}
              <div className="form-actions">
                <button
                  className="button"
                  type="submit"
                  disabled={state === "sending"}
                >
                  {state === "sending"
                    ? "Sending your enquiry…"
                    : "Send project enquiry"}
                  <ArrowUpRight />
                </button>
                <button
                  className="download-link"
                  type="button"
                  onClick={download}
                >
                  <DownloadSimple />
                  Save brief
                </button>
              </div>
              {state === "error" && (
                <a
                  className="text-link"
                  href={`mailto:${contactEmail}?subject=Project%20enquiry&body=${encodeURIComponent(brief())}`}
                >
                  Open enquiry in your email app <ArrowUpRight />
                </a>
              )}
              <p className="form-footnote">
                Your enquiry starts a conversation. There’s no commitment to a
                project.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
export function Booking() {
  let valid = false;
  try {
    valid = new URL(bookingUrl).protocol === "https:";
  } catch {}
  return (
    <>
      <PageHero
        label="A CONVERSATION WITH PURPOSE"
        title="Let’s find your starting point"
        text="A focused conversation about your business, what you want to achieve and how software could help."
      />
      <section className="shell booking-layout">
        <div data-reveal>
          <Eyebrow>DISCOVERY CALL</Eyebrow>
          <h2>
            A little clarity
            <br />
            goes a long way.
          </h2>
          <p>
            Come with a problem, an idea or a question. We’ll help turn it into
            a clearer direction.
          </p>
          <ul className="checklist">
            {[
              "Your business and the challenge",
              "The people who will use your software",
              "Your priorities, timing and budget",
              "A practical next step",
            ].map((t) => (
              <li key={t}>
                <Check size={18} />
                {t}
              </li>
            ))}
          </ul>
          <div className="small-print">
            Prefer to write it down?{" "}
            <Link to="/contact">Send us your project details.</Link>
          </div>
        </div>
        <div className="calendar-panel" data-reveal>
          <CalendarBlank size={42} weight="light" />
          <span className="micro-label">LET’S TALK ABOUT YOUR PROJECT</span>
          <h2>
            {valid
              ? "Choose a time that works for you."
              : "Arrange a discovery call."}
          </h2>
          <p>
            {valid
              ? "See available times in your timezone and confirm your call through our scheduling provider."
              : "Email us with a little about your project, your timezone and a few times that suit you. We’ll arrange a call together."}
          </p>
          {valid ? (
            <a
              className="button"
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open booking calendar <ArrowUpRight />
            </a>
          ) : (
            <a
              className="button"
              href={`mailto:${contactEmail}?subject=Discovery%20call%20request&body=${encodeURIComponent("Hi NullVibe,\n\nI would like to discuss:\n\nMy timezone:\nA few suitable times:\n\nThank you.")}`}
            >
              Request a call by email <ArrowUpRight />
            </a>
          )}
          <small>
            {valid
              ? "Opens our scheduling provider in a new tab."
              : "Your call is confirmed when we agree on a time by email."}
          </small>
          <Link to="/contact" className="text-link">
            Or share your project brief <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
