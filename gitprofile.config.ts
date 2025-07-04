// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'chutch3', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: false, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['arifszn/gitprofile', 'arifszn/pandora'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: 'My Projects',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'Hubitat Device Refresher',
          description:
            'A Hubitat app that automatically refreshes the status of selected Z-Wave devices on a user-defined schedule. Ideal for users who want to keep device states up-to-date and avoid stale readings. Supports both simple interval selection and advanced cron expressions.',
          imageUrl: '',
          link: 'https://gist.github.com/chutch3/2662014539066e1219280678ec9d5169',
        },
      ],
    },
  },
  seo: {
    title: 'Portfolio of Cody Hutchens',
    description: '',
    imageURL: '',
  },
  social: {
    linkedin: 'codyhutchens',
    twitter: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: 'cody.coder',
    youtube: '', // example: 'pewdiepie'
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    skype: '',
    telegram: '',
    website: 'https://www.codyhutchens.com',
    phone: '',
    email: 'chutchens91@gmail.com',
  },
  resume: {
    fileUrl:
      'https://drive.google.com/file/d/12vNYbanOX12RX-eF0EZohyb02Wyobmnx/view?usp=sharing', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'Python',
    'Machine Learning',
    'Metaflow',
    'GCP',
    'AWS',
    'FastAPI',
    'Docker',
    'Earth Engine',
    'SQL',
    'Git',
    'PostGIS',
    'Pytest',
    'Tensorflow',
    'Pytorch',
    'Scikit-learn',
    'Pandas',
    'Numpy',
    'Dagster',
    'Airflow',
    'Kubernetes',
    'Terraform',
    'Terragrunt',
    'Gitlab CI/CD',
    'BigQuery',
  ],
  experiences: [
    {
      company: 'Perennial',
      position: 'Senior Machine Learning Engineer',
      from: 'February 2023',
      to: 'Present',
      companyLink: 'https://www.perennial.earth/',
    },
    {
      company: 'Ontra',
      position: 'Senior Machine Learning Engineer',
      from: 'August 2022',
      to: 'February 2023',
      companyLink: 'https://www.ontra.ai/',
    },
    {
      company: 'Drizly',
      position: 'Senior Machine Learning Engineer',
      from: 'April 2022',
      to: 'June 2022',
      companyLink: 'https://drizly.com/',
    },
    {
      company: 'Drizly',
      position: 'Machine Learning Engineer',
      from: 'August 2021',
      to: 'April 2022',
      companyLink: 'https://drizly.com/',
    },
    {
      company: 'Humana',
      position: 'Lead Machine Learning Engineer',
      from: 'December 2019',
      to: 'August 2021',
      companyLink: 'https://www.humana.com/',
    },
    {
      company: 'Humana',
      position: 'Machine Learning Engineer',
      from: 'August 2018',
      to: 'December 2019',
      companyLink: 'https://www.humana.com/',
    },
    {
      company: 'Humana',
      position: 'Senior Software Engineer',
      from: 'January 2016',
      to: 'August 2018',
      companyLink: 'https://www.humana.com/',
    },
  ],
  certifications: [
    // {
    //   name: 'Lorem ipsum',
    //   body: 'Lorem ipsum dolor sit amet',
    //   year: 'March 2022',
    //   link: 'https://example.com',
    // },
  ],
  educations: [
    {
      institution: 'Georgia Institute of Technology',
      degree:
        'Master of Science - MS, Computer Science, Specialization in Machine Learning',
      from: '2018',
      to: '2021',
    },
    {
      institution: 'Indiana University Southeast',
      degree: 'Bachelor of Science (BS), Computer Science',
      from: '2009',
      to: '2013',
    },
  ],
  publications: [
    // {
    //   title: 'Publication Title',
    //   conferenceName: '',
    //   journalName: 'Journal Name',
    //   authors: 'John Doe, Jane Smith',
    //   link: 'https://example.com',
    //   description:
    //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    // },
    // {
    //   title: 'Publication Title',
    //   conferenceName: 'Conference Name',
    //   journalName: '',
    //   authors: 'John Doe, Jane Smith',
    //   link: 'https://example.com',
    //   description:
    //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    // },
  ],
  // Display articles from your medium or dev account. (Optional)
  blog: {
    // source: 'dev', // medium | dev
    // username: 'arifszn', // to hide blog section, keep it empty
    // limit: 2, // How many articles to display. Max is 10.
  },
  googleAnalytics: {
    id: 'G-SPXQNC1QDT', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: {
    id: '',
    snippetVersion: 6,
  },
  themeConfig: {
    defaultTheme: 'dark',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: true,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'procyon',
    ],

    // Custom theme, applied to `procyon` theme
    customTheme: {
      primary: '#fc055b',
      secondary: '#219aaf',
      accent: '#e8d03a',
      neutral: '#2A2730',
      'base-100': '#E3E3ED',
      '--rounded-box': '3rem',
      '--rounded-btn': '3rem',
    },
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made with <a 
      class="text-primary" href="https://github.com/arifszn/gitprofile"
      target="_blank"
      rel="noreferrer"
    >GitProfile</a> and ❤️`,

  enablePWA: true,
};

export default CONFIG;
