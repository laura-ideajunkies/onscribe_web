import Link from 'next/link';
import { Suspense } from 'react';
import { getServiceSupabase } from '@/lib/supabase';
import { Article } from '@/types';
import { ArticleCard } from '@/components/article-card';
import { ValuePropositionSidebar } from '@/components/value-proposition-sidebar';
import { NavActions } from '@/components/nav-actions';
import { Button } from '@/components/ui/button';
import { PenSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

async function getPublishedArticles(): Promise<Article[]> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return (data as any[]) as Article[];
}

function ArticlesFeed({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold mb-2">No articles yet</h3>
        <p className="text-muted-foreground mb-6">
          Be the first to publish on OnScribe!
        </p>
        <Button asChild>
          <Link href="/editor">
            <PenSquare className="mr-2 h-4 w-4" />
            Write Your First Article
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const articles = await getPublishedArticles();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <PenSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">OnScribe</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost" className="hover:bg-purple-50">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="btn-glass">
              <Link href="/editor">
                <PenSquare className="mr-2 h-4 w-4" />
                Write
              </Link>
            </Button>
            <NavActions />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b plasma-bg relative">
        <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight hero-gradient-text">
            Your Words. Your Proof.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            OnScribe helps creators protect their work the moment it&apos;s published - giving every story, image, or idea a verifiable fingerprint of authorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              asChild
              size="lg"
              className="btn-gradient text-lg px-10 py-6 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Link href="/editor">Start Writing →</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Publish with confidence. Keep creative control. Build your reputation on your own terms.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Write. Publish. Prove.
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              OnScribe looks and feels like a writing platform - but behind every post, your work is registered with secure proof of ownership.
            </p>
            <p className="text-lg text-muted-foreground">
              No jargon, no faffing with wallets - just <strong>authentic creative authorship</strong> that&apos;s yours to show and share.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Articles Feed */}
            <Suspense
              fallback={
                <div className="text-center py-12">Loading articles...</div>
              }
            >
              <ArticlesFeed articles={articles} />
            </Suspense>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4">
            <ValuePropositionSidebar />
          </aside>
        </div>
      </main>

      {/* Community Statement */}
      <section className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              We believe creative work deserves to be respected - not recycled, scraped, or claimed by algorithms.
            </p>
            <p className="text-lg md:text-xl text-foreground font-medium">
              OnScribe gives creators <strong>the space and proof</strong> they need to publish with confidence, in a world that&apos;s learning to value originality again.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Own your voice. Start writing on OnScribe.
          </h2>
          <Button asChild size="lg" className="btn-gradient text-lg px-8">
            <Link href="/editor">
              <PenSquare className="mr-2 h-5 w-5" />
              Start Writing
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Idea Junkies LTD. Protecting creative authorship.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
