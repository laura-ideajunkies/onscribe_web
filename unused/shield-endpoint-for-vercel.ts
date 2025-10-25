import { NextRequest, NextResponse } from 'next/server';

/**
 * Shield Encryption Session Endpoint
 * This endpoint is called by the Openfort SDK to get the encryption session
 * for automatic wallet recovery. It returns the Shield encryption share.
 *
 * Deploy this file to: /app/api/shield-session/route.ts
 * OR for Pages Router: /pages/api/shield-session.ts
 */

// For App Router (Next.js 13+): app/api/shield-session/route.ts
export async function POST(request: NextRequest) {
  try {
    // Get Shield encryption share from environment variable
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
