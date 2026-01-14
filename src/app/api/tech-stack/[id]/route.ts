import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { category, categoryNumber, categoryTitle, categoryQuote, toolName, toolIcon, toolDescription, displayOrder } = body;
    const stmt = db.prepare(`
      UPDATE tech_stack SET 
        category=@category, 
        categoryNumber=@categoryNumber, 
        categoryTitle=@categoryTitle, 
        categoryQuote=@categoryQuote, 
        toolName=@toolName, 
        toolIcon=@toolIcon, 
        toolDescription=@toolDescription, 
        displayOrder=@displayOrder 
      WHERE id=@id
    `);
    stmt.run({ id, category, categoryNumber, categoryTitle, categoryQuote, toolName, toolIcon, toolDescription, displayOrder });
    return NextResponse.json({ id, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    db.prepare('DELETE FROM tech_stack WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
