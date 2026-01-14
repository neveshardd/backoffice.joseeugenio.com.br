import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // List all user tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[];
    
    const tableSchemas = tables.map(table => {
      const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
      return {
        name: table.name,
        columns: columns.map((col: any) => ({
          name: col.name,
          type: col.type,
          notnull: col.notnull,
          pk: col.pk,
          default: col.dflt_value
        }))
      };
    });

    return NextResponse.json(tableSchemas);
  } catch (error) {
    console.error('Error fetching table list:', error);
    return NextResponse.json({ error: 'Failed to fetch database schema' }, { status: 500 });
  }
}
