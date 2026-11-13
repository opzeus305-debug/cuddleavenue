# Cuddle Avenue Academy

An editorial website for a Brooklyn early-education academy, designed to help families understand the school, compare programs, and arrange a visit.

The interface brings an academic prospectus into a warm, image-led layout: a clear program selector, a full-screen navigation atlas, and practical information about the school day and both campuses.

## Experience

- Six program views with age ranges, classroom imagery, and contextual enquiry links.
- Expanded navigation with image previews, Escape-to-close behavior, and scroll locking.
- Academy and Playroom paths, location directions, a family FAQ, and email-based tour enquiries.
- Responsive layouts, a skip link, progressive section reveals, and reduced-motion styling.
- Page metadata, Open Graph artwork, and Twitter card metadata.

## Stack

TypeScript · React 19 · Next.js-compatible App Router · vinext · Vite · Tailwind CSS 4.

The scripts in this repository run through **vinext**, with Cloudflare and Sites plugins configured in `vite.config.ts`. The presence of `next.config.ts` does not mean `pnpm build` runs the standard Next.js CLI.

## Run locally

Use Node.js **22.13 or newer** and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by the dev server.

```sh
pnpm lint
pnpm build
pnpm start
```

`pnpm start` serves the production build. Netlify is configured to publish `dist/client`; confirm that the selected build output matches the hosting target before deploying.

## Source guide

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Page content, program state, navigation, and reveal behavior |
| `app/globals.css` | Responsive layout, type, motion, and visual design |
| `app/layout.tsx` | Document shell, fonts, metadata, and social sharing |
| `public/` | Brand assets, photographs, and social artwork |
| `vite.config.ts` | vinext/Vite configuration and hosting adapters |
| `netlify.toml` | Static publish target and response headers |

## Project status and content

This repository contains the website implementation. A source review alone does not establish that the latest deployment is healthy.

Before launch, verify program availability, school-year dates, addresses, review figures, and other school claims with the academy. Check keyboard navigation, mobile layouts, reduced motion, enquiry links, and production asset paths on the deployed build.

## Rights

Client branding, photographs, and supplied content remain the property of their respective owners. This repository does not grant a general license to reuse those assets.
