import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// GET: Fetch user profile by openfort_player_id
export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const openfortPlayerId = request.headers.get('x-user-id');

    if (!openfortPlayerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('openfort_player_id', openfortPlayerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found", which is okay for new users
      console.error('Error fetching user:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    // Return null if user doesn't exist yet (new user)
    return NextResponse.json(user || null);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create new user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getServiceSupabase();
    const openfortPlayerId = request.headers.get('x-user-id');

    if (!openfortPlayerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate required fields
    if (!body.first_name || !body.surname || !body.email) {
      return NextResponse.json(
        { error: 'First name, surname, and email are required' },
        { status: 400 }
      );
    }

    // Create user profile
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        openfort_player_id: openfortPlayerId,
        first_name: body.first_name.trim(),
        surname: body.surname.trim(),
        email: body.email.trim().toLowerCase(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);

      // Check for duplicate email or openfort_player_id
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A profile with this email or account already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Update existing user profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getServiceSupabase();
    const openfortPlayerId = request.headers.get('x-user-id');

    if (!openfortPlayerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build update object with only provided fields
    const updates: any = {};
    if (body.first_name !== undefined) updates.first_name = body.first_name.trim();
    if (body.surname !== undefined) updates.surname = body.surname.trim();
    if (body.email !== undefined) updates.email = body.email.trim().toLowerCase();

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update user profile
    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('openfort_player_id', openfortPlayerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);

      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already in use' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
