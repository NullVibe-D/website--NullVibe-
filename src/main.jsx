import "@fontsource-variable/manrope";
import "./styles.css";
import "./upgrade.css";
import { enhanceNavigation } from "./navigation.js";

// Published pages already contain their headings, links and navigation.
// Only the form and demo pages receive an additional interactive entry.
if (import.meta.env.DEV && !document.getElementById("root").hasChildNodes()) {
  import("./dev-app.jsx").then(({ renderApp }) => renderApp());
} else {
  enhanceNavigation();
}
