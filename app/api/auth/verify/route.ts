import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthMessage } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, signature, address } = body;

    if (!message || !signature || !address) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const isValid = await verifyAuthMessage(message, signature, address);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      );
    }

    // In production, you'd create a session/JWT here
    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error: any) {
    console.error('Error verifying auth:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to verify signature' },
      { status: 500 }
    );
  }
}

