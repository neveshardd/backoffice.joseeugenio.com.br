import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM experience ORDER BY displayOrder ASC');
    const items = stmt.all();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { period, title, company, description, displayOrder } = body;
    const stmt = db.prepare(`
      INSERT INTO experience (period, title, company, description, displayOrder) 
      VALUES (@period, @title, @company, @description, @displayOrder)
    `);
    const info = stmt.run({ period, title, company, description, displayOrder: displayOrder || 0 });
    return NextResponse.json({ id: info.lastInsertRowid, ...body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
