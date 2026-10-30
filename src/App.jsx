import React from "react";
import { Header, Footer, Motion, NotFound } from "./components.jsx";
import { Home, Services, ServiceDetail } from "./MarketingPages.jsx";
import { Demos, DemoDetail } from "./Demos.jsx";
import { About, Process, Privacy, FAQ } from "./CompanyPages.jsx";
import { Contact, Booking } from "./ContactPages.jsx";
import { getPageMeta } from "./data.js";

export function App({ path = "/" }) {
  const normalized = path.replace(/\/$/, "") || "/";
  const pages = {
    "/": <Home />,
    "/services": <Services />,
    "/process": <Process />,
    "/demos": <Demos />,
    "/about": <About />,
    "/faq": <FAQ />,
    "/contact": <Contact />,
    "/booking": <Booking />,
    "/privacy": <Privacy />,
  };
  let content = pages[normalized];
  if (!content && normalized.startsWith("/services/"))
    content = <ServiceDetail slug={normalized.split("/")[2]} />;
  if (!content && normalized.startsWith("/demos/"))
    content = <DemoDetail slug={normalized.split("/")[2]} />;
  if (getPageMeta(normalized).notFound) content = <NotFound />;
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Header path={normalized} />
      <main id="main">{content || <NotFound />}</main>
      <Footer />
      <Motion />
    </>
  );
}
