import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const profile = await Profile.findOne({
      slug: params.slug.toLowerCase(),
      isPublished: true,
      isActive: true,
    });

    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }

    // Increment view count
    profile.viewCount += 1;
    profile.lastViewedAt = new Date();
    await profile.save();

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { walletAddress } = body; // Verify ownership

    const profile = await Profile.findOne({
      slug: params.slug.toLowerCase(),
      walletAddress: walletAddress?.toLowerCase(),
    });

    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update allowed fields
    const updatableFields = [
      'name',
      'title',
      'bio',
      'avatar',
      'email',
      'phone',
      'website',
      'twitter',
      'linkedin',
      'farcaster',
      'github',
      'instagram',
      'customLinks',
      'template',
      'isPublished',
      'customCSS',
    ];

    updatableFields.forEach((field) => {
      if (body[field] !== undefined) {
        profile[field] = body[field];
      }
    });

    await profile.save();

    return NextResponse.json(
      { profile, message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}

