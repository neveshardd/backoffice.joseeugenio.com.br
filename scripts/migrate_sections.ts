import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backoffice.db');
const db = new Database(dbPath);

console.log(`Migrating additional services tables at ${dbPath}...`);

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

// Key-Value store for singleton sections (Hero, CTA, BIM Intro)
const createPageContentTable = `
  CREATE TABLE IF NOT EXISTS page_content (
    sectionKey TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

try {
  console.log('Creating work_process table...');
  db.exec(createWorkProcessTable);
  
  console.log('Creating faq table...');
  db.exec(createFAQTable);
  
  console.log('Creating bim_features table...');
  db.exec(createBIMFeaturesTable);
  
  console.log('Creating page_content table...');
  db.exec(createPageContentTable);
  
  console.log('Migration complete.');
} catch (error) {
  console.error('Error migrating tables:', error);
}
