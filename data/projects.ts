export type Project = {
  title: string
  eyebrow: string
  description: string
  url: string
}

/**
 * The Projects page is not launching yet; these two surface on the home page
 * instead. Restoring the page means reusing this list, not duplicating it.
 */
export const projects: Project[] = [
  {
    title: 'Engineering Manager Resources',
    eyebrow: 'GitHub · Open source',
    description:
      'A curated collection of resources for engineering managers — hiring, coaching, process, and leadership reading.',
    url: 'https://github.com/dandigangi/engineering-manager-resources',
  },
  {
    title: 'React Chicago Conference',
    eyebrow: 'Conference',
    description:
      'Organized Chicago’s first and only React Conference — Single day tracks, sold-out 250+ attendees, 12 speakers, 2 keynotes, 5 sponsors and 8 partner companies.',
    url: 'https://2019.reactloop.com',
  },
]
