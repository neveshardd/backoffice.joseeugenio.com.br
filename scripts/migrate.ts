import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backoffice.db');
const db = new Database(dbPath);

console.log(`Migrating database at ${dbPath}...`);

try {
  console.log('Adding status column...');
  db.exec('ALTER TABLE projects ADD COLUMN status TEXT');
  console.log('Status column added.');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('Status column already exists.');
  } else {
    console.error('Error adding status column:', error);
  }
}

try {
  console.log('Adding softwares column...');
  db.exec('ALTER TABLE projects ADD COLUMN softwares TEXT');
  console.log('Softwares column added.');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('Softwares column already exists.');
  } else {
    console.error('Error adding softwares column:', error);
  }
}

console.log('Migration complete.');
