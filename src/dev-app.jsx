import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { getPageMeta } from "./data.js";
import { enhanceNavigation } from "./navigation.js";
function DevApp({ path }) {
  React.useEffect(enhanceNavigation, []);
  return <App path={path} />;
}
export function renderApp() {
  const path = location.pathname.replace(/\/$/, "") || "/";
  createRoot(document.getElementById("root")).render(<DevApp path={path} />);
  document.title = path === "/" ? "NullVibe | Custom Software Development Studio" : getPageMeta(path).title + " | NullVibe";
}
