export interface Experience {
  company: string;
  position: string;
  from: string;
  to: string;
  companyLink?: string;
}

export interface Education {
  institution: string;
  degree: string;
  from: string;
  to: string;
}

export interface Skill {
  name: string;
  category: 'core' | 'languages' | 'cloud' | 'tools' | 'frameworks' | 'data';
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  image?: string;
  featured?: boolean;
}

export type WatchStatus = 'watching' | 'completed' | 'plan-to-watch' | 'dropped' | 'on-hold';

export interface AnimeEntry {
  title: string;
  titleJp?: string;
  coverImage?: string;
  rating?: number;
  status: WatchStatus;
  episodes?: number;
  notes?: string;
  url?: string;
}

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  github?: string;
  email?: string;
  website?: string;
  twitter?: string;
}
