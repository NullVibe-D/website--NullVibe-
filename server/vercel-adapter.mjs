import { Readable } from "node:stream";
import { isIP } from "node:net";
import { createContactApi, readJson } from "./contact-api.mjs";

export function createVercelEndpoint(
  pathname,
  { env = process.env, ...options } = {},
) {
  const preview = env.VERCEL_ENV === "preview";
  const api = createContactApi({
    ...options,
    env: {
      ...env,
      PUBLIC_SITE_URL:
        preview && env.VERCEL_URL
          ? "https://" + env.VERCEL_URL
          : env.PUBLIC_SITE_URL || "https://nullvibe.tech",
      // A review deployment may show the form, but must not forward test leads.
      RESEND_API_KEY: preview ? "" : env.RESEND_API_KEY,
    },
  });
  return {
    async fetch(request) {
      const headers = Object.fromEntries(request.headers);
      const ip = headers["x-vercel-forwarded-for"]?.trim();
      const result = await api({
        pathname,
        method: request.method,
        headers,
        address: ip && isIP(ip) ? ip : "unknown",
        readBody: (limit) =>
          readJson(
            request.body ? Readable.fromWeb(request.body) : Readable.from([]),
            headers,
            limit,
          ),
      });
      return new Response(
        request.method === "HEAD" ? null : JSON.stringify(result.payload),
        { status: result.status, headers: result.headers },
      );
    },
  };
}
