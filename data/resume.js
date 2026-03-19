// WEB
const resumeXp = [
  {
    id: 1,
    company: 'Postmark',
    url: 'https://postmark.com',
    jobTitle: 'Senior Software Engineering Manager',
    dates: 'Apr 2024 – Present',
    descriptions: [
      'Scaled email throughput from 2B to 3B+ emails/month in 10 months, maintaining ~200ms per message processing performance through MTA expansion and infrastructure growth.',
      'Prevented $1.5M+ in fraud by architecting a multi-layer security platform spanning AI content moderation, fraud detection, WAF/firewall edge protection, and eHawk traffic analysis.',
      'Grew the engineering organization from 6 to 11 FTE and hired 6 contractors, expanding delivery capacity across .NET backend, web, platform/SRE, and security/compliance functions.',
      'Led cross-functional initiatives including pricing redesign, high-traffic legacy Windows service migration, ZenDesk migration, SOC2 compliance, and billing platform migration.',
    ],
  },
  {
    id: 2,
    company: 'ActiveCampaign - Velocity',
    url: 'https://activecampaign.com',
    jobTitle: 'Software Engineering Manager',
    dates: 'May 2023 – Sep 2023 (Layoff)',
    descriptions: [
      'Led and hired the Velocity team (3 reports) delivering special projects, features, and applications supporting the BTS org across finance, growth, and internal services.',
      'Redesigned agile/SDLC processes from ideation to delivery, adopted across all BTS teams, reducing defect rates (~16%) through new testing requirements and reintroduction of Playwright E2E testing suites.',
      'Coached engineers across BTS growing their technical, product, and business skill sets while collaborating with cross-functional partners to develop org-wide roadmaps.',
    ],
  },
  {
    id: 3,
    company: 'Arrive Logistics',
    url: 'https://arrivelogistics.com',
    jobTitle: 'Senior Software Engineering Manager',
    dates: 'July 2022 – May 2023',
    descriptions: [
      'Led the TSO (3 reports), finance/accounting (8 reports), and load services (9 reports) teams responsible for core business operations from shipping to financial transactions across 20 direct reports.',
      'Delivered complex E2E shipping workflow UIs leveraging federated modules, new finance microservices, 3rd party accounting integrations, and re-architected the service domain model.',
      'Delivered an automated real-time AI/ML based shipment pricing model in collaboration with the data science team and led a Docker to Kubernetes migration across highly coupled organization-wide applications.',
    ],
  },
  {
    id: 4,
    company: 'DocuSign',
    url: 'https://docusign.com',
    jobTitle: 'Software Engineering Manager',
    dates: 'May 2020 – July 2022',
    descriptions: [
      'Built and scaled CLM’s Buy/Sell team from the ground up, hiring 7 full stack engineers responsible for buy/sell contract management, party management, global user experience, and accessibility.',
      'Delivered WCAG 2.1 accessibility across major UI components in collaboration with enterprise customers, ensuring compliance at global scale.',
      'Implemented on-call rotations and E2E test automation increasing coverage by 60%+ and reducing regressions and escalations (~9%).',
    ],
  },
  {
    id: 4,
    company: 'OpenLane',
    url: 'https://openlane.com',
    jobTitle: 'Software Engineering Manager',
    dates: 'July 2017 - May 2020',
    descriptions: [
      'Promoted from Lead Frontend Engineer to Engineering Manager, growing to lead 3 product engineering teams across 12 engineers, 2 contractors, and 1 manager spanning React, Node, Java, and Python.',
      'Led integration of DRIVIN engineering through the OpenLane/KAR acquisition, built a redefined cross-functional SDLC, and scaled delivery capacity through internal and 3rd party recruiting.',
      'Delivered complex financial and analytics products using TensorFlow pricing models, established front end standards of practice, increased testing coverage (~42%), reduced defects (~21%), and stabilized release processes.',
    ],
  },
]

const resumeOther = [
  'React Chicago Conference Organizer',
  'ActiveAbility Mental Health ERG Founder',
  'Postmark Open Source Contributor',
  'Technical Leadership Speaker & Writer',
  'Engineering Mentor & Educator',
]

export { resumeXp, resumeOther }
