import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC');
    const projects = stmt.all();
    
    // Convert isPlaceholder from 0/1 to boolean
    const formattedProjects = projects.map((p: any) => ({
      ...p,
      isPlaceholder: Boolean(p.isPlaceholder),
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      location,
      year,
      area,
      status,
      softwares,
      credits,
      href,
      meta,
      imageSrc,
      imageAlt
    } = body;

    const stmt = db.prepare(`
      INSERT INTO projects (
        title, description, location, year, area, status, softwares, credits, 
        href, meta, imageSrc, imageAlt, 
        updatedAt
      ) VALUES (
        @title, @description, @location, @year, @area, @status, @softwares, @credits,
        @href, @meta, @imageSrc, @imageAlt, 
        CURRENT_TIMESTAMP
      )
    `);

    const info = stmt.run({
      title,
      description,
      location,
      year,
      area,
      status,
      softwares,
      credits,
      href: href || `/projetos/${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      meta,
      imageSrc,
      imageAlt
    });

    return NextResponse.json({ id: info.lastInsertRowid, ...body }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
