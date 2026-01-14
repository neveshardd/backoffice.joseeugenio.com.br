import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  try {
    if (key) {
      const stmt = db.prepare('SELECT * FROM page_content WHERE sectionKey = ?');
      const data = stmt.get(key) as { content: string, sectionKey: string } | undefined;
      if (data) {
        return NextResponse.json({ ...data, content: JSON.parse(data.content) });
      }
      return NextResponse.json({});
    } else {
        const stmt = db.prepare('SELECT * FROM page_content');
        const all = stmt.all();
        return NextResponse.json(all.map((r: any) => ({ ...r, content: JSON.parse(r.content) })));
    }
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, content } = body;

    const stmt = db.prepare(`
      INSERT INTO page_content (sectionKey, content, updatedAt)
      VALUES (@key, @content, CURRENT_TIMESTAMP)
      ON CONFLICT(sectionKey) DO UPDATE SET
        content = excluded.content,
        updatedAt = CURRENT_TIMESTAMP
    `);

    stmt.run({ key, content: JSON.stringify(content) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
