export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  wallet_address?: string;
  openfort_player_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author_id: string;
  author?: User;
  status: 'draft' | 'published';
  ipfs_hash?: string;
  ip_asset_id?: string;
  nft_token_id?: string;
  license_terms_id?: string;
  transaction_hash?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  views?: number;
}

export interface IPRegistration {
  id: string;
  article_id: string;
  ip_asset_id: string;
  nft_token_id: string;
  license_terms_id: string;
  ipfs_hash: string;
  transaction_hash: string;
  chain_id: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ArticleMetadata {
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  coverImage?: string;
}

export interface CreateArticleInput {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  status: 'draft' | 'published';
}

export interface UpdateArticleInput {
  title?: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  status?: 'draft' | 'published';
}

export interface IPFSUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export interface StoryProtocolResponse {
  ipAssetId: string;
  tokenId: string;
  licenseTermsId: string;
  transactionHash: string;
}
