import { Resend } from "resend";

const MAX = {
  name: 100,
  company: 120,
  email: 160,
  phone: 40,
  service: 120,
  location: 160,
  message: 3000
};

const allowedServices = new Set([
  "Residential / Commercial Building",
  "Industrial / Factory Buildings",
  "Power Plant",
  "Communication Towers",
  "Supply / Fabrication of Scaffolding",
  "Roofing Panels & Accessories",
  "Chilled Water Centralized Air-Conditioning",
  "Ducting & Piping System",
  "Machinery Works",
  "Fire Protection System",
  "Electrical System",
  "Low Current System",
  "Solar Energy System",
  "Procurement of Mechanical Equipment & Accessories"
]);

// Best-effort per-instance rate limiting. For multi-instance production deployments,
// put a platform/WAF or shared store rate limit in front of this endpoint.
const requests = globalThis.__mimagContactRequests ??= new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function clean(value, max) {
  return String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
}

function emailOk(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function phoneOk(value) {
  return /^[0-9+().\-\s]{7,40}$/.test(value);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
}

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket?.remoteAddress || "unknown";
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // direct/server-to-server clients may omit Origin
  const host = req.headers.host;
  try {
    const url = new URL(origin);
    return url.host === host;
  } catch {
    return false;
  }
}

function rateLimited(ip) {
  const now = Date.now();
  const prior = requests.get(ip) || [];
  const recent = prior.filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    requests.set(ip, recent);
    return true;
  }
  recent.push(now);
  requests.set(ip, recent);
  if (requests.size > 5000) {
    for (const [key, values] of requests) {
      if (!values.some(t => now - t < WINDOW_MS)) requests.delete(key);
    }
  }
  return false;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!sameOrigin(req)) {
    return res.status(403).json({ message: "Request origin is not allowed." });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return res.status(429).json({ message: "Too many inquiries from this connection. Please try again later." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot: silently reject bots.
  if (clean(body.website, 100)) {
    return res.status(200).json({ ok: true });
  }

  const data = {
    name: clean(body.name, MAX.name),
    company: clean(body.company, MAX.company),
    email: clean(body.email, MAX.email),
    phone: clean(body.phone, MAX.phone),
    service: clean(body.service, MAX.service),
    location: clean(body.location, MAX.location),
    message: clean(body.message, MAX.message)
  };

  if (!data.name || !data.email || !data.phone || !data.service || !data.location || !data.message) {
    return res.status(400).json({ message: "Please complete all required fields." });
  }
  if (!emailOk(data.email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }
  if (!phoneOk(data.phone)) {
    return res.status(400).json({ message: "Please provide a valid phone number." });
  }
  if (!allowedServices.has(data.service)) {
    return res.status(400).json({ message: "Please select a valid service." });
  }
  if (data.message.length < 15) {
    return res.status(400).json({ message: "Please provide more detail about the project." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.FORMS_FROM_EMAIL;

  if (!apiKey || !recipient || !sender) {
    console.error("Missing required email environment variables.");
    return res.status(500).json({ message: "The inquiry service is not configured yet. Please email MIMAG directly." });
  }

  const resend = new Resend(apiKey);
  const submittedAt = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila"
  }).format(new Date());

  const subjectName = data.name.replace(/[\r\n]+/g, " ");
  const subjectCompany = data.company.replace(/[\r\n]+/g, " ");
  const subject = `New Website Inquiry - ${subjectName}${subjectCompany ? ` - ${subjectCompany}` : ""}`.slice(0, 180);

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:720px;margin:auto;color:#17283d">
    <div style="background:#12243b;padding:24px 28px">
      <div style="color:#fff;font-size:22px;font-weight:700;letter-spacing:1px">MIMAG</div>
      <div style="color:#7fd0c8;font-size:11px;letter-spacing:2px;margin-top:4px">CONSTRUCTION & TRADING CORPORATION</div>
    </div>
    <div style="padding:28px;border:1px solid #e0e5ea;border-top:0">
      <h1 style="font-size:24px;margin:0 0 22px">New Website Inquiry</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:10px 0;font-weight:bold;width:180px">Name</td><td style="padding:10px 0">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:10px 0;font-weight:bold">Company</td><td style="padding:10px 0">${escapeHtml(data.company || "Not provided")}</td></tr>
        <tr><td style="padding:10px 0;font-weight:bold">Email</td><td style="padding:10px 0">${escapeHtml(data.email)}</td></tr>
        <tr><td style="padding:10px 0;font-weight:bold">Phone</td><td style="padding:10px 0">${escapeHtml(data.phone)}</td></tr>
        <tr><td style="padding:10px 0;font-weight:bold">Service / Project Type</td><td style="padding:10px 0">${escapeHtml(data.service)}</td></tr>
        <tr><td style="padding:10px 0;font-weight:bold">Project Location</td><td style="padding:10px 0">${escapeHtml(data.location)}</td></tr>
        <tr><td style="padding:10px 0;font-weight:bold;vertical-align:top">Message</td><td style="padding:10px 0;white-space:pre-wrap">${escapeHtml(data.message)}</td></tr>
        <tr><td style="padding:10px 0;font-weight:bold">Submitted</td><td style="padding:10px 0">${escapeHtml(submittedAt)}</td></tr>
      </table>
    </div>
  </div>`;

  try {
    const { error } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: data.email,
      subject,
      html
    });
    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ message: "The email provider could not accept the inquiry. Please email MIMAG directly." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Unexpected email error:", error);
    return res.status(500).json({ message: "The inquiry could not be sent. Please email MIMAG directly." });
  }
}
