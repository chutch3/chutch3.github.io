import type {
  Experience,
  Education,
  Skill,
  SocialLinks,
  Project,
  AnimeEntry,
} from '@/types';

export const siteConfig = {
  // ─── Identity ────────────────────────────────────────────
  name: 'Cody Hutchens',
  title: 'Senior ML Engineer',
  tagline:
    'Building intelligent systems. Advocating for data privacy. Watching too much anime.',
  jpTagline: '機械学習エンジニア',
  initials: 'CH',

  // ─── Social & Contact ────────────────────────────────────
  social: {
    linkedin: 'codyhutchens',
    github: 'chutch3',
    email: 'chutchens91@gmail.com',
    website: 'https://www.codyhutchens.com',
  } satisfies SocialLinks,

  resume: {
    url: 'https://drive.google.com/file/d/12vNYbanOX12RX-eF0EZohyb02Wyobmnx/view?usp=sharing',
  },

  // ─── SEO ─────────────────────────────────────────────────
  seo: {
    title: 'Cody Hutchens',
    description:
      'Senior ML Engineer — builds intelligent systems, writes about data privacy, watches too much anime.',
    url: 'https://codyhutchens.com',
  },

  // ─── Analytics ───────────────────────────────────────────
  goatcounter: {
    siteCode: 'chutch3-portfolio',
  },

  // ─── Homelab Status ───────────────────────────────────────
  homelab: {
    statusUrl: '',
  },

  // ─── Features (toggle on/off) ────────────────────────────
  features: {
    mascot: true,
    easterEggs: true,
    scanlines: true,
    blogPage: true,
    animePage: true,
    privacyPage: true,
    homelabPage: true,
  },

  // ─── Section Labels ──────────────────────────────────────
  sections: {
    about: { title: 'About', jp: '自己紹介' },
    resume: { title: 'Resume', jp: '履歴書' },
    projects: { title: 'Projects', jp: 'プロジェクト' },
    blog: { title: 'Blog', jp: 'ブログ' },
    anime: { title: 'Watchlist', jp: 'アニメリスト' },
    homelab: { title: 'Homelab', jp: 'ホームラボ' },
    privacy: { title: 'Data Privacy', jp: 'データプライバシー' },
  },

  // ─── About Page ──────────────────────────────────────────
  about: {
    paragraphs: [
      'ML engineer at <a href="https://www.smarterdx.com/" target="_blank" rel="noreferrer" class="text-cyber-cyan hover:neon-cyan transition-all">SmarterDx</a>, where I work on LLM-powered clinical AI. Before that — Perennial, Ontra, Drizly, and a long run at Humana. Georgia Tech MS in CS (ML). I\'ve spent the last decade building ML systems end-to-end, and the current wave of LLMs and agentic tooling is the most interesting this work has ever been.',
      'I think a lot about <span class="text-cyber-pink">data privacy</span> — especially now that LLMs are vacuuming up data at a scale we\'ve never seen. How we build these systems matters.',
      'Outside of work I run a <a href="https://github.com/chutch3/homelab" target="_blank" rel="noreferrer" class="text-cyber-cyan hover:neon-cyan transition-all">homelab</a>, build side projects with <a href="https://github.com/chutch3/real-estate-agent-tools" target="_blank" rel="noreferrer" class="text-cyber-cyan hover:neon-cyan transition-all">LLM agents</a>, and watch a probably unhealthy amount of anime.',
    ],
    interests: ['ml', 'data_privacy', 'anime', 'homelab', 'open_source'],
  },

  // ─── Data Privacy Page ───────────────────────────────────
  privacy: {
    paragraphs: [
      "As an ML engineer, I see firsthand how data powers the systems we build — and how easily the people behind that data can be forgotten. Data privacy isn't just a compliance checkbox. It's a question of respect.",
      "Every model trained, every pipeline deployed, every feature engineered starts with someone's information. I believe we have a responsibility to treat that data with care — to minimize collection, to be transparent about usage, and to give people meaningful control over their own information.",
    ],
    concerns: [
      'Data minimization — collect only what you need',
      'Transparency in ML systems and training data provenance',
      'Right to deletion and meaningful user consent',
      'Privacy-preserving ML techniques (federated learning, differential privacy)',
      'Fighting the normalization of surveillance capitalism',
    ],
    footer:
      'More thoughts on this topic coming soon in the blog section. This is something I want to write more about.',
  },

  // ─── Skills ──────────────────────────────────────────────
  skills: [
    { name: 'Python', category: 'languages' },
    { name: 'TypeScript', category: 'languages' },
    { name: 'SQL', category: 'languages' },
    { name: 'Machine Learning', category: 'core' },
    { name: 'LLMs', category: 'core' },
    { name: 'Agentic Systems', category: 'core' },
    { name: 'RAG', category: 'core' },
    { name: 'Tensorflow', category: 'core' },
    { name: 'Pytorch', category: 'core' },
    { name: 'XGBoost', category: 'core' },
    { name: 'LightGBM', category: 'core' },
    { name: 'Reinforcement Learning', category: 'core' },
    { name: 'Pandas', category: 'data' },
    { name: 'Numpy', category: 'data' },
    { name: 'BigQuery', category: 'data' },
    { name: 'PostGIS', category: 'data' },
    { name: 'Postgres', category: 'data' },
    { name: 'Redis', category: 'data' },
    { name: 'Earth Engine', category: 'data' },
    { name: 'Xarray', category: 'data' },
    { name: 'GCP', category: 'cloud' },
    { name: 'AWS', category: 'cloud' },
    { name: 'FastAPI', category: 'frameworks' },
    { name: 'Metaflow', category: 'frameworks' },
    { name: 'Flyte', category: 'frameworks' },
    { name: 'SQLAlchemy', category: 'frameworks' },
    { name: 'Docker', category: 'tools' },
    { name: 'Kubernetes', category: 'tools' },
    { name: 'Terraform', category: 'tools' },
    { name: 'Terragrunt', category: 'tools' },
    { name: 'Dagster', category: 'tools' },
    { name: 'Airflow', category: 'tools' },
    { name: 'Git', category: 'tools' },
    { name: 'GitHub Actions', category: 'tools' },
    { name: 'GitLab CI/CD', category: 'tools' },
    { name: 'Pytest', category: 'tools' },
    { name: 'Ansible', category: 'tools' },
  ] satisfies Skill[],

  // ─── Experience ──────────────────────────────────────────
  experiences: [
    {
      company: 'SmarterDx',
      position: 'Senior Machine Learning Engineer',
      from: 'July 2025',
      to: 'Present',
      companyLink: 'https://www.smarterdx.com/',
      stage: 'Unicorn',
      summary:
        'LLM-powered clinical AI for hospital revenue integrity and quality reporting.',
    },
    {
      company: 'Perennial',
      position: 'Senior Machine Learning Engineer II',
      from: 'February 2023',
      to: 'July 2025',
      companyLink: 'https://www.perennial.earth/',
      stage: 'Series A',
      summary:
        'Soil carbon estimation at global scale — feature engineering, distributed training, GCP infra.',
    },
    {
      company: 'Ontra',
      position: 'Senior Machine Learning Engineer',
      from: 'August 2022',
      to: 'February 2023',
      companyLink: 'https://www.ontra.ai/',
      stage: 'Series B',
      summary:
        'ML model gateway and async serving stack for legal document AI.',
    },
    {
      company: 'Drizly',
      position: 'Senior Machine Learning Engineer',
      from: 'August 2021',
      to: 'June 2022',
      companyLink: 'https://drizly.com/',
      stage: 'Acquired',
      summary:
        'Contextual multi-armed bandit for shelf optimization and conversion.',
    },
    {
      company: 'Humana',
      position: 'Lead Machine Learning Engineer',
      from: 'November 2012',
      to: 'August 2021',
      companyLink: 'https://www.humana.com/',
      stage: 'Fortune 50',
      summary:
        'Deep learning for cost transparency, experimentation platform, TensorFlow in production.',
    },
  ] satisfies Experience[],

  // ─── Education ───────────────────────────────────────────
  educations: [
    {
      institution: 'Georgia Institute of Technology',
      degree:
        'Master of Science — Computer Science, Specialization in Machine Learning',
      from: '2018',
      to: '2021',
    },
    {
      institution: 'Indiana University Southeast',
      degree: 'Bachelor of Science — Computer Science, Information Systems',
      from: '2009',
      to: '2013',
    },
  ] satisfies Education[],

  // ─── Projects ────────────────────────────────────────────
  projects: [
    {
      title: 'Homelab',
      description:
        'Turn spare hardware into a production-grade cluster. Ansible playbooks for Docker Swarm, Traefik, and 30+ self-hosted services with automated provisioning, DNS, and SSL.',
      tech: ['Ansible', 'Docker Swarm', 'Traefik', 'Taskfile', 'Python'],
      github: 'https://github.com/chutch3/homelab',
      featured: true,
    },
    {
      title: 'Real Estate Agent Tools',
      description:
        'A self-service platform for real estate agents and brokerages, using LLMs and modern tooling to reduce manual work across the deal lifecycle.',
      tech: ['Python', 'LLMs', 'FastAPI'],
      github: 'https://github.com/chutch3/real-estate-agent-tools',
    },
    {
      title: 'Tranga (Fork)',
      description:
        'Improvements to Tranga — a manga monitoring and download tool. Contributions include async connector refactoring, worker concurrency improvements, search relevance fixes, and migration hardening.',
      tech: ['C#', 'Docker', '.NET'],
      github: 'https://github.com/chutch3/tranga',
    },
  ] satisfies Project[],

  // ─── Anime Watchlist ─────────────────────────────────────
  anime: [
    {
      title: 'Jujutsu Kaisen',
      titleJp: '呪術廻戦',
      status: 'watching',
      url: 'https://myanimelist.net/anime/40748/Jujutsu_Kaisen',
    },
    {
      title: 'Re:ZERO -Starting Life in Another World-',
      titleJp: 'Re:ゼロから始める異世界生活',
      status: 'watching',
      url: 'https://myanimelist.net/anime/31240/Re_Zero_kara_Hajimeru_Isekai_Seikatsu',
    },
    {
      title: 'Fairy Tail',
      titleJp: 'フェアリーテイル',
      status: 'watching',
      url: 'https://myanimelist.net/anime/6702/Fairy_Tail',
    },
    {
      title: 'Freezing',
      titleJp: 'フリージング',
      status: 'watching',
      url: 'https://myanimelist.net/anime/9367/Freezing',
    },
    {
      title: 'X',
      titleJp: 'X',
      status: 'watching',
      url: 'https://myanimelist.net/anime/156/X',
    },
    {
      title: 'Gachiakuta',
      titleJp: 'ガチアクタ',
      status: 'watching',
      url: 'https://myanimelist.net/anime/58498/Gachiakuta',
    },
    {
      title: "Frieren: Beyond Journey's End",
      titleJp: '葬送のフリーレン',
      status: 'watching',
      url: 'https://myanimelist.net/anime/52991/Sousou_no_Frieren',
    },
    {
      title: 'GANTZ',
      titleJp: 'ガンツ',
      status: 'watching',
      url: 'https://myanimelist.net/anime/384/Gantz',
    },
    {
      title: 'The Future Diary',
      titleJp: '未来日記',
      status: 'watching',
      url: 'https://myanimelist.net/anime/10620/Mirai_Nikki',
    },
    {
      title: 'Astra Lost in Space',
      titleJp: '彼方のアストラ',
      status: 'watching',
      url: 'https://myanimelist.net/anime/39198/Kanata_no_Astra',
    },
    {
      title: 'Junji Ito Collection',
      titleJp: '伊藤潤二コレクション',
      status: 'watching',
      url: 'https://myanimelist.net/anime/36124/Ito_Junji__Collection',
    },
    {
      title: 'Hellsing Ultimate',
      titleJp: 'ヘルシング',
      status: 'watching',
      url: 'https://myanimelist.net/anime/777/Hellsing_Ultimate',
    },
    {
      title: 'Deadman Wonderland',
      titleJp: 'デッドマンワンダーランド',
      status: 'watching',
      url: 'https://myanimelist.net/anime/6793/Deadman_Wonderland',
    },
    {
      title: 'One Punch Man',
      titleJp: 'ワンパンマン',
      status: 'watching',
      url: 'https://myanimelist.net/anime/30276/One_Punch_Man',
    },
    {
      title: 'Undead Unluck',
      titleJp: 'アンデッドアンラック',
      rating: 5,
      status: 'watching',
      url: 'https://myanimelist.net/anime/54573/Undead_Unluck',
    },
    {
      title: 'Ergo Proxy',
      titleJp: 'エルゴプラクシー',
      status: 'watching',
      url: 'https://myanimelist.net/anime/790/Ergo_Proxy',
    },
    {
      title: 'DanDaDan',
      titleJp: 'ダンダダン',
      rating: 10,
      status: 'completed',
      url: 'https://myanimelist.net/anime/57334/Dandadan',
    },
    {
      title: 'Attack on Titan',
      titleJp: '進撃の巨人',
      rating: 10,
      status: 'completed',
      url: 'https://myanimelist.net/anime/16498/Shingeki_no_Kyojin',
    },
    {
      title: 'Seven Deadly Sins',
      titleJp: '七つの大罪',
      rating: 7,
      status: 'completed',
      url: 'https://myanimelist.net/anime/23755/Nanatsu_no_Taizai',
    },
    {
      title: 'Neon Genesis Evangelion',
      titleJp: '新世紀エヴァンゲリオン',
      rating: 10,
      status: 'completed',
      url: 'https://myanimelist.net/anime/30/Neon_Genesis_Evangelion',
    },
    {
      title: 'Mashle: Magic and Muscles',
      titleJp: 'マッシュル',
      rating: 10,
      status: 'completed',
      url: 'https://myanimelist.net/anime/52211/Mashle',
    },
    {
      title: 'Clevatess',
      titleJp: 'クレバテス',
      rating: 10,
      status: 'completed',
      url: 'https://myanimelist.net/anime/56888/Clevatess',
    },
    {
      title: 'My Hero Academia',
      titleJp: '僕のヒーローアカデミア',
      status: 'completed',
      url: 'https://myanimelist.net/anime/31964/Boku_no_Hero_Academia',
    },
    {
      title: "Hell's Paradise",
      titleJp: '地獄楽',
      status: 'completed',
      url: 'https://myanimelist.net/anime/46569/Jigokuraku',
    },
    {
      title: 'SPY x FAMILY',
      titleJp: 'スパイファミリー',
      status: 'completed',
      url: 'https://myanimelist.net/anime/50265/Spy_x_Family',
    },
    {
      title: 'Berserk',
      titleJp: 'ベルセルク',
      status: 'completed',
      url: 'https://myanimelist.net/anime/33/Kenpuu_Denki_Berserk',
    },
    {
      title: 'Code Geass',
      titleJp: 'コードギアス',
      status: 'completed',
      url: 'https://myanimelist.net/anime/1575/Code_Geass',
    },
    {
      title: 'Mob Psycho 100',
      titleJp: 'モブサイコ100',
      status: 'completed',
      url: 'https://myanimelist.net/anime/32182/Mob_Psycho_100',
    },
    {
      title: 'Parasyte: The Maxim',
      titleJp: '寄生獣 セイの格率',
      rating: 10,
      status: 'completed',
      url: 'https://myanimelist.net/anime/22535/Kiseijuu__Sei_no_Kakuritsu',
    },
    {
      title: 'The Promised Neverland',
      titleJp: '約束のネバーランド',
      rating: 10,
      status: 'completed',
      url: 'https://myanimelist.net/anime/37779/Yakusoku_no_Neverland',
    },
    {
      title: 'Vinland Saga',
      titleJp: 'ヴィンランド・サガ',
      rating: 8,
      status: 'completed',
      url: 'https://myanimelist.net/anime/37521/Vinland_Saga',
    },
    {
      title: 'Seven Mortal Sins',
      titleJp: '七つの大罪',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/33834/Sin__Nanatsu_no_Taizai',
    },
    {
      title: 'SHIMONETA',
      titleJp: '下ネタという概念が存在しない退屈な世界',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/29786/Shimoneta',
    },
    {
      title: 'Fate/stay night: Unlimited Blade Works',
      titleJp: 'フェイト/ステイナイト',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/22297/Fate_stay_night__Unlimited_Blade_Works',
    },
    {
      title: 'Blue Exorcist',
      titleJp: '青の祓魔師',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/9919/Ao_no_Exorcist',
    },
    {
      title: 'Steins;Gate 0',
      titleJp: 'シュタインズ・ゲート ゼロ',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/30484/Steins_Gate_0',
    },
    {
      title: 'STEINS;GATE',
      titleJp: 'シュタインズ・ゲート',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/9253/Steins_Gate',
    },
    {
      title: 'Log Horizon',
      titleJp: 'ログ・ホライズン',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/17265/Log_Horizon',
    },
    {
      title: 'Tales of Wedding Rings',
      titleJp: '結婚指輪物語',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/53572/Kekkon_Yubiwa_Monogatari',
    },
    {
      title: 'Cowboy Bebop',
      titleJp: 'カウボーイビバップ',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/1/Cowboy_Bebop',
    },
    {
      title: 'Gungrave',
      titleJp: 'ガングレイヴ',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/267/Gungrave',
    },
    {
      title: 'The Case Study of Vanitas',
      titleJp: 'ヴァニタスの手記',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/48580/Vanitas_no_Carte',
    },
    {
      title: 'Kingdom',
      titleJp: 'キングダム',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/12031/Kingdom',
    },
    {
      title: 'Lord of Mysteries',
      titleJp: '诡秘之主',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/59539/Guimi_zhi_Zhu',
    },
    {
      title: 'Fire Force',
      titleJp: '炎炎ノ消防隊',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/38671/Enen_no_Shouboutai',
    },
    {
      title: 'Soul Eater',
      titleJp: 'ソウルイーター',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/3588/Soul_Eater',
    },
    {
      title: 'Kaguya-sama: Love Is War',
      titleJp: 'かぐや様は告らせたい',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/37999/Kaguya-sama_wa_Kokurasetai',
    },
    {
      title: 'Black Lagoon',
      titleJp: 'ブラックラグーン',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/889/Black_Lagoon',
    },
    {
      title: 'Assassination Classroom',
      titleJp: '暗殺教室',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/24833/Ansatsu_Kyoushitsu',
    },
    {
      title: 'Tokyo Ghoul',
      titleJp: '東京喰種',
      status: 'plan-to-watch',
      url: 'https://myanimelist.net/anime/22319/Tokyo_Ghoul',
    },
  ] satisfies AnimeEntry[],
};
