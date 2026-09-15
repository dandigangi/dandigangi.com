export type Project = {
  /** Anchor target — the home page's cards deep-link to /projects#<slug>. */
  slug: string
  title: string
  eyebrow: string
  description: string
  /** The whole card is one anchor to this, so a project gets a single link. */
  url: string
  linkLabel: string
  /** PLACEHOLDER for all four — every card shares the 3D render for now. */
  image: string
  /** Also surfaced in the home page's projects column. */
  onHome?: boolean
}

export const projects: Project[] = [
  {
    slug: 'should-you-write-tests',
    title: 'Should You Write Tests?',
    eyebrow: 'Side project',
    description: 'If you ain’t writing tests, you ain’t shipping to prod.',
    url: 'https://shouldyouwritetests.com',
    linkLabel: 'shouldyouwritetests.com',
    image: '/static/images/video-card.jpg',
  },
  {
    slug: 'engineering-manager-resources',
    title: 'Engineering Manager Resources',
    eyebrow: 'GitHub · Open source',
    description:
      'A curated collection of leadership, management, and technical strategy resources for engineering leaders.',
    url: 'https://github.com/dandigangi/engineering-manager-resources',
    linkLabel: 'GitHub',
    image: '/static/images/video-card.jpg',
    onHome: true,
  },
  {
    slug: 'postmark-open-source',
    title: 'Postmark Open Source',
    eyebrow: 'GitHub · Open source',
    description: 'OSS contributions to Postmark SDKs, integrations, and tooling.',
    url: 'https://github.com/ActiveCampaign',
    linkLabel: 'GitHub',
    image: '/static/images/video-card.jpg',
  },
  {
    slug: 'react-chicago',
    title: 'React Chicago Conference',
    eyebrow: 'Conference',
    description: 'The relaunch of Chicago’s only React conference.',
    url: 'https://reactchicago.com',
    linkLabel: 'reactchicago.com',
    image: '/static/images/video-card.jpg',
    onHome: true,
  },
  {
    slug: 'react-loop',
    title: 'React Loop Conference',
    eyebrow: 'Conference',
    description:
      'Organized Chicago’s first and only React Conference — Single day tracks, sold-out 250+ attendees, 12 speakers, 2 keynotes, 5 sponsors and 8 partner companies.',
    // Shown as reactloop.com; the archive at 2019. is what still resolves.
    url: 'https://2019.reactloop.com',
    linkLabel: 'reactloop.com',
    image: '/static/images/video-card.jpg',
  },
]

/** The two the home page shows; the rest live only on /projects. */
export const homeProjects = projects.filter((project) => project.onHome)
