/**
 * Projects is intentionally absent — the page exists in the design but is not
 * launching in this release. Re-add `{ href: '/projects', title: 'Projects' }`
 * when it ships.
 *
 * /connect was renamed to /contact; next.config.mjs holds the permanent
 * redirect so the already-indexed URL keeps its equity.
 */
const navLinks = [
  { href: '/blog', title: 'Blog' },
  { href: '/about', title: 'About' },
  { href: '/resume', title: 'Résumé' },
  { href: '/contact', title: 'Contact' },
]

export default navLinks
