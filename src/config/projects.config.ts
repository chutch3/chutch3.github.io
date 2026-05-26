import type { Project } from '@/types';

export const projects: Project[] = [
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
];
