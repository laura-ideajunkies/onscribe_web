import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { UpdateArticleInput } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServiceSupabase();

    const { data: article, error } = await supabase
      .from('articles')
      .select(
        `
        *,
        author:users (
          id,
          name,
          email,
          avatar_url
        )
      `
      )
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

    // Get user from session
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('articles')
      .select('author_id')
      .eq('id', params.id)
      .single();

    if (!existing || existing.author_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update article
    const { data: article, error } = await supabase
      .from('articles')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
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

    // Get user from session
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('articles')
      .select('author_id')
      .eq('id', params.id)
      .single();

    if (!existing || existing.author_id !== userId) {
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
