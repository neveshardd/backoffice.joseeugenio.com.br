import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { period, title, company, description, displayOrder } = body;
    const stmt = db.prepare(`
      UPDATE experience SET 
        period=@period, 
        title=@title, 
        company=@company, 
        description=@description, 
        displayOrder=@displayOrder 
      WHERE id=@id
    `);
    stmt.run({ id, period, title, company, description, displayOrder });
    return NextResponse.json({ id, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    db.prepare('DELETE FROM experience WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
