const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const localhostNames = new Set(["localhost", "127.0.0.1", "[::1]"]);

export class RequestError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function publicOrigin(value) {
  if (!value) return null;
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    (url.protocol === "http:" && !localhostNames.has(url.hostname))
  ) {
    throw new Error(
      "PUBLIC_SITE_URL must be an HTTPS origin, or HTTP localhost for development.",
    );
  }
  return url.origin;
}

function validateContact(input) {
  if (!input || Array.isArray(input) || typeof input !== "object")
    throw new RequestError(400, "Please submit a valid project enquiry.");
  const errors = {};
  const values = {};
  for (const [field, min, max] of [
    ["name", 2, 100],
    ["email", 3, 254],
    ["company", 0, 150],
    ["service", 0, 100],
    ["budget", 0, 100],
    ["message", 15, 5000],
  ]) {
    const raw = input[field] ?? "";
    const value = typeof raw === "string" ? raw.trim() : "";
    values[field] = value;
    if (
      typeof raw !== "string" ||
      value.length < min ||
      value.length > max ||
      (field !== "message" && /[\x00-\x1f\x7f]/.test(value))
    ) {
      errors[field] = min
        ? `Use ${min}–${max} characters for ${field}.`
        : `Use no more than ${max} characters for ${field}.`;
    }
  }
  if (!emailPattern.test(values.email))
    errors.email = "Enter a valid email address.";
  if (input.consent !== true)
    errors.consent = "Please agree that we may contact you about this enquiry.";
  if (Object.keys(errors).length)
    throw new RequestError(
      422,
      "Please check the highlighted details.",
      errors,
    );
  if (
    input.website != null &&
    (typeof input.website !== "string" || input.website.trim())
  )
    throw new RequestError(
      422,
      "This enquiry could not be submitted. Please try again.",
    );
  return values;
}

export function readJson(request, headers, limit) {
  if (!/^application\/json(?:\s*;|$)/i.test(headers["content-type"] || ""))
    throw new RequestError(415, "Use JSON to submit your enquiry.");
  if (headers["content-encoding"] && headers["content-encoding"] !== "identity")
    throw new RequestError(415, "Compressed request bodies are not supported.");
  if (Number(headers["content-length"]) > limit)
    throw new RequestError(
      413,
      "Your enquiry is too large. Please shorten it and try again.",
    );
  return new Promise((resolveBody, reject) => {
    let size = 0;
    const chunks = [];
    function cleanup() {
      request.off("data", data);
      request.off("end", end);
      request.off("aborted", aborted);
      request.off("error", failed);
    }
    function failed(error) {
      cleanup();
      reject(error);
    }
    function aborted() {
      failed(
        new RequestError(400, "The enquiry was interrupted. Please try again."),
      );
    }
    function data(chunk) {
      size += chunk.length;
      if (size > limit) {
        failed(
          new RequestError(
            413,
            "Your enquiry is too large. Please shorten it and try again.",
          ),
        );
        request.resume();
      } else chunks.push(chunk);
    }
    function end() {
      cleanup();
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new RequestError(400, "Please submit valid JSON."));
      }
    }
    request.on("data", data);
    request.once("end", end);
    request.once("aborted", aborted);
    request.once("error", failed);
  });
}

function originAllowed(headers, configuredOrigin) {
  try {
    const origin = new URL(headers.origin);
    if (origin.origin !== headers.origin) return false;
    if (headers["sec-fetch-site"] === "cross-site") return false;
    if (configuredOrigin) return origin.origin === configuredOrigin;
    return (
      localhostNames.has(origin.hostname) &&
      origin.protocol === "http:" &&
      origin.host === headers.host
    );
  } catch {
    return false;
  }
}

