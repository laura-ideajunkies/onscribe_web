-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  wallet_address TEXT UNIQUE,
  openfort_player_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  ipfs_hash TEXT,
  ip_asset_id TEXT,
  nft_token_id TEXT,
  license_terms_id TEXT,
  transaction_hash TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- Create ip_registrations table
CREATE TABLE IF NOT EXISTS ip_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  ip_asset_id TEXT NOT NULL,
  nft_token_id TEXT NOT NULL,
  license_terms_id TEXT NOT NULL,
  ipfs_hash TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  chain_id INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_ip_registrations_article_id ON ip_registrations(article_id);
CREATE INDEX IF NOT EXISTS idx_ip_registrations_ip_asset_id ON ip_registrations(ip_asset_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_registrations ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Articles policies
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (status = 'published' OR author_id = auth.uid());

CREATE POLICY "Users can create own articles" ON articles
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own articles" ON articles
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete own articles" ON articles
  FOR DELETE USING (author_id = auth.uid());

-- IP registrations policies
CREATE POLICY "Anyone can view IP registrations" ON ip_registrations
  FOR SELECT USING (true);

CREATE POLICY "System can insert IP registrations" ON ip_registrations
  FOR INSERT WITH CHECK (true);

-- Function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE articles
  SET views = views + 1
  WHERE slug = article_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
