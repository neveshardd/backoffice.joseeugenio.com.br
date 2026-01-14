import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string || '';
    const projectId = formData.get('projectId') as string || null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
    
    // Ensure uploads dir exists (safe check)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // ignore if exists
    }
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;

    // Save to DB
    const stmt = db.prepare(`
      INSERT INTO gallery_images (url, caption, projectId, createdAt)
      VALUES (@url, @caption, @projectId, datetime('now'))
    `);

    const info = stmt.run({ 
      url, 
      caption, 
      projectId: projectId ? Number(projectId) : null 
    });

    return NextResponse.json({ 
      id: info.lastInsertRowid, 
      url, 
      caption, 
      projectId: projectId ? Number(projectId) : null 
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
