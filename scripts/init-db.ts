import db from '../src/lib/db';

console.log('Initializing database...');

const dropProjectsTable = 'DROP TABLE IF EXISTS projects';
const dropGalleryTable = 'DROP TABLE IF EXISTS gallery_images';
const dropServicesTable = 'DROP TABLE IF EXISTS services';

const createProjectTable = `
  CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    year TEXT,
    area TEXT,
    credits TEXT,
    href TEXT NOT NULL UNIQUE,
    meta TEXT NOT NULL,
    imageSrc TEXT,
    imageAlt TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const createGalleryTable = `
  CREATE TABLE IF NOT EXISTS gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    caption TEXT,
    projectId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
  )
`;

const createServicesTable = `
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT,
    icon TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const createWorkProcessTable = `
  CREATE TABLE IF NOT EXISTS work_process (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    num TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const createFAQTable = `
  CREATE TABLE IF NOT EXISTS faq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const createBIMFeaturesTable = `
  CREATE TABLE IF NOT EXISTS bim_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const createPageContentTable = `
  CREATE TABLE IF NOT EXISTS page_content (
    sectionKey TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const createTechStackTable = `
  CREATE TABLE IF NOT EXISTS tech_stack (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    categoryNumber TEXT NOT NULL,
    categoryTitle TEXT NOT NULL,
    categoryQuote TEXT,
    toolName TEXT NOT NULL,
    toolIcon TEXT,
    toolDescription TEXT,
    displayOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const createExperienceTable = `
  CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    displayOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const createEducationTable = `
  CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period TEXT NOT NULL,
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    description TEXT,
    displayOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

try {
  console.log('Dropping existing tables...');
  db.prepare(dropProjectsTable).run();
  db.prepare(dropGalleryTable).run();
  db.prepare(dropServicesTable).run();
  // Note: Not dropping new tables to avoid accidental data loss during dev for now, 
  // or add drops if you want full reset capability. 
  
  console.log('Creating new tables...');
  db.prepare(createProjectTable).run();
  db.prepare(createGalleryTable).run();
  db.prepare(createServicesTable).run();
  db.prepare(createWorkProcessTable).run();
  db.prepare(createFAQTable).run();
  db.prepare(createBIMFeaturesTable).run();
  db.prepare(createPageContentTable).run();
  db.prepare(createTechStackTable).run();
  db.prepare(createExperienceTable).run();
  db.prepare(createEducationTable).run();
  
  console.log('Database initialized successfully.');
} catch (error) {
  console.error('Error initializing database:', error);
}
