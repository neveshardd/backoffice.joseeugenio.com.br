import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    let images;
    if (projectId) {
      const stmt = db.prepare('SELECT * FROM gallery_images WHERE projectId = ? ORDER BY createdAt ASC');
      images = stmt.all(projectId);
    } else {
      const stmt = db.prepare('SELECT * FROM gallery_images ORDER BY createdAt DESC');
      images = stmt.all();
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, caption, projectId } = body;

    const stmt = db.prepare(`
      INSERT INTO gallery_images (url, caption, projectId, createdAt)
      VALUES (@url, @caption, @projectId, datetime('now'))
    `);

    const info = stmt.run({ url, caption, projectId });

    return NextResponse.json({ 
      id: info.lastInsertRowid, 
      url, 
      caption, 
      projectId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    // Handling delete via query param or body, but better REST is /api/gallery/[id]
    // However, for simplicity here let's allow finding by ID passed in body or search params if we want a single route file
    // But typically DELETE is on the resource URL.
    // Let's implement DELETE here expecting an ID in the body for simplicity or just use the [id] route pattern for gallery too.
    // Actually, I'll allow passing ID in payload for this generic endpoint or create [id] route.
    // Let's create `api/gallery/[id]/route.ts` instead for DELETE.
    // So this file will only be POST.
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
