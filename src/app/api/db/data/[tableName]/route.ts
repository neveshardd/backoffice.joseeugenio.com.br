import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tableName: string }> }
) {
  const { tableName } = await params;
  try {
    const data = db.prepare(`SELECT * FROM ${tableName}`).all();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Table not found' }, { status: 404 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tableName: string }> }
) {
  const { tableName } = await params;
  try {
    const body = await request.json();
    const keys = Object.keys(body);
    const values = Object.values(body);
    
    if (keys.length === 0) throw new Error('No data provided');

    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.join(', ');

    const stmt = db.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`);
    const info = stmt.run(...values);

    return NextResponse.json({ id: info.lastInsertRowid, ...body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tableName: string }> }
) {
  const { tableName } = await params;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    // Try primary key 'id' as default
    db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ tableName: string }> }
) {
  const { tableName } = await params;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    const body = await request.json();
    const keys = Object.keys(body).filter(k => k !== 'id');
    const values = keys.map(k => body[k]);
    
    const setClause = keys.map(k => `${k} = ?`).join(', ');

    const stmt = db.prepare(`UPDATE ${tableName} SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);

    return NextResponse.json({ success: true, ...body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
