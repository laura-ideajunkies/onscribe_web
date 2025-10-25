import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IPProtectionBadge } from '@/components/ip-protection-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Calendar,
  Eye,
  ExternalLink,
  Share2,
  Shield,
} from 'lucide-react';
import { formatDate, getBlockExplorerUrl } from '@/lib/utils';

async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      author:users (
        id,
        name,
        email,
        avatar_url,
        wallet_address
      )
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  // Increment views
  await supabase.rpc('increment_article_views', { article_slug: slug });

  return {
    ...data,
    author: data.author,
  } as Article;
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const status = article.ip_asset_id ? 'protected' : 'pending';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Cover Image */}
          {article.cover_image && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Title and Meta */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <IPProtectionBadge status={status} />
              {article.views > 0 && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {article.views} views
                </span>
              )}
            </div>

            <h1 className="text-5xl font-bold mb-6">{article.title}</h1>

            {/* Author Info */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={article.author?.avatar_url}
                    alt={article.author?.name || 'Author'}
                  />
                  <AvatarFallback>
                    {article.author?.name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {article.author?.name || 'Anonymous'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(article.published_at!)}</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* IP Protection Info */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    IP Protection Status
                  </h3>

                  {article.ip_asset_id ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        This article is protected as an NFT on Story Protocol with
                        a Non-Commercial Social Remixing license.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">IP Asset ID</p>
                          <p className="text-muted-foreground font-mono text-xs break-all">
                            {article.ip_asset_id}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium mb-1">Token ID</p>
                          <p className="text-muted-foreground font-mono text-xs">
                            {article.nft_token_id}
                          </p>
                        </div>

                        {article.ipfs_hash && (
                          <div>
                            <p className="font-medium mb-1">IPFS Hash</p>
                            <a
                              href={`https://ipfs.io/ipfs/${article.ipfs_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-xs font-mono hover:underline flex items-center gap-1"
                            >
                              {article.ipfs_hash.slice(0, 20)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}

                        {article.transaction_hash && (
                          <div>
                            <p className="font-medium mb-1">Transaction</p>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${article.transaction_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-xs font-mono hover:underline flex items-center gap-1"
                            >
                              {article.transaction_hash.slice(0, 20)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      IP registration is being processed. This typically takes a few
                      minutes. Check back soon!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">License Terms</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This work is licensed under Non-Commercial Social Remixing terms:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>You can share and adapt this work</li>
                <li>Attribution to the original author is required</li>
                <li>Commercial use is not permitted</li>
                <li>Derivatives must be shared under the same license</li>
              </ul>
            </CardContent>
          </Card>
        </article>
      </main>
    </div>
  );
}
