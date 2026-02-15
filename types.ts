
export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  school: string;
  degree: string;
  year: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

export enum Theme {
  Minimalist = 'Minimalist',
  Developer = 'Developer',
  Creative = 'Creative',
  BentoGrid = 'BentoGrid',
  Glassmorphism = 'Glassmorphism',
  Cyberpunk = 'Cyberpunk',
  ClassicSerif = 'ClassicSerif',
  ResumeFirst = 'ResumeFirst',
  Brutalist = 'Brutalist',
  Nature = 'Nature',
}

export interface ThemeColors {
  primary: string;
  secondary: string;
}

export interface PortfolioState {
  resumeData: ResumeData | null;
  theme: Theme;
  isGenerating: boolean;
  error: string | null;
}

export enum DeployStep {
  IDLE = 'IDLE',
  CONNECT_GITHUB = 'CONNECT_GITHUB',
  CONNECT_VERCEL = 'CONNECT_VERCEL',
  CONFIG_REPO = 'CONFIG_REPO',
  DEPLOYING = 'DEPLOYING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface DeployState {
  step: DeployStep;
  githubUsername: string | null;
  vercelUsername: string | null;
  repoName: string;
  deploymentUrl: string | null;
  error: string | null;
}
