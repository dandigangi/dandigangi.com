# Changelog

The site deploys continuously, so these are dated rather than tagged. The
version in `package.json` marks the design generation, not a release cadence —
the footer's build stamp is what identifies a given deploy.

## 2.0.x — since 2026-09-14

Everything since the 2.0 foundation landed. Most of it is the v2 build-out.

### Added

- **Projects page**, with the same card treatment as the featured video and a
  grid that holds two per row rather than stretching the odd one.
- **Related posts** at the foot of each post, below Share.
- **Real pagination** on the blog index and on every tag page, replacing the
  load-more control. Paginated pages carry their own metadata.
- **Blog search in the URL** — typing sets `?q=`, and arriving on a link that
  carries one loads straight into that search, so a set of results is something
  you can send someone.
- **Mobile navigation menu.**
- **Generated OpenGraph cards**, per post and for the site, replacing the static
  banner.
- **An AEO surface** — named rules for AI crawlers, and `llms.txt`.
- **PostHog** alongside the existing analytics, production builds only.
- **A local-only editor** at `/admin/write` for writing and editing posts, with
  a tag picker that offers the tags already in use so the index stops
  fragmenting.
- **The résumé as a generated PDF**, built from the site itself rather than kept
  as a separate document that drifts.
- **Build stamp** in the footer, showing the version and linking to the commit
  it was built from.
- **A route smoke test**, and tests pinning the accessibility and SEO rules
  worth keeping.
- Site-wide parallax, and the portrait on the About sidebar.

### Changed

- Rebuilt on the v2 design with real content, responsive without media queries.
- Tag pages reworked: proper title casing, a heading that says what you are
  looking at, and larger, easier tag targets.
- The home tagline types itself in, and the About pull quote became something
  you can turn through.
- Post images go through `next/image` instead of raw tags.
- Page titles stopped spending 52 characters on boilerplate; every page got its
  own meta description.
- Syntax highlighting restored, with a brighter palette and larger code type.
- Favicons and the web manifest rebuilt from the brand mark.
- Tighter content security policy, `unsafe-eval` scoped to development, and the
  HSTS header dropped because the host already sends it.
- Failed admin logins take their time before failing.
- The 404 page restyled, and it offers the LinkedIn link too.
- Hero and page bands rebalanced across small screens, plus a round of mobile
  layout fixes.
- Blog list rows given more vertical room.
- Résumé and About content brought current: the Postmark role closed out,
  ActiveCampaign dropped, leadership tenure corrected.
- Tags consolidated, and media headings normalised across posts.
- Node pinned to 24 across the repo.

### Fixed

- Light mode across several components that had only ever been checked dark.
- A missing post embed falls back instead of taking the page down with it, and a
  post with no body renders rather than failing.
- Tag feeds are cleared before regeneration, so removed posts actually leave.
- Every remaining axe violation across every page, plus a contrast and heading
  structure pass.
- Horizontal scroll on Windows.
- Dead links repaired and pruned across posts, and a misspelled slug corrected.
- The article split ratio, and the split spanning the full row.
- `og:image` URLs no longer carry the convention's content hash.
- Mobile rail indent, and the video card not being clickable.

### Removed

- The static social banner, now that generated cards cover every page.
- The authors collection, which nothing defined or read.
- Smartlook, and a good deal of the PostHog bundle.
- A stale LaTeX résumé and an audio file nothing had ever linked to.
- `.env.local` and `next-env.d.ts` from version control.

## 2.0.0 — 2026-09-14

Rebuilt on Next.js 16 with the App Router and Velite, on a new design
foundation. Content moved to a typed collection compiled at build time, styling
moved to CSS Modules over a small set of design tokens, and nearly every route
became statically generated.

## 1.x — 2023-05 to 2026-03

The first version, also Next.js. Grew a blog with tags and feeds, a projects
page, a résumé, structured data and Open Graph metadata, canonical URLs,
pagination, dark and light themes, and a long tail of content and accessibility
fixes.
