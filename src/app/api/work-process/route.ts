import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM work_process ORDER BY num ASC');
    const items = stmt.all();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { num, title, description } = body;
    const stmt = db.prepare('INSERT INTO work_process (num, title, description) VALUES (@num, @title, @description)');
    const info = stmt.run({ num, title, description });
    return NextResponse.json({ id: info.lastInsertRowid, ...body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
