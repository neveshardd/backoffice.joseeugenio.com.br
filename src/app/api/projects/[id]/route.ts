import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    const project = stmt.get(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      UPDATE projects SET 
        title = @title,
        description = @description,
        location = @location,
        year = @year,
        area = @area,
        status = @status,
        softwares = @softwares,
        credits = @credits,
        href = @href,
        meta = @meta,
        imageSrc = @imageSrc,
        imageAlt = @imageAlt,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = @id
    `);

    stmt.run({
      id,
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

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
