import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backoffice.db');
const db = new Database(dbPath);

console.log(`Migrating services table at ${dbPath}...`);

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

try {
  console.log('Creating services table...');
  db.exec(createServicesTable);
  console.log('Services table created.');
} catch (error) {
  console.error('Error creating services table:', error);
}

console.log('Migration complete.');