/** Both hosting adapters use the same limits, validation and provider acceptance rules. */
export function createContactApi({
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = Date.now,
  rateLimitMax = 5,
  rateLimitWindowMs = 15 * 60 * 1000,
  maxBodyBytes = 20 * 1024,
  deliveryTimeoutMs = 10000,
} = {}) {
  const configuredOrigin = publicOrigin(env.PUBLIC_SITE_URL);
  const contactConfigured = Boolean(
    env.RESEND_API_KEY?.trim() &&
    emailPattern.test(env.CONTACT_TO_EMAIL || "") &&
    emailPattern.test(env.CONTACT_FROM_EMAIL || ""),
  );
  const attempts = new Map();
  return async ({ pathname, method, headers, address, readBody }) => {
    const extra = {};
    function reply(status, payload) {
      return {
        status,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json; charset=utf-8",
          ...extra,
        },
        payload,
      };
    }
    try {
      if (pathname === "/api/health") {
        if (!["GET", "HEAD"].includes(method)) {
          extra.Allow = "GET, HEAD";
          throw new RequestError(405, "Method not allowed.");
        }
        return reply(200, { status: "ok", contactConfigured });
      }
      if (pathname === "/api/contact") {
        if (method !== "POST") {
          extra.Allow = "POST";
          throw new RequestError(405, "Method not allowed.");
        }
        if (!originAllowed(headers, configuredOrigin))
          throw new RequestError(
            403,
            "Please submit your enquiry from the NullVibe website.",
          );
        const time = now();
        for (const [address, entry] of attempts)
          if (entry.resetAt <= time) attempts.delete(address);
        const entry = attempts.get(address) || {
          count: 0,
          resetAt: time + rateLimitWindowMs,
        };
        if (
          entry.count >= rateLimitMax ||
          (!attempts.has(address) && attempts.size >= 10000)
        ) {
          extra["Retry-After"] = String(
            Math.max(1, Math.ceil((entry.resetAt - time) / 1000)),
          );
          throw new RequestError(
            429,
            "You have sent several enquiries recently. Please wait a little before trying again.",
          );
        }
        entry.count += 1;
        attempts.set(address, entry);
        const values = validateContact(await readBody(maxBodyBytes));
        if (!contactConfigured)
          throw new RequestError(
            503,
            "Online enquiry delivery is not connected yet. Your message has not been sent. Please use the contact alternatives on this page.",
          );
        const text = [
          "New NullVibe project enquiry",
          "",
          `Name: ${values.name}`,
          `Email: ${values.email}`,
          `Company: ${values.company || "Not specified"}`,
          `Service: ${values.service || "Not specified"}`,
          `Budget: ${values.budget || "Not specified"}`,
          "",
          "Project:",
          values.message,
          "",
          "Permission: The sender agreed to be contacted about this enquiry.",
        ].join("\n");
        try {
          const delivered = await fetchImpl("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: env.CONTACT_FROM_EMAIL,
              to: [env.CONTACT_TO_EMAIL],
              reply_to: values.email,
              subject: "New project enquiry | NullVibe",
              text,
            }),
            signal: AbortSignal.timeout(deliveryTimeoutMs),
          });
          if (!delivered.ok) {
            await delivered.body?.cancel();
            throw new Error("Email provider declined the message.");
          }
          const receipt = await delivered.json();
          if (typeof receipt.id !== "string" || !receipt.id)
            throw new Error("Email provider returned no delivery receipt.");
        } catch {
          throw new RequestError(
            502,
            "We could not confirm delivery right now. Your details are still available on this page; please try again later or use an alternative contact option.",
          );
        }
        return reply(200, {
          ok: true,
          message:
            "Your enquiry has been accepted for delivery. Thank you for sharing your project.",
        });
      }

      throw new RequestError(404, "Endpoint not found.");
    } catch (err) {
      if (!(err instanceof RequestError))
        return reply(500, {
          ok: false,
          message: "Something went wrong. Please try again later.",
        });
      return reply(err.status, {
        ok: false,
        message: err.message,
        ...(err.errors ? { errors: err.errors } : {}),
      });
    }
  };
}
