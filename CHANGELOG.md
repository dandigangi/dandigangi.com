# Changelog

The site deploys continuously, so these are dated rather than tagged. The
version in `package.json` marks the design generation, not a release cadence —
the footer's build stamp is what identifies a given deploy.

## Unreleased

### Added

- Blog search now lives in the URL. Typing sets `?q=`, and arriving on a link
  that carries one loads straight into that search, so a set of results is
  something you can send someone.
- Real pagination on the blog index and on every tag page, replacing the
  load-more control.
- A rebuilt projects page, and a mobile navigation menu to go with it.
- A local-only post editor at `/admin/write`, with a tag picker that offers the
  tags already in use so the index stops fragmenting.
- The résumé is generated as a PDF from the site itself, rather than kept as a
  separate document that drifts.
- Build stamp in the footer, linked to the commit it was built from.

### Changed

- Tag pages: proper title casing, a heading that says what you are looking at,
  and larger, easier tag targets.
- The home tagline types itself in and can be clicked through; the About pull
  quote became a wheel you can turn.
- Post images go through `next/image` instead of raw tags.
- Page titles stopped spending 52 characters on boilerplate.
- Favicons rebuilt from the brand mark.
- Tighter content security policy; dropped the HSTS header the host already
  sends.
- Hero and page bands rebalanced across small screens, and a round of mobile
  layout fixes.

### Fixed

- Light mode corrected across several components that had only ever been
  checked dark.
- A missing post embed now falls back instead of taking the page down with it.
- A post with no body renders rather than failing.
- Tag feeds are cleared before regeneration, so removed posts actually leave.
- Every remaining axe violation across every page, plus a contrast and heading
  structure pass.

## 2.0.0 — 2026-09-14

Rebuilt on Next.js 16 with the App Router and Velite, on a new design
foundation. Content moved to a typed collection compiled at build time, styling
moved to CSS Modules over a small set of design tokens, and nearly every route
became statically generated.

## 1.x — 2023-09 to 2026-03

The first Next.js version. Grew a blog with tags and feeds, a projects page, a
résumé, structured data and Open Graph metadata, canonical URLs, pagination,
dark and light themes, and a long tail of content and accessibility fixes.

## 0.x — 2023-05

The original site, built with Astro.
