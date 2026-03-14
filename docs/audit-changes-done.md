# Audit changes – what was done and why

- **Blog post canonicals** – Each post now has a canonical URL in metadata. Search engines know the preferred URL and are less likely to treat duplicates or syndication as separate pages.

- **Twitter description (layout + seo)** – Root layout and shared page SEO now set a Twitter description. Link previews on Twitter/X show a proper description instead of only a title and image.

- **Sitemap expansion** – Added `/blog/tags`, paginated blog pages, and tag pages to the sitemap. More of the site is discoverable by crawlers and indexable.

- **Paginated blog metadata** – Blog page 2, 3, etc. now have their own title (e.g. “Blog – Page 2”). Better for SEO and browser tabs.

- **Unused imports removed** – Dropped unused imports in PageHeader, Header, and social-icons. Cleaner code and fewer chances for tooling confusion.

- **Dead code removed** – Removed LayoutWrapper and app/head.tsx (unused). Kept a minimal Resume component so the resume-print page still works.

- **Card: no `href="#"`** – When a card has no link, the “Learn more” is now plain text instead of a useless `#` link. Better UX and accessibility.

- **Connect page: h2 for sections** – Section titles are now h2 instead of h3 so the heading order is correct (h1 → h2). Helps screen readers and SEO.

- **Descriptive alt text** – Replaced generic “avatar” with things like “Dan DiGangi profile photo” and “Dan DiGangi alter ego”. Screen reader users get useful descriptions.

- **AuthorLayout toggle: ARIA and focus** – Toggle button has an accessible label, pressed state, and visible focus ring. Usable with keyboard and assistive tech.

- **ThemeSwitch: label and focus** – Label reflects current state (“Switch to light mode” / “Switch to dark mode”) and the button has a focus ring. Clearer and keyboard-accessible.

- **Pagination: ARIA** – Nav has “Blog pagination”, disabled prev/next use `aria-disabled`. Assistive tech can understand and announce pagination correctly.

- **Search icon: decorative** – Search SVG is marked `aria-hidden="true"` so it’s ignored by screen readers. Avoids redundant or confusing announcements.

- **Button.jsx → link** – Replaced a button that opened a URL with an `<a>` (target, rel, focus ring, aria-label). Correct semantics, security (rel), and keyboard support.

- **.gitignore: .env and .env.local** – Reduces the chance of committing env files and secrets.
