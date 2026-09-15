export type ProjectLink = { label: string; url: string }

export type Project = {
  /** Anchor target — the home page's cards deep-link to /projects#<slug>. */
  slug: string
  title: string
  eyebrow: string
  description: string
  links: ProjectLink[]
  image?: string
  /** Also surfaced in the home page's projects column. */
  onHome?: boolean
}

export const projects: Project[] = [
  {
    slug: 'should-you-write-tests',
    title: 'Should You Write Tests?',
    eyebrow: 'Side project',
    // PLACEHOLDER — real copy and links needed.
    description: 'A short, opinionated answer to a question engineers keep relitigating.',
    links: [],
    image: '/static/images/wave-render.jpg',
  },
  {
    slug: 'engineering-manager-resources',
    title: 'Engineering Manager Resources',
    eyebrow: 'GitHub · Open source',
    description:
      'A curated collection of resources for engineering managers — hiring, coaching, process, and leadership reading.',
    links: [
      { label: 'GitHub', url: 'https://github.com/dandigangi/engineering-manager-resources' },
    ],
    image: '/static/images/projects/engineering-management-learning-resources.png',
    onHome: true,
  },
  {
    slug: 'react-chicago',
    title: 'React Chicago',
    eyebrow: 'Conference · Chicago',
    // PLACEHOLDER — the 2019 numbers belong to React Loop, below.
    description: 'The relaunch of Chicago’s React conference — new name, same community.',
    links: [{ label: 'reactchicago.com', url: 'https://reactchicago.com' }],
    image: '/static/images/wave-render.jpg',
    onHome: true,
  },
  {
    slug: 'react-loop',
    title: 'React Loop Conference',
    eyebrow: 'Conference · Chicago 2019',
    description:
      'Organized Chicago’s first and only React Conference — Single day tracks, sold-out 250+ attendees, 12 speakers, 2 keynotes, 5 sponsors and 8 partner companies.',
    links: [{ label: '2019.reactloop.com', url: 'https://2019.reactloop.com' }],
    image: '/static/images/projects/react-loop-chicago-conference.png',
  },
]

/** The two the home page shows; the rest live only on /projects. */
export const homeProjects = projects.filter((project) => project.onHome)
