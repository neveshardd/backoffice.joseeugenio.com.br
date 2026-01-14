import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'https://joseeugenio.com.br',
  'https://www.joseeugenio.com.br',
  'http://localhost:3000',
];

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
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

    const response = NextResponse.next();
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
