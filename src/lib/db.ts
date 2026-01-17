import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backoffice.db');

const db = new Database(dbPath);

// Initialize database with tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    year TEXT,
    area TEXT,
    status TEXT,
    softwares TEXT,
    credits TEXT,
    href TEXT NOT NULL UNIQUE,
    meta TEXT NOT NULL,
    imageSrc TEXT,
    imageAlt TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS page_content (
    sectionKey TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    caption TEXT,
    projectId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    icon TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS work_process (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    num TEXT,
    title TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS faq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    answer TEXT
  );

  CREATE TABLE IF NOT EXISTS bim_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS tech_stack (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    categoryNumber TEXT,
    categoryTitle TEXT,
    categoryQuote TEXT,
    toolName TEXT,
    toolIcon TEXT,
    toolDescription TEXT,
    displayOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period TEXT,
    title TEXT,
    company TEXT,
    description TEXT,
    displayOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period TEXT,
    title TEXT,
    institution TEXT,
    description TEXT,
    displayOrder INTEGER DEFAULT 0
  );
`);

export default db;
