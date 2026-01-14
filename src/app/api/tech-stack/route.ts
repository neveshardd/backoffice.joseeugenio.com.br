import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM tech_stack ORDER BY category, displayOrder ASC');
    const items = stmt.all();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, categoryNumber, categoryTitle, categoryQuote, toolName, toolIcon, toolDescription, displayOrder } = body;
    const stmt = db.prepare(`
      INSERT INTO tech_stack (category, categoryNumber, categoryTitle, categoryQuote, toolName, toolIcon, toolDescription, displayOrder) 
      VALUES (@category, @categoryNumber, @categoryTitle, @categoryQuote, @toolName, @toolIcon, @toolDescription, @displayOrder)
    `);
    const info = stmt.run({ category, categoryNumber, categoryTitle, categoryQuote, toolName, toolIcon, toolDescription, displayOrder: displayOrder || 0 });
    return NextResponse.json({ id: info.lastInsertRowid, ...body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
