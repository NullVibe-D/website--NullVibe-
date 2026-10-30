import React, { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ShoppingBag,
  Sparkle,
  Check,
  Plus,
  Minus,
} from "@phosphor-icons/react";
import { Link, PageHero, Eyebrow, CTA, NotFound } from "./components.jsx";
import { demos } from "./data.js";
function Preview({ kind }) {
  if (kind === "booking")
    return (
      <div className="product-preview" aria-hidden="true">
        <div className="preview-top">
          <strong>
            meetwell<span className="red">.</span>
          </strong>
          <span>Overview / Schedule</span>
          <i>MW</i>
        </div>
        <div className="preview-main">
          <div className="preview-side">
            Overview
            <br />
            <b>Schedule</b>
            <br />
            Customers
            <br />
            Services
          </div>
          <div className="preview-content">
            <small>YOUR WORKDAY, SIMPLIFIED</small>
            <h3>A little more organised.</h3>
            <div className="days">
              {["MON", "TUE", "WED", "THU", "FRI"].map((d, i) => (
                <span key={d} className={i === 2 ? "selected" : ""}>
                  {d}
                  <b>{12 + i}</b>
                </span>
              ))}
            </div>
            {[
              ["09:00", "Discovery session"],
              ["11:30", "Product consultation"],
            ].map(([t, n]) => (
              <div className="appointment" key={t}>
                <span>{t}</span>
                <div>
                  <strong>{n}</strong>
                  <small>30 minutes · Online</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  if (kind === "commerce")
    return (
      <div className="product-preview" aria-hidden="true">
        <div className="preview-top">
          <strong>forma</strong>
          <span>Objects for the everyday.</span>
          <ShoppingBag size={18} />
        </div>
        <div className="store-preview">
          <small>THE EVERYDAY COLLECTION</small>
          <h3>
            Less, but
            <br />
            better.
          </h3>
          <p>
            Considered essentials.
            <br />
            Made for your everyday.
          </p>
          <div className="store-product">
            <ShoppingBag weight="duotone" size={100} />
            <span>
              Studio tote
              <br />
              <b>$48.00</b>
            </span>
          </div>
          <span className="mini-cta">
            Explore the collection <ArrowRight />
          </span>
        </div>
      </div>
    );
  return (
    <div className="product-preview" aria-hidden="true">
      <div className="preview-top">
        <strong>
          assist<span className="red">.</span>
        </strong>
        <span>Customer support</span>
        <Sparkle size={18} />
      </div>
      <div className="chat-preview">
        <span className="chat-bubble">Can I change my appointment?</span>
        <span className="chat-bubble reply">
          Of course. I can help you find another time, or connect you with the
          team.
        </span>
        <span className="chat-chip">
          Find another time <ArrowRight />
        </span>
        <small>Helpful answers. Human backup.</small>
      </div>
    </div>
  );
}
export function DemoCard({ demo }) {
  return (
    <article className="demo-card">
      <Link
        to={"/demos/" + demo.slug}
        className="preview-link"
        aria-label={"Explore " + demo.name + " demo"}
      >
        <Preview kind={demo.slug} />
      </Link>
      <div className="demo-caption">
        <div>
          <small>{demo.category}</small>
          <h3>
            <Link to={"/demos/" + demo.slug}>{demo.title}</Link>
          </h3>
          <p>{demo.text}</p>
        </div>
        <Link
          to={"/demos/" + demo.slug}
          className="round-link"
          aria-label={"Open " + demo.name + " demo"}
        >
          <ArrowUpRight size={24} />
        </Link>
      </div>
      <span className="demo-label">Demo concept</span>
    </article>
  );
}
export function Demos() {
  const [filter, setFilter] = useState("all");
  return (
    <>
      <PageHero
        label="EXPLORE THE POSSIBILITIES"
        title="Ideas you can experience"
        text="Try a few ways software can make everyday business better. These are demonstration concepts, not client projects."
      />
      <section className="shell demo-list">
        <div className="filters" aria-label="Filter demos">
          {[
            ["all", "All concepts"],
            ["booking", "Operations"],
            ["commerce", "Commerce"],
            ["assistant", "AI & automation"],
          ].map(([v, t]) => (
            <button
              key={v}
              aria-pressed={filter === v}
              onClick={() => setFilter(v)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="demo-grid">
          {demos
            .filter((d) => filter === "all" || d.slug === filter)
            .map((d) => (
              <DemoCard demo={d} key={d.slug} />
            ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
function BookingDemo() {
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="interactive-demo">
      <h2>
        meetwell<span className="red">.</span>
      </h2>
      <p>Try scheduling a sample product consultation.</p>
      {done ? (
        <div className="demo-success" role="status">
          <Check size={36} />
          <h3>Demo appointment selected</h3>
          <p>
            {day} at {time}. This is a simulation; no real booking was made.
          </p>
          <button
            className="button secondary"
            onClick={() => {
              setDone(false);
              setTime("");
            }}
          >
            Try another time
          </button>
        </div>
      ) : (
        <>
          <h3>1. Choose a sample day</h3>
          <div className="day-picker">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (d) => (
                <button
                  key={d}
                  aria-pressed={day === d}
                  onClick={() => {
                    setDay(d);
                    setTime("");
                  }}
                >
                  {d}
                </button>
              ),
            )}
          </div>
          <h3>2. Choose a time</h3>
          <div className="time-picker">
            {["09:00", "10:30", "13:00", "14:30"].map((t) => (
              <button
                key={t}
                aria-pressed={time === t}
                onClick={() => setTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            className="button"
            disabled={!time}
            onClick={() => setDone(true)}
          >
            Confirm demo appointment <ArrowRight />
          </button>
        </>
      )}
    </div>
  );
}
function CommerceDemo() {
  const [cart, setCart] = useState([0, 0, 0]);
  const [done, setDone] = useState(false);
  const products = [
    ["Studio tote", 48],
    ["Everyday notebook", 18],
    ["Desk organiser", 32],
  ];
  return (
    <div className="interactive-demo">
      <div className="demo-app-heading">
        <h2>forma</h2>
        <span>
          <ShoppingBag />
          {cart.reduce((a, b) => a + b, 0)} items
        </span>
      </div>
      <p>Everyday essentials. Sample products and USD prices.</p>
      <div className="sample-products">
        {products.map(([name, price], i) => (
          <div key={name}>
            <ShoppingBag size={46} weight="light" />
            <h3>{name}</h3>
            <p>${price.toFixed(2)}</p>
            <div className="quantity">
              <button
                aria-label={"Remove " + name}
                disabled={!cart[i]}
                onClick={() => {
                  setDone(false);
                  setCart(cart.map((v, j) => (j === i ? v - 1 : v)));
                }}
              >
                <Minus />
              </button>
              <span aria-live="polite">{cart[i]}</span>
              <button
                aria-label={"Add " + name}
                onClick={() => {
                  setDone(false);
                  setCart(cart.map((v, j) => (j === i ? v + 1 : v)));
                }}
              >
                <Plus />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <strong>
          Total $
          {cart.reduce((sum, n, i) => sum + n * products[i][1], 0).toFixed(2)}
        </strong>
        <button
          className="button"
          disabled={!cart.some(Boolean)}
          onClick={() => setDone(true)}
        >
          Try demo checkout <ArrowRight />
        </button>
      </div>
      {done && (
        <p className="demo-success" role="status">
          Your demo bag is ready. No payment was requested and no order was
          placed.
        </p>
      )}
    </div>
  );
}
function AssistantDemo() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! Try asking about bookings, pricing or speaking to the team.",
    },
  ]);
  const [input, setInput] = useState("");
  function send(value) {
    const q = value.trim();
    if (!q) return;
    const answer = /book|appointment|schedule/i.test(q)
      ? "You can choose a service, day and available time in the booking demo. For changes to a real appointment, the business team would help."
      : /price|cost|budget/i.test(q)
        ? "Pricing depends on the service and scope. A real assistant could look up an approved price list or pass your enquiry to the team."
        : /human|team|person/i.test(q)
          ? "This is where a live integration would hand your conversation to a team member. No message has been sent in this demo."
          : "In a connected product, I would search approved business information or ask a team member. Try asking about bookings or pricing.";
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      { role: "assistant", text: answer },
    ]);
    setInput("");
  }
  return (
    <div className="interactive-demo">
      <h2>
        assist<span className="red">.</span>
      </h2>
      <p>Scripted demonstration · Not connected to a live AI service</p>
      <div className="demo-chat" role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={"message " + m.role}>
            <small>{m.role === "user" ? "YOU" : "ASSIST"}</small>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <div className="suggestions">
        {["How do I book?", "What does it cost?", "Speak to the team"].map(
          (q) => (
            <button key={q} onClick={() => send(q)}>
              {q}
            </button>
          ),
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="chat-input"
      >
        <label className="sr-only" htmlFor="chat">
          Your message
        </label>
        <input
          id="chat"
          value={input}
          maxLength={500}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a sample question…"
        />
        <button
          className="button"
          disabled={!input.trim()}
          aria-label="Send sample message"
        >
          <ArrowRight />
        </button>
      </form>
    </div>
  );
}
export function DemoDetail({ slug }) {
  const demo = demos.find((d) => d.slug === slug);
  if (!demo) return <NotFound />;
  return (
    <>
      <section className="shell demo-detail">
        <Link to="/demos" className="text-link">
          <ArrowLeft />
          All demos
        </Link>
        <div className="demo-detail-heading">
          <div>
            <Eyebrow>INTERACTIVE DEMO CONCEPT</Eyebrow>
            <h1>
              {demo.title}
              <span className="red">.</span>
            </h1>
            <p>{demo.text}</p>
          </div>
          <span className="demo-label">Sample data · No live transactions</span>
        </div>
        {slug === "booking" ? (
          <BookingDemo />
        ) : slug === "commerce" ? (
          <CommerceDemo />
        ) : (
          <AssistantDemo />
        )}
        <p className="demo-disclaimer">
          This concept illustrates a possible experience. Production delivery
          would include requirements discovery, security, integrations and
          testing appropriate to your business.
        </p>
      </section>
      <CTA />
    </>
  );
}
