import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AdminUser } from './auth';

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: AdminUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const token = req.cookies.get('admin_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = verifyToken(token);
  
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return handler(req, user);
}