const resumeXp = [
  {
    id: 0,
    company: 'Upright Education',
    url: 'https://uprighted.com',
    jobTitle: 'Part Time Instructor',
    dates: 'Nov 2023 - Current',
    descriptions: [
      'Teaching 10-20 student cohorts software development and the MERN (MongoDB, Express, React, and Node) stack. My goal as an instructor is to teach end-to-end how to work successfully in the software industry paired with technical, professional, and leadership skills.',
    ],
  },
  {
    id: 1,
    company: 'Active Campaign',
    url: 'https://activecampaign.com',
    jobTitle: 'Software Engineering Manager',
    dates: 'May 2023 - Aug 2023 (Layoff)',
    descriptions: [
      'Led and hired the Velocity team (3 reports) delivering special projects, features, and applications/tooling supporting the BTS org., finance, growth, and internal services teams.',
      'Coached engineers across BTS growing their technical, product, user experience, and business skill sets.',
      'Collaborated closely with cross functional partners and business stakeholders developing cross team product/technical roadmaps.',
      'Redesigned agile/SDLC processes from ideation to delivery and adopted across all BTS teams.',
      'Analyzed and reduced defect rates (~16 %) leveraging new SDLC processes and testing requirements including reintroduction of Playwright E2E testing suites.',
    ],
  },
  {
    id: 2,
    company: 'Arrive Logistics',
    url: 'https://arrivelogistics.com',
    jobTitle: 'Senior Software Engineering Manager',
    dates: 'July 2022 - Apr 2023',
    descriptions: [
      'Responsible for the TSO (3 reports), finance/accounting (8 reports), and load service (9 reports) teams responsible for core business operations from shipping to financial transactions.',
      'Worked closely with cross functional partners and teams to deliver on highly coupled organization wide applications including a Docker to Kubernetes migration.',
      'Delivered complex E2E shipping workflow UIs leveraging federated modules, new finance microservices, 3rd party accounting integrations, and re-architected the service domain model.',
      'Delivered an automated, real time AI/ML based shipment pricing model in collaboration with the data science team.',
    ],
  },
  {
    id: 3,
    company: 'DocuSign',
    url: 'https://docusign.com',
    jobTitle: 'Software Engineering Manager',
    dates: 'May 2020 - June 2022',
    descriptions: [
      "Built and led CLM's Buy/Sell team hiring 7 full stack engineers responsible for developing buy/sell contracts and party management, global user experience, and accessibility.",
      'Coached team on our mission, values, SDLC processes, and implementation of measured performance metrics sprint-over-sprint.',
      'Worked closely with product managers to build and deliver roadmaps on aggressive deadlines., Delivered WCAG 2.1 accessibility on major UI components in collaboration with enterprise customers.',
      'Implemented on-call rotations (Tower) and E2E automation increasing coverage by 60%+ and reducing regressions/escalations (~9%).',
    ],
  },
  {
    id: 4,
    company: 'OpenLane (prev. KAR, DRIVIN)',
    url: 'https://openlane.com',
    positions: [
      {
        jobTitle: 'Software Engineering Manager',
        dates: 'May 2018 - May 2020',
        descriptions: [
          'Managed 3 product engineering teams  (12 engineers, 2 contractors, 1 manager)  composed of React, Node, Java, and Python engineers.',
          'Led the OpenLane (KAR) acquisition of integrating DRIVIN engineering and built a redefined, cross functional SDLC.',
          'Hired with internal and 3rd party recruiters to expand the Web and OTS delivery capabilities. Coached team on new processes enabling rapid scaling.',
          'Delivered complex financial and analytics products using TensorFlow pricing models developed in collaboration with the data science team for enterprise customers.',
        ],
      },
      {
        jobTitle: 'Lead Engineer',
        dates: 'July 2017 - June 2018',
        descriptions: [
          'Led the Web and OTS teams development strategy along with coaching engineers/contractors ranging from junior to senior.',
          'Delivered multiple enterprise applications in React/Webpack/Node with supporting Java APIs to production across product and engineering teams.',
          'Designed front end standards of practice including software design, reviews, documentation, testing, and overall architecture.',
          'Maintained legacy applications refactoring highly coupled code, increased testing coverage (~42%), reduced defects (~21%), and stabilized release processes.',
        ],
      },
    ],
  },
  {
    id: 5,
    company: 'StarterPak',
    url: 'https://www.linkedin.com/company/9410008/',
    jobTitle: 'Technical Co-founder',
    dates: 'June 2015 - July 2017',
    descriptions: [
      'Co-founded startup company (dba Get20) deploying native mobile applications to enable real-time connections and communication between professionals.',
      'Led product and technical strategy over mobile application development with 3rd party app development company.',
      'Raised $75k seed funding from multiple investors.',
    ],
  },
  {
    id: 5,
    company: 'ClearStory Data',
    url: 'https://www.prnewswire.com/news-releases/alteryx-acquires-clearstory-data-to-accelerate-innovation-in-data-science-and-analytics-300825146.html',
    jobTitle: 'UX Software Engineer',
    dates: 'Sept 2014 - May 2015',
    descriptions: [
      'Collaborated with the Chief UX Architect using LucidChart and Sketch creating wireframes/UI for complex interaction flows and custom visualizations for enterprise customers.',
      'Developed a large scale data ingestion, management, and BI tool using React, Backbone, and D3.',
      'Tested with Mocha, Jasmine, Casper and Selenium (E2E) including visual regression testing.',
      'Delivered data ingestion UI and proxy service steaming custom data sources from enterprise customers such as APIs, CSV, SQL/PSQL databases, and Aurora/Snowflake warehouses.',
    ],
  },
  {
    id: 6,
    company: 'Apartments.com',
    url: 'https://apartments.com',
    jobTitle: 'Lead Front End Engineer',
    dates: 'Dec 2012 - Aug 2014',
    descriptions: [
      'Led 3 front end developers to build a content management, advertising, and MLS product with Angular 1 replacing custom Knockout implementation.',
      'Maintained and sunset legacy applications post Angular release and testing with customers over 4.5 months.',
      'Developed and successfully delivered a PPC advertising platform ($7MM ARR) for marketing and a site-wide API for engineers with Javascript and Google Ads.',
      'Trained associate to mid-level engineers on Javascript architecture, patterns, and best practices.',
    ],
  },
  {
    id: 7,
    company: 'Fusion92',
    url: 'https://fusion92.com',
    jobTitle: 'Web Developer',
    dates: 'May 2011 - Dec 2012',
    descriptions: [
      'Developed pixel-perfect, responsive interfaces in HTML, CSS, and Javascript to meet design specs for multiple large scale clients including AT&T, Bosch, H&R Block, and Mazda.',
    ],
  },
  {
    id: 8,
    company: 'GTHAUS',
    url: 'https://gthaus.com',
    jobTitle: 'Web Developer & Technical Manager',
    dates: 'Apr 2009 - Dec 2010',
    descriptions: [
      'Designed and developed the core e-commerce website and product micro-sites. The architecture was built to enable rapid development and deployment to rival competing brands and better position the Meisterschaft brand in an aggressively growing mid-market.',
    ],
  },
  {
    id: 8,
    company: 'Adexa Media',
    url: 'https://www.linkedin.com/company/adexa-digital-media-inc-/',
    jobTitle: 'Owner',
    dates: 'Oct 2004 - Oct 2009',
    descriptions: [
      'Personal freelance agency specializing in mid-to-large scale web development and design projects. Self taught and serviced over 30+ clients starting starting at the age of 14.',
    ],
  },
]

export default resumeXp
