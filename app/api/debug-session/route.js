import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = cookies();
  const all = cookieStore.getAll().map(c => c.name);

  const tokenCookie =
    cookieStore.get('__Secure-next-auth.session-token') ||
    cookieStore.get('next-auth.session-token');

  let decoded = null;
  let jwtError = null;

  if (tokenCookie?.value) {
    try {
      decoded = jwt.verify(tokenCookie.value, process.env.NEXTAUTH_SECRET);
    } catch (e) {
      jwtError = e.message;
    }
  }

  return NextResponse.json({
    allCookieNames: all,
    hasSessionCookie: !!tokenCookie,
    cookieName: tokenCookie?.name || null,
    decoded: decoded ? { id: decoded.id, name: decoded.name, email: decoded.email } : null,
    jwtError,
    secretSet: !!process.env.NEXTAUTH_SECRET,
    secretFirst10: process.env.NEXTAUTH_SECRET?.slice(0, 10),
  });
}
