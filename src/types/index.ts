export interface Project {
  id: string; // sqlite uses int but we can cast or stringify, usually easier to handle as number from DB but frontend often uses string. Let's stick to number for ID if sqlite, or string if we want to be consistent with CUIDs/UUIDs if we were generating them (but we are using AUTOINCREMENT defined in db.ts).
  // Actually, better-sqlite3 returns numbers for INTEGER PRIMARY KEY.
  // But my API returns it as part of JSON.
  // I will define it as number | string to be safe, or just number.
  // Let's use number for ID since I used INTEGER PRIMARY KEY.
  title: string;
  description?: string;
  location?: string;
  year?: string;
  area?: string;
  // new fields
  status?: string;
  softwares?: string;
  credits?: string;
  href: string;
  meta: string;
  imageSrc?: string;
  imageAlt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  caption?: string;
  projectId?: number;
  createdAt: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  tags: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkProcessStep {
  id: number;
  num: string;
  title: string;
  description: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface BIMFeature {
  id: number;
  title: string;
  description: string;
}

export interface PageContent {
  sectionKey: string;
  content: any;
  updatedAt: string;
}

export interface TechStackItem {
  id: number;
  category: string;
  categoryNumber: string;
  categoryTitle: string;
  categoryQuote: string;
  toolName: string;
  toolIcon: string;
  toolDescription: string;
  displayOrder: number;
}

export interface ExperienceItem {
  id: number;
  period: string;
  title: string;
  company: string;
  description: string;
  displayOrder: number;
}

export interface EducationItem {
  id: number;
  period: string;
  title: string;
  institution: string;
  description: string;
  displayOrder: number;
}

