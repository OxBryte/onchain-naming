import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { generateSlug } from '@/lib/ens';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const slug = searchParams.get('slug');

    let query: any = {};

    if (walletAddress) {
      query.walletAddress = walletAddress.toLowerCase();
    }

    if (slug) {
      query.slug = slug.toLowerCase();
    }

    const profiles = await Profile.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ profiles }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      walletAddress,
      ensName,
      name,
      title,
      bio,
      avatar,
      email,
      phone,
      website,
      twitter,
      linkedin,
      farcaster,
      github,
      instagram,
      customLinks,
      template,
    } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = ensName
      ? generateSlug(ensName)
      : generateSlug(undefined, walletAddress);

    // Check if profile already exists
    let profile = await Profile.findOne({
      $or: [
        { walletAddress: walletAddress.toLowerCase() },
        { slug },
      ],
    });

    if (profile) {
      // Update existing profile
      Object.assign(profile, {
        ensName: ensName || profile.ensName,
        name: name || profile.name,
        title: title || profile.title,
        bio: bio || profile.bio,
        avatar: avatar || profile.avatar,
        email: email || profile.email,
        phone: phone || profile.phone,
        website: website || profile.website,
        twitter: twitter || profile.twitter,
        linkedin: linkedin || profile.linkedin,
        farcaster: farcaster || profile.farcaster,
        github: github || profile.github,
        instagram: instagram || profile.instagram,
        customLinks: customLinks || profile.customLinks,
        template: template || profile.template,
      });
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile({
        walletAddress: walletAddress.toLowerCase(),
        ensName: ensName?.toLowerCase(),
        slug,
        name,
        title,
        bio,
        avatar,
        email,
        phone,
        website,
        twitter,
        linkedin,
        farcaster,
        github,
        instagram,
        customLinks: customLinks || [],
        template: template || 'minimal',
        isPublished: false,
        isActive: true,
      });
      await profile.save();
    }

    return NextResponse.json(
      { profile, message: 'Profile saved successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating/updating profile:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to save profile' },
      { status: 500 }
    );
  }
}

