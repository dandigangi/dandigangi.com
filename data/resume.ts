export type ResumeRole = {
  title: string
  company: string
  url?: string
  /** Plain-text aside after the company name, outside its link. */
  note?: string
  dates: string
  achievements: string[]
  /** Square company mark, 40x40 or larger. Renders an empty slot until set. */
  logo?: string
}

export type ResumeEducation = {
  credential: string
  institution: string
  dates: string
  logo?: string
}

export const resumeSummary =
  'Senior Software Engineering Manager in Chicago, IL. Engineering leadership for 9+ years, software engineering for 20+.'

export const resumeExperience: ResumeRole[] = [
  {
    title: 'Senior Software Engineering Manager',
    company: 'Postmark',
    note: 'Layoff',
    logo: '/static/images/logos/postmark.jpg',
    url: 'https://postmarkapp.com',
    dates: 'Apr 2024 — Sep 2026',
    achievements: [
      'Scaled email throughput from 2B to 3B+ emails/month in 10 months, maintaining ~200ms per message processing performance through MTA expansion and infrastructure growth.',
      'Prevented $1.5M+ in fraud by architecting a multi-layer security platform spanning AI content moderation, fraud detection, WAF/firewall edge protection, and eHawk traffic analysis.',
      'Grew the engineering organization from 6 to 11 FTE and hired 6 contractors, expanding delivery capacity across .NET backend, web, platform/SRE, and security/compliance functions.',
      'Led cross-functional initiatives including pricing redesign, high-traffic legacy Windows service migration, ZenDesk migration, SOC2 compliance, and large-scale billing platform migration.',
    ],
  },
  {
    title: 'Senior Software Engineering Manager',
    company: 'ActiveCampaign — Velocity',
    note: 'Layoff',
    logo: '/static/images/logos/activecampaign.jpg',
    url: 'https://www.activecampaign.com',
    dates: 'May 2023 — Sep 2023',
    achievements: [
      'Led and hired the Velocity team (3 reports) delivering special projects, features, and applications supporting the BTS org across finance, growth, and internal services.',
      'Redesigned agile/SDLC processes from ideation to delivery, adopted across all BTS teams, reducing defect rates (~16%) through new testing requirements and reintroduction of Playwright E2E testing suites.',
      'Coached engineers across BTS growing their technical, product, and business skill sets while collaborating with cross-functional partners to develop org-wide roadmaps.',
    ],
  },
  {
    title: 'Senior Software Engineering Manager',
    company: 'Arrive Logistics',
    logo: '/static/images/logos/arrive-logistics.jpg',
    url: 'https://www.arrivelogistics.com',
    dates: 'Jul 2022 — May 2023',
    achievements: [
      'Led the TSO (3 reports), finance/accounting (8 reports), and load services (9 reports) teams responsible for core business operations from shipping to financial transactions across 20 direct reports.',
      'Delivered complex E2E shipping workflow UIs leveraging federated modules, new finance microservices, 3rd party accounting integrations, and re-architected the service domain model.',
      'Delivered an automated real-time AI/ML based shipment pricing model in collaboration with the data science team and led a Docker to Kubernetes migration across highly coupled organization-wide applications.',
    ],
  },
  {
    title: 'Software Engineering Manager',
    company: 'DocuSign',
    logo: '/static/images/logos/docusign.jpg',
    url: 'https://www.docusign.com',
    dates: 'May 2020 — Jul 2022',
    achievements: [
      "Built and scaled CLM's Buy/Sell team from the ground up, hiring 7 full stack engineers responsible for buy/sell contract management, party management, global user experience, and accessibility.",
      'Delivered WCAG 2.1 accessibility across major UI components in collaboration with enterprise customers, ensuring compliance at global scale.',
      'Implemented on-call rotations and E2E test automation increasing coverage by 60%+ and reducing regressions and escalations (~9%).',
    ],
  },
  {
    title: 'Software Engineering Manager',
    company: 'OpenLane',
    logo: '/static/images/logos/openlane.jpg',
    url: 'https://www.openlane.com',
    dates: 'Jul 2017 — May 2020',
    achievements: [
      'Promoted from Lead Frontend Engineer to Engineering Manager, growing to lead 3 product engineering teams across 12 engineers, 2 contractors, and 1 manager spanning React, Node, Java, and Python.',
      'Led integration of DRIVIN engineering through the OpenLane/KAR acquisition, built a redefined cross-functional SDLC, and scaled delivery capacity through internal and 3rd party recruiting.',
      'Delivered complex financial and analytics products using TensorFlow pricing models, established front end standards of practice, increased testing coverage (~42%), reduced defects (~21%), and stabilized release processes.',
    ],
  },
  {
    title: 'UX Software Engineer',
    company: 'ClearStory Data',
    url: 'https://www.alteryx.com',
    note: 'Acquired',
    logo: '/static/images/logos/clearstory-data.jpg',
    dates: 'Sep 2014 — Aug 2015',
    achievements: [
      'Collaborated with the Chief UX Architect using LucidChart and Sketch to design wireframes and custom visualizations for complex enterprise data interaction flows.',
      'Delivered a large-scale data ingestion, management, and BI tool using React, Backbone, and D3 serving enterprise customers including APIs, CSV, SQL/PSQL databases, and Aurora/Snowflake warehouses.',
      'Tested with Mocha, Jasmine, Casper, and Selenium including visual regression testing.',
    ],
  },
  {
    title: 'Lead Frontend Software Engineer',
    company: 'Apartments.com',
    logo: '/static/images/logos/apartments.jpg',
    url: 'https://www.apartments.com',
    dates: 'Oct 2012 — Sep 2014',
    achievements: [
      'Led 3 front end developers building a content management, advertising, and MLS product replacing a custom Knockout implementation with Angular 1.',
      'Developed and delivered a PPC advertising platform generating $7MM ARR for marketing with a site-wide API for engineers using Javascript and Google Ads.',
      'Maintained and sunset legacy applications post Angular release, testing with customers over 4.5 months, and trained engineers on Javascript architecture, patterns, and best practices.',
      'Technical speaker for internal company conference on Javascript, Angular, and building front-end systems.',
    ],
  },
]

export const resumeEducation: ResumeEducation = {
  credential: "Bachelor's Degree, Web Design & Interactive Media",
  institution: 'The Art Institutes — IL Institute of Art',
  dates: '2007 — 2010',
}

export const resumeOther: string[] = [
  'React Chicago Conference Organizer',
  'ActiveAbility Mental Health ERG Founder',
  'Postmark Open Source Contributor',
  'Leadership Speaker & Writer',
  'Engineering Mentor & Educator',
]

/** Generated by `yarn resume:pdf` from this file, then uploaded to Drive. */
export const RESUME_PDF_URL = 'https://drive.google.com/file/d/10yRGQ231LA77GU2qq6D6Y_jgQaDqZWby/'

export const RESUME_PDF_ENABLED = true
