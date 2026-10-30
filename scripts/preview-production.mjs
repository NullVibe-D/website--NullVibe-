// Local production-build preview only. Keeps same-origin checks local while pages use the canonical public domain.
import { createServer } from "../server/index.mjs";
const port = Number(process.env.PREVIEW_PORT || 4175);
const server = createServer({
  env: { ...process.env, PUBLIC_SITE_URL: undefined },
});
server.listen(port, "127.0.0.1", () =>
  console.log(`NullVibe production preview: http://127.0.0.1:${port}`),
);
