export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          surname: string | null;
          avatar_url: string | null;
          wallet_address: string | null;
          openfort_player_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name?: string | null;
          surname?: string | null;
          avatar_url?: string | null;
          wallet_address?: string | null;
          openfort_player_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          surname?: string | null;
          avatar_url?: string | null;
          wallet_address?: string | null;
          openfort_player_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          cover_image: string | null;
          openfort_player_id: string;
          status: 'draft' | 'published';
          ipfs_hash: string | null;
          ip_asset_id: string | null;
          nft_token_id: string | null;
          license_terms_id: string | null;
          transaction_hash: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          views: number;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          cover_image?: string | null;
          openfort_player_id: string;
          status?: 'draft' | 'published';
          ipfs_hash?: string | null;
          ip_asset_id?: string | null;
          nft_token_id?: string | null;
          license_terms_id?: string | null;
          transaction_hash?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          views?: number;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          cover_image?: string | null;
          openfort_player_id?: string;
          status?: 'draft' | 'published';
          ipfs_hash?: string | null;
          ip_asset_id?: string | null;
          nft_token_id?: string | null;
          license_terms_id?: string | null;
          transaction_hash?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          views?: number;
        };
        Relationships: [];
      };
      ip_registrations: {
        Row: {
          id: string;
          article_id: string;
          ip_asset_id: string;
          nft_token_id: string;
          license_terms_id: string;
          ipfs_hash: string;
          transaction_hash: string;
          chain_id: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          ip_asset_id: string;
          nft_token_id: string;
          license_terms_id: string;
          ipfs_hash: string;
          transaction_hash: string;
          chain_id: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          ip_asset_id?: string;
          nft_token_id?: string;
          license_terms_id?: string;
          ipfs_hash?: string;
          transaction_hash?: string;
          chain_id?: number;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      article_status: 'draft' | 'published';
    };
    Relationships: [];
  };
};
