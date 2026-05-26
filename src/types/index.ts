export type CompanyStage = 'Series A' | 'Series B' | 'Unicorn' | 'Acquired' | 'Fortune 50' | 'Public';

export interface Experience {
  company: string;
  position: string;
  from: string;
  to: string;
  companyLink?: string;
  stage?: CompanyStage;
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
  github?: string;
  email?: string;
  website?: string;
}
