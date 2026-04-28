import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { displayName } = await request.json();

    if (!displayName || displayName.trim().length === 0) {
      return NextResponse.json({ success: false, message: 'Name cannot be empty.' }, { status: 400 });
    }
    if (displayName.trim().length > 40) {
      return NextResponse.json({ success: false, message: 'Name must be 40 characters or less.' }, { status: 400 });
    }

    await connectDB();
    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { name: displayName.trim() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, name: updated.name });
  } catch (err) {
    console.error('update-name error:', err);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
