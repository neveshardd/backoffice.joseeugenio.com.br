import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username) as any;

    // Simples comparação de string para este caso, conforme solicitado
    if (user && user.password === password) {
      await login({ userId: user.id, username: user.username });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
