import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "@fontsource-variable/manrope";
import "./styles.css";
import { getPageMeta } from "./data.js";
const path = window.location.pathname.replace(/\/$/, "") || "/";
const node = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App path={path} />
  </React.StrictMode>
);
if (node.hasChildNodes()) hydrateRoot(node, app);
else createRoot(node).render(app);
const meta = getPageMeta(path);
document.title = meta.title + " | NullVibe";
document
  .querySelector('meta[name="description"]')
  ?.setAttribute("content", meta.description);
import "./upgrade.css";
