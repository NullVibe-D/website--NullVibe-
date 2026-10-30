# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Confirmed company direction (29 October 2026)

White-first professional multi-page company website with charcoal sections, restrained crimson accents, enhanced supplied logo and purposeful lightweight motion. NullVibe offers custom web/mobile applications, business systems, AI/automation, websites/commerce, and ongoing improvement. Emphasize client business growth, fair transparent pricing and clear scope. Only demo projects exist; do not invent clients, metrics, testimonials or results. Public contact is contact@nullvibe.tech; domain is nullvibe.tech. Public hosting is deferred until local production work is complete. Calendar account and email-delivery credentials are not yet supplied; never simulate live success. User authorized local automated browser testing. Current request permits expanding the selected concept into a complete professional site.
