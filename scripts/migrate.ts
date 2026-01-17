import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backoffice.db');
const db = new Database(dbPath);

console.log(`Migrating database at ${dbPath}...`);

// Helper function to add column if it doesn't exist
function addColumn(table: string, column: string, type: string) {
  try {
    console.log(`Adding ${column} column to ${table}...`);
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    console.log(`${column} column added.`);
  } catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log(`${column} column already exists.`);
    } else {
      console.error(`Error adding ${column} column:`, error);
    }
  }
}

// Ensure all columns exist in projects
addColumn('projects', 'status', 'TEXT');
addColumn('projects', 'softwares', 'TEXT');
addColumn('projects', 'credits', 'TEXT');
addColumn('projects', 'location', 'TEXT');
addColumn('projects', 'year', 'TEXT');
addColumn('projects', 'area', 'TEXT');
addColumn('projects', 'imageAlt', 'TEXT');

console.log('Migration complete.');
