import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { uploadToIPFS } from '@/lib/ipfs';
import { generateSlug } from '@/lib/utils';
import { CreateArticleInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateArticleInput = await request.json();
    const supabase = getServiceSupabase();

    // Get Openfort player ID from header
    const openfortPlayerId = request.headers.get('x-user-id');
    if (!openfortPlayerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate slug
    const slug = generateSlug(body.title);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An article with this title already exists' },
        { status: 400 }
      );
    }

    // Create article in database
    const { data: article, error: dbError } = await (supabase.from('articles') as any)
      .insert({
        title: body.title,
        slug,
        content: body.content,
        excerpt: body.excerpt,
        cover_image: body.cover_image,
        openfort_player_id: openfortPlayerId,
        status: body.status,
        published_at: body.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (dbError || !article) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      );
    }

    // If publishing, trigger IPFS upload (Story Protocol registration happens on frontend)
    if (body.status === 'published') {
      // This happens asynchronously in the background
      processIPFSUpload(article.id, {
        title: body.title,
        description: body.excerpt || '',
        content: body.content,
        author: openfortPlayerId,
        publishedAt: new Date().toISOString(),
        coverImage: body.cover_image,
      });
    }

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Background process for IPFS upload only
// Story Protocol registration happens on frontend with user's wallet
async function processIPFSUpload(
  articleId: string,
  metadata: {
    title: string;
    description: string;
    content: string;
    author: string;
    publishedAt: string;
    coverImage?: string;
  }
) {
  try {
    const supabase = getServiceSupabase();

    console.log(`Starting IPFS upload for article ${articleId}`);

    // Upload to IPFS
    const ipfsResult = await uploadToIPFS({
      title: metadata.title,
      description: metadata.description,
      content: metadata.content,
      author: metadata.author,
      publishedAt: metadata.publishedAt,
      coverImage: metadata.coverImage,
    });

    console.log(`IPFS upload successful: ${ipfsResult.IpfsHash}`);

    // Update article with IPFS hash
    await (supabase.from('articles') as any)
      .update({
        ipfs_hash: ipfsResult.IpfsHash,
      })
      .eq('id', articleId);

    console.log(`Article ${articleId} updated with IPFS hash`);

  } catch (error) {
    console.error('IPFS upload failed:', error);
    // In production, you might want to implement retry logic or notifications
  }
}
