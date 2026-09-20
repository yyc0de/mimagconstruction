# MIMAG Construction & Trading Corporation Website

A lightweight, production-oriented corporate website built with a single HTML frontend and a small Vercel serverless endpoint for secure email delivery through Resend.

## Content approach

The website uses the latest approved MIMAG content and imagery supplied for this build. It avoids invented clients, testimonials, awards, certifications, statistics, social links, and project facts.

## Project structure

```text
mimag-website/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── site-data.js
│   ├── project-gallery-data.js
│   └── main.js
├── scripts/
│   └── build-project-galleries.mjs
├── favicon/
│   ├── favicon-32.png
│   ├── favicon-192.png
│   ├── favicon-512.png
│   └── apple-touch-icon.png
├── api/
│   └── contact.js
├── assets/
│   ├── logo.png
│   └── images/
│       ├── hero-project.png
│       ├── crane.png
│       ├── power-plant.png
│       ├── warehouse.png
│       ├── fire-protection.png
│       ├── solar-energy.png
│       ├── equipment.png
│       ├── industrial-team.png
│       ├── warehouse-interior-1.png
│       ├── warehouse-interior-2.png
│       ├── warehouse-interior-3.png
│       ├── warehouse-interior-4.png
│       ├── president.png
│       ├── training-event.png
│       └── engineering-training.png
├── package.json
└── README.md
```

## Run locally

1. Install Node.js 18+.
2. Open a terminal in the project directory.
3. Run:

```bash
npm install
```

For a static visual preview, open `index.html` in a browser. The contact form will not send email without the `/api/contact` serverless endpoint.

For a full local serverless test, use Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

Then open the local URL printed by Vercel.

## Email setup with Resend

1. Create a Resend account.
2. Create an API key.
3. Add and verify the sending domain you control.
4. Create a sender address on that verified domain, for example `website@yourdomain.com`.
5. In Vercel Project Settings → Environment Variables, add:

```text
RESEND_API_KEY=your_secret_key_here
CONTACT_EMAIL=mimag.gencon@gmail.com
FORMS_FROM_EMAIL=website@your-verified-domain.com
```

Do not put `RESEND_API_KEY` in `index.html` or browser JavaScript.

For initial testing, follow Resend's current sender/domain requirements. A production deployment should use a verified domain rather than relying on a temporary/test sender.

## Vercel deployment

1. Create a new Vercel project.
2. Upload or connect this project.
3. Make sure `index.html`, `api/contact.js`, `package.json`, and `assets/` are at the project root.
4. Add the three environment variables above.
5. Deploy.
6. Open the deployed site and submit a test inquiry.
7. Confirm the message arrives at `CONTACT_EMAIL`.
8. Confirm the reply-to address is the submitted visitor email.

## Domain configuration

Point your domain to Vercel using the DNS records Vercel provides for your project.

After the domain is connected:

- Update the canonical URL in `index.html`.
- Update `og:url`.
- Update `og:image` if you want a fully qualified production image URL.
- Verify that the HTTPS version is working.
- For Resend, separately verify the sending domain and publish the DNS records Resend provides.

## Netlify

The frontend can be deployed as static files on Netlify. The `/api/contact.js` implementation is written for Vercel's serverless function convention, so for Netlify either:
- adapt the function to `netlify/functions/contact.js` and update the frontend endpoint, or
- keep the Vercel deployment for the simplest setup.

## Security notes

Implemented in the supplied code:

