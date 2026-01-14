import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Get all images, grouping by URL to avoid duplicates (since images can be linked to multiple projects or exist as standalone)
    const stmt = db.prepare('SELECT * FROM gallery_images GROUP BY url ORDER BY createdAt DESC');
    const images = stmt.all();

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
