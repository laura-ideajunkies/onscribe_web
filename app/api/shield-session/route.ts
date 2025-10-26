import { NextRequest, NextResponse } from 'next/server';

/**
 * Shield Encryption Session Endpoint
 * This endpoint is called by the Openfort SDK to get the encryption session
 * for automatic wallet recovery. It returns the Shield encryption share.
 *
 * The Openfort SDK calls this endpoint (not Openfort's API), and we return
 * the encryption session which the SDK uses for automatic wallet recovery.
 */

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get Shield encryption share from environment
    const shieldEncryptionShare = process.env.SHIELD_ENCRYPTION_SHARE;

    if (!shieldEncryptionShare) {
      console.error('Shield encryption share not configured');
      return NextResponse.json(
        { error: 'Shield not configured' },
        { status: 500 }
      );
    }

    console.log('Providing Shield encryption session to Openfort SDK');

    // Return the encryption share as the session
    // The Openfort SDK expects a response with a 'session' field
    return NextResponse.json({
      session: shieldEncryptionShare,
    });

  } catch (error) {
    console.error('Shield session endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
