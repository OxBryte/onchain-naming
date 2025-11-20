import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Domain from '@/models/Domain';

export async function GET(
  request: NextRequest,
  { params }: { params: { domainName: string } }
) {
  try {
    await connectDB();

    const domain = await Domain.findOne({
      domainName: params.domainName.toLowerCase(),
    });

    if (!domain) {
      return NextResponse.json(
        { message: 'Domain not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ domain }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching domain:', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to fetch domain',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { domainName: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { metadata, isActive } = body;

    const domain = await Domain.findOne({
      domainName: params.domainName.toLowerCase(),
    });

    if (!domain) {
      return NextResponse.json(
        { message: 'Domain not found' },
        { status: 404 }
      );
    }

    if (metadata) {
      domain.metadata = { ...domain.metadata, ...metadata };
    }

    if (typeof isActive === 'boolean') {
      domain.isActive = isActive;
    }

    await domain.save();

    return NextResponse.json(
      {
        message: 'Domain updated successfully',
        domain,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating domain:', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to update domain',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { domainName: string } }
) {
  try {
    await connectDB();

    const domain = await Domain.findOneAndDelete({
      domainName: params.domainName.toLowerCase(),
    });

    if (!domain) {
      return NextResponse.json(
        { message: 'Domain not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Domain deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting domain:', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to delete domain',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

