# Site audit – remaining work

Quick wins are done. Below is what’s left from the full audit, grouped by area.

---

## Done (quick wins)

- Postmark + PostLayout: `rel="noopener noreferrer"` (and Prettier fixes)
- Internal links: Connect + blog 404 use `Link`
- JSON-LD image fix in `contentlayer.config.ts`
- Homepage metadata (title, description, OG, Twitter)
- `listDateTemplate` type fix in `app/Main.tsx`

---

## 1. SEO

- **Blog post canonicals**  
  In `app/blog/[...slug]/page.tsx` `generateMetadata`, set `alternates.canonical` (use `post.canonicalUrl` when present, otherwise build URL from slug).
- **Twitter description**  
  Add `description` to the `twitter` object in `app/layout.tsx` and `app/seo.tsx` so non-blog pages get a Twitter description in shares.
- **Sitemap (optional)**  
  In `app/sitemap.ts`, optionally add `/blog/tags`, `/blog/page/[page]`, and tag pages so they’re discoverable.

---

## 2. Code quality

- **Paginated blog metadata**  
  `app/blog/page/[page]/page.tsx` doesn’t export `metadata`; add e.g. “Blog – Page N” for consistency and SEO.
- **Unused imports**  
  Remove unused: `title` from `@/data/siteMetadata` in `components/PageHeader.tsx`; `boxShadow` from `tailwindcss/defaultTheme` in `components/Header.tsx`; `fill` from `tailwindcss/defaultTheme` in `components/social-icons/icons.tsx`.
- **Dead code (optional)**  
  `components/LayoutWrapper.tsx`, `components/Resume.tsx`, and `app/head.tsx` are unused; remove or wire up.

---

## 3. Accessibility / UX

- **Card**  
  In `components/Card.tsx`, when `href` is falsy, avoid rendering a link with `href="#"`; show text or omit the control instead.
- **Connect headings**  
  In `app/connect/page.tsx`, use `h2` for the two section titles (“Speaking, Writing…” and “Coaching & Mentoring”) so hierarchy is h1 → h2, not h1 → h3.
- **Alt text**  
  In `layouts/AuthorLayout.tsx` and `layouts/PostLayout.tsx`, replace generic `alt="avatar"` with something descriptive (e.g. author name).
- **Focus / ARIA**
  - ThemeSwitch: add visible focus ring and consider a dynamic `aria-label` (e.g. “Switch to light mode” / “Switch to dark mode”) or `aria-pressed`.
  - ListLayout: add `aria-disabled="true"` on disabled prev/next buttons; optional `aria-label="Blog pagination"` on the nav.
  - AuthorLayout: “My Alter Ego” / “Back to Dan” toggle: add `aria-label` and optionally `aria-pressed`.
  - Button.jsx: if it only opens a URL, use `<a>` with `target="_blank"` and `rel="noopener noreferrer"` styled as a button, plus focus styles and `aria-label` if needed.
- **Decorative icon**  
  In ListLayout, add `aria-hidden="true"` to the search icon SVG.

---

## 4. Env

- Add `.env` and `.env.local` to `.gitignore` if you want to avoid accidentally committing env files.

---

## Suggested order

1. **Next batch (high impact, low effort):** blog canonicals, Twitter description in layout/seo, paginated blog metadata, unused-import cleanup.
2. **Then:** a11y items (Card, Connect headings, alt text, focus/ARIA, decorative icon).
3. **Optional:** sitemap expansion, dead code removal, env in `.gitignore`.
