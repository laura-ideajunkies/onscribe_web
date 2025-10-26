import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();

    // Get Openfort player ID from session
    const openfortPlayerId = request.headers.get('x-user-id');
    if (!openfortPlayerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('openfort_player_id', openfortPlayerId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
