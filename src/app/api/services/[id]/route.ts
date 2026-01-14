import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, tags, icon } = body;

    const stmt = db.prepare(`
      UPDATE services SET
        title = @title,
        description = @description,
        tags = @tags,
        icon = @icon,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = @id
    `);

    stmt.run({ id, title, description, tags, icon });

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stmt = db.prepare('DELETE FROM services WHERE id = ?');
    stmt.run(id);
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
