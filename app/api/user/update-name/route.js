import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request) {
  try {
    // Step 1: Read the NextAuth JWT cookie directly
    const cookieStore = cookies();

    // NextAuth stores JWT in this cookie name
    const tokenCookie =
      cookieStore.get('__Secure-next-auth.session-token') ||
      cookieStore.get('next-auth.session-token');

    if (!tokenCookie?.value) {
      console.error('No session cookie found');
      return NextResponse.json(
        { success: false, message: 'No session found. Please log in again.' },
        { status: 401 }
      );
    }

    // Step 2: Verify and decode the JWT using the shared secret
    let decoded;
    try {
      decoded = jwt.verify(tokenCookie.value, process.env.NEXTAUTH_SECRET);
    } catch (jwtErr) {
      console.error('JWT verify failed:', jwtErr.message);
      return NextResponse.json(
        { success: false, message: 'Session expired. Please log in again.' },
        { status: 401 }
      );
    }

    // Step 3: Extract user ID from the decoded token
    const userId = decoded?.id || decoded?.sub;

    if (!userId) {
      console.error('No user ID in token:', JSON.stringify(decoded));
      return NextResponse.json(
        { success: false, message: 'Invalid session token.' },
        { status: 401 }
      );
    }

    // Step 4: Validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid request format.' },
        { status: 400 }
      );
    }

    const { displayName } = body;

    if (!displayName?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name cannot be empty.' },
        { status: 400 }
      );
    }

    if (displayName.trim().length > 40) {
      return NextResponse.json(
        { success: false, message: 'Name must be 40 characters or less.' },
        { status: 400 }
      );
    }

    // Step 5: Update in MongoDB
    await connectDB();

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { name: displayName.trim() } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'User not found in database.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, name: updated.name });

  } catch (err) {
    console.error('update-name error:', err.message, err.stack);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
