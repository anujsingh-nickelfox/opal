import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request) {
  try {
    // Verify NEXTAUTH_SECRET exists before calling getServerSession
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('❌ NEXTAUTH_SECRET is not set in environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error: missing auth secret.' },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated. Please log in again.' },
        { status: 401 }
      );
    }

    // Step 2: Parse and validate body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const { displayName } = body;

    if (!displayName || !displayName.trim()) {
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

    // Step 3: Connect and update
    await connectDB();

    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { name: displayName.trim() } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'User not found in database.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, name: updated.name });

  } catch (err) {
    console.error('❌ update-name error:', err.message);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
