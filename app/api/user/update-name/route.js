import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request) {
  try {
    // Step 1: Read the NextAuth JWT cookie directly from request
    const cookieHeader = request.headers.get('cookie') || '';
    
    // Parse cookies from header
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = value;
      }
    });

    // NextAuth stores JWT in this cookie name
    const tokenValue = cookies['__Secure-next-auth.session-token'] || cookies['next-auth.session-token'];

    if (!tokenValue) {
      console.error('No session cookie found');
      return NextResponse.json(
        { success: false, message: 'No session found. Please log in again.' },
        { status: 401 }
      );
    }

    // Step 2: Verify and decode the JWT using the shared secret
    let decoded;
    try {
      decoded = jwt.verify(tokenValue, process.env.NEXTAUTH_SECRET);
    } catch (jwtErr) {
      console.error('JWT verify failed:', jwtErr.message);
      return NextResponse.json(
        { success: false, message: 'Session expired. Please log in again.' },
        { status: 401 }
      );
    }

    // Step 3: Extract user ID from the decoded token
    let userId = decoded?.id || decoded?.sub;

    // Fallback: try headers if cookie didn't work
    if (!userId) {
      const headerUserId = request.headers.get('x-user-id');
      const headerUserEmail = request.headers.get('x-user-email');

      if (headerUserEmail) {
        await connectDB();
        const userByEmail = await User.findOne({ email: headerUserEmail });
        if (!userByEmail) {
          return NextResponse.json(
            { success: false, message: 'User not found.' },
            { status: 404 }
          );
        }
        userId = userByEmail._id.toString();
      } else if (headerUserId) {
        userId = headerUserId;
      }
    }

    if (!userId) {
      console.error('No user ID in token or headers');
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
