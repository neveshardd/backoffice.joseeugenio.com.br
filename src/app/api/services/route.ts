import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM services ORDER BY createdAt DESC');
    const services = stmt.all();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, tags, icon } = body;

    const stmt = db.prepare(`
      INSERT INTO services (title, description, tags, icon, updatedAt)
      VALUES (@title, @description, @tags, @icon, CURRENT_TIMESTAMP)
    `);

    const info = stmt.run({ title, description, tags, icon });

    return NextResponse.json({ id: info.lastInsertRowid, ...body }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
