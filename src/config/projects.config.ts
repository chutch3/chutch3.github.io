import type { Project } from '@/types';

export const projects: Project[] = [
  {
    title: 'Hubitat Device Refresher',
    description:
      'A Hubitat app that automatically refreshes the status of selected Z-Wave devices on a user-defined schedule. Ideal for keeping device states up-to-date and avoiding stale readings. Supports both simple interval selection and advanced cron expressions.',
    tech: ['Groovy', 'Hubitat', 'Z-Wave'],
    link: 'https://gist.github.com/chutch3/2662014539066e1219280678ec9d5169',
    featured: true,
  },
];
