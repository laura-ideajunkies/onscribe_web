import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { uploadToIPFS } from '@/lib/ipfs';
import { registerIPAsset } from '@/lib/story-protocol';
import { generateSlug } from '@/lib/utils';
import { CreateArticleInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateArticleInput = await request.json();
    const supabase = getServiceSupabase();

    // Get user from session (you'll need to implement proper auth)
    // For now, we'll use a placeholder
    const userId = request.headers.get('x-user-id');
    if (!userId) {
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
    const { data: article, error: dbError } = await supabase
      .from('articles')
      .insert({
        title: body.title,
        slug,
        content: body.content,
        excerpt: body.excerpt,
        cover_image: body.cover_image,
        author_id: userId,
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

    // If publishing, trigger IP registration
    if (body.status === 'published') {
      // This happens asynchronously in the background
      processIPRegistration(article.id, {
        title: body.title,
        description: body.excerpt || '',
        content: body.content,
        author: userId,
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

// Background process for IP registration
async function processIPRegistration(
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

    // 1. Upload to IPFS
    const ipfsResult = await uploadToIPFS({
      title: metadata.title,
      description: metadata.description,
      content: metadata.content,
      author: metadata.author,
      publishedAt: metadata.publishedAt,
      coverImage: metadata.coverImage,
    });

    // 2. Register on Story Protocol
    const storyResult = await registerIPAsset(ipfsResult.IpfsHash, {
      title: metadata.title,
      description: metadata.description,
      author: metadata.author,
    });

    // 3. Update article with IP registration data
    await supabase
      .from('articles')
      .update({
        ipfs_hash: ipfsResult.IpfsHash,
        ip_asset_id: storyResult.ipAssetId,
        nft_token_id: storyResult.tokenId,
        license_terms_id: storyResult.licenseTermsId,
        transaction_hash: storyResult.transactionHash,
      })
      .eq('id', articleId);

    // 4. Create IP registration record
    await supabase.from('ip_registrations').insert({
      article_id: articleId,
      ip_asset_id: storyResult.ipAssetId,
      nft_token_id: storyResult.tokenId,
      license_terms_id: storyResult.licenseTermsId,
      ipfs_hash: ipfsResult.IpfsHash,
      transaction_hash: storyResult.transactionHash,
      chain_id: parseInt(process.env.NEXT_PUBLIC_STORY_PROTOCOL_CHAIN_ID!),
      metadata: {
        title: metadata.title,
        description: metadata.description,
        author: metadata.author,
        publishedAt: metadata.publishedAt,
      },
    });

    console.log(`IP registration completed for article ${articleId}`);
  } catch (error) {
    console.error('IP registration failed:', error);
    // In production, you might want to implement retry logic or notifications
  }
}
