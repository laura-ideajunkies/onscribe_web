import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { IPProtectionBadge } from '@/components/ip-protection-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, extractExcerpt } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const status = article.ip_asset_id
    ? 'protected'
    : article.status === 'published'
    ? 'pending'
    : 'draft';

  const excerpt =
    article.excerpt || extractExcerpt(article.content || '', 160);

  return (
    <Link href={`/article/${article.slug}`}>
      <Card className="glass-card overflow-hidden cursor-pointer">
        {article.cover_image && (
          <div className="relative w-full h-48">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
              {article.title}
            </h3>
            <IPProtectionBadge status={status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={article.author?.avatar_url}
                  alt={article.author?.name || 'Author'}
                />
                <AvatarFallback>
                  {article.author?.name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {article.author?.name || 'Anonymous'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(article.published_at || article.created_at)}
                </span>
              </div>
            </div>

            {article.views && article.views > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Eye className="h-4 w-4" />
                <span>{article.views}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
