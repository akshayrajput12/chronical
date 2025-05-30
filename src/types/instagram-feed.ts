// Types for the Instagram feed section

export interface InstagramFeedSection {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  subtitle: string;
  instagram_handle: string;
  is_active: boolean;
}

export interface InstagramPost {
  id: string;
  created_at: string;
  updated_at: string;
  section_id: string;
  image_url: string;
  caption: string;
  subcaption: string | null;
  tag: string | null;
  redirect_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface InstagramFeedSectionInput {
  title: string;
  subtitle: string;
  instagram_handle: string;
  is_active: boolean;
}

export interface InstagramPostInput {
  section_id: string;
  image_url: string;
  caption: string;
  subcaption?: string | null;
  tag?: string | null;
  redirect_url?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface InstagramFeedWithPosts extends InstagramFeedSection {
  posts: InstagramPost[];
}
