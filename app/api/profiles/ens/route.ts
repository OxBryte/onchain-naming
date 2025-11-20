import { NextRequest, NextResponse } from 'next/server';
import { getENSTextRecords, resolveAddress } from '@/lib/ens';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ensName = searchParams.get('ensName');
    const address = searchParams.get('address');

    if (ensName) {
      const profile = await getENSTextRecords(ensName);
      return NextResponse.json({ profile }, { status: 200 });
    }

    if (address) {
      const ensName = await resolveAddress(address as `0x${string}`);
      if (ensName) {
        const profile = await getENSTextRecords(ensName);
        return NextResponse.json({ profile }, { status: 200 });
      }
      return NextResponse.json({ profile: {} }, { status: 200 });
    }

    return NextResponse.json(
      { message: 'Either ensName or address is required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error fetching ENS data:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch ENS data' },
      { status: 500 }
    );
  }
}

