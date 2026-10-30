const required = [
  "PUBLIC_SITE_URL",
  "VITE_CONTACT_EMAIL",
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "CONTACT_FROM_EMAIL",
];
const missing = required.filter((key) => !process.env[key]);
console.log("Launch configuration check");
for (const key of required)
  console.log(`${process.env[key] ? "READY" : "MISSING"} ${key}`);
console.log(
  `${process.env.VITE_BOOKING_URL ? "READY" : "OPTIONAL — email call requests are available"} VITE_BOOKING_URL`,
);
console.log(
  "This check does not verify domain ownership, email sender verification or deployment.",
);
if (missing.length) {
  console.error(
    "Launch is not fully configured. Add missing values securely before publishing.",
  );
  process.exitCode = 1;
}
