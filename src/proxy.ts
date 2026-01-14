import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const allowedOrigins = [
  'https://joseeugenio.com.br',
  'https://www.joseeugenio.com.br',
  'http://localhost:3000',
];

const PUBLIC_FILE = /\.(.*)$/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  // 1. Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 1. Auth logic for database explorer (Always protected)
    if (pathname.startsWith('/api/db')) {
        const session = request.cookies.get('session')?.value;
        if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        try { await decrypt(session); } catch (e) {
            return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
        }
    }

    // 2. Auth logic for internal API (protected except for GET requests for frontend consumption)
    if (pathname.startsWith('/api/') && !pathname.includes('/api/auth') && !pathname.startsWith('/api/db') && request.method !== 'GET') {
        const session = request.cookies.get('session')?.value;
        if (!session) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
        try {
            await decrypt(session);
        } catch (e) {
            return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
        }
    }

    const response = NextResponse.next();
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    }

    return response;
  }

  // 2. Handle Page Authentication
  // Ignore static assets and auth pages
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/auth') ||
    pathname === '/login' ||
    PUBLIC_FILE.test(pathname)
  ) {
    // If logged in and trying to access login page, redirect to home
    if (pathname === '/login') {
        const session = request.cookies.get('session')?.value;
        if (session) {
            try {
                await decrypt(session);
                return NextResponse.redirect(new URL('/', request.url));
            } catch (e) {}
        }
    }
    return NextResponse.next();
  }

  // Protect all other routes
  const session = request.cookies.get('session')?.value;
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await decrypt(session);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
