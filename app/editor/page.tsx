'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/providers/auth-provider';
import { OpenfortButton as OpenfortAuthButton } from '@openfort/react';
import {
  ArrowLeft,
  Save,
  Send,
  Shield,
  Image as ImageIcon,
  Wallet,
} from 'lucide-react';
import { generateSlug, extractExcerpt } from '@/lib/utils';

export default function EditorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to create articles.
            </p>
            <OpenfortAuthButton.Custom>
              {({ isLoading, show }) => (
                <Button
                  className="btn-gradient w-full"
                  onClick={show}
                  disabled={isLoading}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isLoading ? 'Loading...' : 'Sign Up'}
                </Button>
              )}
            </OpenfortAuthButton.Custom>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your article',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          cover_image: coverImage,
          excerpt: extractExcerpt(content),
          status: 'draft',
        }),
      });

      if (!response.ok) throw new Error('Failed to save draft');

      const article = await response.json();

      toast({
        title: 'Draft saved',
        description: 'Your article has been saved as a draft',
      });

      router.push(`/dashboard`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Content required',
        description: 'Please enter both a title and content for your article',
        variant: 'destructive',
      });
      return;
    }

    setPublishing(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          cover_image: coverImage,
          excerpt: extractExcerpt(content),
          status: 'published',
        }),
      });

      if (!response.ok) throw new Error('Failed to publish');

      const article = await response.json();

      toast({
        title: 'Article published!',
        description: 'Your article has been published and IP protection is being processed',
      });

      router.push(`/article/${article.slug}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saving || publishing}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button onClick={handlePublish} disabled={saving || publishing}>
              <Send className="mr-2 h-4 w-4" />
              {publishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Editor Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Cover Image URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
              {coverImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <Input
              type="text"
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-bold border-none px-0 focus-visible:ring-0"
            />

            {/* Rich Text Editor */}
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Tell your story..."
            />
          </div>

          {/* Publishing Panel */}
          <aside className="lg:col-span-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  IP Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Status</h4>
                    <Badge variant="secondary">Draft</Badge>
                  </div>

                  {title && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Slug</h4>
                      <p className="text-sm text-muted-foreground font-mono">
                        {generateSlug(title)}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      Word Count
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {content
                        .replace(/<[^>]*>/g, '')
                        .split(/\s+/)
                        .filter((word) => word.length > 0).length}{' '}
                      words
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-semibold text-sm">
                    What happens when you publish?
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary">1.</span>
                      <span>
                        Your article is uploaded to IPFS for permanent storage
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">2.</span>
                      <span>
                        An NFT is minted on Story Protocol representing your IP
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">3.</span>
                      <span>
                        Non-Commercial Social Remixing license is attached
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">4.</span>
                      <span>
                        Your article goes live with blockchain-verified ownership
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    By publishing, you agree to register this work on Story Protocol
                    with a Non-Commercial Social Remixing license.
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
