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
  )
`);

export default db;
