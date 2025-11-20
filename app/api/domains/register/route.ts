import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Domain from '@/models/Domain';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { domainName, metadata } = body;

    if (!domainName) {
      return NextResponse.json(
        { message: 'Domain name is required' },
        { status: 400 }
      );
    }

    // Get the owner address from the request headers or body
    // In a real app, you'd verify this from the signed message or transaction
    const ownerAddress = body.ownerAddress || request.headers.get('x-wallet-address');

    if (!ownerAddress) {
      return NextResponse.json(
        { message: 'Owner address is required' },
        { status: 400 }
      );
    }

    // Check if domain already exists
    const existingDomain = await Domain.findOne({ domainName: domainName.toLowerCase() });

    if (existingDomain) {
      // Update existing domain
      existingDomain.metadata = { ...existingDomain.metadata, ...metadata };
      existingDomain.updatedAt = new Date();
      await existingDomain.save();

      return NextResponse.json(
        {
          message: 'Domain updated successfully',
          domain: existingDomain,
        },
        { status: 200 }
      );
    }

    // Create new domain registration
    const newDomain = new Domain({
      domainName: domainName.toLowerCase(),
      ownerAddress: ownerAddress.toLowerCase(),
      registrationDate: new Date(),
      isActive: true,
      metadata: metadata || {},
    });

    await newDomain.save();

    return NextResponse.json(
      {
        message: 'Domain registered successfully',
        domain: newDomain,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error registering domain:', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to register domain',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const domainName = searchParams.get('domainName');
    const ownerAddress = searchParams.get('ownerAddress');

    let query: any = {};

    if (domainName) {
      query.domainName = domainName.toLowerCase();
    }

    if (ownerAddress) {
      query.ownerAddress = ownerAddress.toLowerCase();
    }

    const domains = await Domain.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        domains,
        count: domains.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to fetch domains',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

