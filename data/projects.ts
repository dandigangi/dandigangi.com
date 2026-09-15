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
    title: 'React Loop Conference',
    eyebrow: 'Chicago · Conference',
    description:
      'Organizer of React Loop, a Chicago React conference bringing together speakers and the local engineering community.',
    url: 'https://2019.reactloop.com',
  },
]
