import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Get Openfort player ID from header
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

    // Update article with Story Protocol data
    const { data: article, error } = await (supabase.from('articles') as any)
      .update({
        ip_asset_id: body.ip_asset_id,
        nft_token_id: body.nft_token_id,
        transaction_hash: body.transaction_hash,
        license_terms_id: body.license_terms_id,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error || !article) {
      console.error('Failed to update article:', error);
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