- Client-side required-field validation.
- Email and phone validation.
- Server-side validation.
- Input length limits.
- Control-character removal.
- HTML escaping before email rendering.
- Honeypot anti-spam field.
- Same-origin check where an Origin header is present.
- Best-effort per-instance rate limiting.
- Generic client-facing error messages.
- No API key in frontend code.
- `Cache-Control: no-store`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy`.
- A restrictive endpoint Content Security Policy.

Hosting/platform controls still recommended:

- HTTPS only.
- Vercel/WAF rate limiting or bot protection for stronger distributed rate limiting.
- Security headers at the hosting layer.
- Domain verification and SPF/DKIM/DMARC for the sending domain.
- Monitoring/alerts for repeated 4xx/5xx activity.
- Keep Resend and dependencies updated.

The in-memory rate limiter is intentionally only a first line of defense: serverless functions can run on multiple instances, so it is not a global distributed limit.

## Updating company information

Commonly edited content is centralized in `js/site-data.js`.

### Add/edit a project

Open:

```text
js/site-data.js
```

Find:

```js
// ================================
// EDIT PROJECTS HERE
// ================================
```

Each project has a `title`, `category`, `location`, `cost`, `description`, and an `images` array. Add or remove image paths in that array; no project HTML needs to be duplicated.

### Add/edit registrations & accreditations

In the same file, find:

```js
// ============================================================
// EDIT REGISTRATIONS & ACCREDITATIONS HERE
// ============================================================
```

Each certificate has a `title` and `image`. The supplied latest Company Profile PDF was used to generate the images currently in `assets/images/certificates/`.

### Company contact information

`COMPANY` at the top of `js/site-data.js` contains the editable email, phone numbers and address used by the site's JavaScript. Some longer descriptive copy remains intentionally in `index.html` to preserve the existing page structure and editorial layout.

### Important maintenance rule

Use the latest approved Company Profile as the source of truth for factual company information. When replacing certificate images, keep the image path in `certifications` synchronized with the file in `assets/images/certificates/`.


## Replacing images

Replace the files in `assets/images/` while keeping the same filenames, or update the corresponding image paths in `js/site-data.js`.

Use images that MIMAG owns or is authorized to publish. Do not add unlicensed stock images.

## Updating brand colors

The main brand variables are at the top of `css/style.css`:

```css
--navy
--navy-2
--blue
--teal
--teal-dark
--gold
```

The current palette follows the supplied MIMAG profile/logo visual language: deep navy, blue, teal and a restrained gold accent.

## Contact form testing checklist

- Required fields reject empty submissions.
- Invalid email is rejected.
- Invalid phone is rejected.
- Honeypot submission does not expose a bot-specific response.
- A valid inquiry returns a success state.
- An email arrives at `CONTACT_EMAIL`.
- Replying to the email targets the visitor email through `replyTo`.
- Resend/API failures show a safe generic error.
- Repeated submissions eventually receive a rate-limit response.

## Privacy / legal

The footer includes placeholder links for Privacy Policy and Terms. Replace them with MIMAG-approved legal pages before production launch.

Do not claim certifications, licenses, project values, client relationships, awards, statistics, social profiles, or other facts that are not in the approved source material.

### Asset organization

All website photos and image assets are stored under `assets/`. The company logo is `assets/logo.png`, general website imagery is under `assets/images/`, project galleries are under `assets/images/projects/`, and registration/accreditation images are under `assets/images/certificates/`. The `favicon/` folder contains browser icon files.

### Project photo folders

Each project has its own folder:

```text
assets/images/projects/
└── Project Name/
    ├── photo-01.jpg
    ├── photo-02.jpg
    └── any-other-filename.png
```

**You do not need to name the photos in any special way.** Every JPG, JPEG, PNG, WEBP, GIF or AVIF image inside that project folder is automatically included in that project's gallery.

The gallery list is generated by `scripts/build-project-galleries.mjs` during the site build. When you add, remove or replace project photos, simply put the files in the correct project folder and redeploy. No image list needs to be manually edited.


## Mission, Vision & Values

The new `Our Purpose` section presents the company's Mission, Vision and Core Values in concise website-ready language while preserving the meaning of the supplied company statements.

## Completed vs. Ongoing Projects

Project status is controlled from `js/site-data.js`. Each project has a `status` field:

```js
status: "completed"
```

To move that same project to **Ongoing Projects**, change only this line to:

```js
status: "ongoing"
```

Save the file and redeploy. The project will automatically move to the Ongoing Projects section, while its photo folder and gallery stay exactly the same.

To move it back later, change `ongoing` back to `completed`.

If there are no projects marked `ongoing`, the website displays **“Ongoing projects are still under development.”** When you add an ongoing project, its card automatically appears in that section.

### Adding a new project

1. Create a new folder under `assets/images/projects/`.
2. Put all photos for that project inside the folder. File names do not matter.
3. Add one project object to `js/site-data.js`.
4. Set its `folder` value to the exact folder name.
5. Set `status` to `completed` or `ongoing`.
6. Redeploy.

Example:

```js
{
  title: "My New Project",
  folder: "My New Project",
  category: "building",
  status: "ongoing",
  location: "Project Location",
  cost: "Php 5,000,000",
  description: "Short project description."
}
```

The build process scans the folder and automatically creates the project album from every supported image inside it.
