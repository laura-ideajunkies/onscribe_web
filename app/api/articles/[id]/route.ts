import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { UpdateArticleInput } from '@/types';
import { Database } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServiceSupabase();

    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateArticleInput = await request.json();
    const supabase = getServiceSupabase();

    // Get Openfort player ID from session
    const openfortPlayerId = request.headers.get('x-user-id');
    if (!openfortPlayerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('articles')
      .select('openfort_player_id')
      .eq('id', params.id)
      .single<{ openfort_player_id: string }>();

    if (!existing || existing.openfort_player_id !== openfortPlayerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update article
    const updateData: Database['public']['Tables']['articles']['Update'] = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data: article, error } = await (supabase.from('articles') as any)
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !article) {
      return NextResponse.json(
        { error: 'Failed to update article' },
        { status: 500 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServiceSupabase();

    // Get Openfort player ID from session
    const openfortPlayerId = request.headers.get('x-user-id');
    if (!openfortPlayerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('articles')
      .select('openfort_player_id')
      .eq('id', params.id)
      .single<{ openfort_player_id: string }>();

    if (!existing || existing.openfort_player_id !== openfortPlayerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete article
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete article' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
