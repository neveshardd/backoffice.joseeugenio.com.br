import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backoffice.db');
const db = new Database(dbPath);

console.log(`Migrating about/profile tables at ${dbPath}...`);

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
  console.log('Creating tech_stack table...');
  db.exec(createTechStackTable);
  
  console.log('Creating experience table...');
  db.exec(createExperienceTable);
  
  console.log('Creating education table...');
  db.exec(createEducationTable);
  
  console.log('Migration complete.');
} catch (error) {
  console.error('Error migrating tables:', error);
}
