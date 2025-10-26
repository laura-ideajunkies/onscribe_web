'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IPProtectionBadge } from '@/components/ip-protection-badge';
import {
  PenSquare,
  FileText,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    if (user) {
      fetchArticles();
    }
  }, [user]);

  const fetchArticles = async () => {
    if (!user?.id) {
      setLoadingArticles(false);
      return;
    }

    try {
      const response = await fetch('/api/articles/my-articles', {
        headers: {
          'x-user-id': user.openfort_player_id!,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setArticles(articles.filter((a) => a.id !== articleId));
        toast({
          title: 'Article deleted',
          description: 'Your article has been deleted successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete article',
        variant: 'destructive',
      });
    }
  };

  if (loading || loadingArticles) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to access the dashboard.
            </p>
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const publishedArticles = articles.filter((a) => a.status === 'published');
  const draftArticles = articles.filter((a) => a.status === 'draft');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <PenSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">OnScribe</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/editor">
                <PenSquare className="mr-2 h-4 w-4" />
                New Article
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name || user.email}!</h1>
          <p className="text-muted-foreground">
            Manage your articles and track your IP protection status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Articles
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {publishedArticles.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftArticles.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Published Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Published Articles</h2>
          {publishedArticles.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t published any articles yet
                </p>
                <Button asChild>
                  <Link href="/editor">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Write Your First Article
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {publishedArticles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link href={`/article/${article.slug}`}>
                            <h3 className="text-xl font-semibold hover:text-primary cursor-pointer">
                              {article.title}
                            </h3>
                          </Link>
                          <IPProtectionBadge
                            status={article.ip_asset_id ? 'protected' : 'pending'}
                          />
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            Published {formatDate(article.published_at!)}
                          </span>
                          {article.views && article.views > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views}
                            </span>
                          )}
                          {article.transaction_hash && (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${article.transaction_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-primary"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View on Blockchain
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/article/${article.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Draft Articles */}
        {draftArticles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Drafts</h2>
            <div className="space-y-4">
              {draftArticles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">
                            {article.title}
                          </h3>
                          <Badge variant="secondary">Draft</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          Last edited {formatDate(article.updated_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/editor?id=${article.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
