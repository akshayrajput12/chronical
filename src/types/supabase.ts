export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            admin_users: {
                Row: {
                    id: string;
                    created_at: string;
                    email: string;
                    role: string;
                    clerk_id: string;
                    full_name: string | null;
                    avatar_url: string | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    email: string;
                    role?: string;
                    clerk_id: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    email?: string;
                    role?: string;
                    clerk_id?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                };
                Relationships: [];
            };
            blog_categories: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    color: string;
                    is_active: boolean;
                    sort_order: number;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    color?: string;
                    is_active?: boolean;
                    sort_order?: number;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    color?: string;
                    is_active?: boolean;
                    sort_order?: number;
                };
                Relationships: [];
            };
            blog_posts: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    published_at: string | null;
                    title: string;
                    slug: string;
                    excerpt: string | null;
                    content: string | null;
                    meta_description: string | null;
                    meta_keywords: string | null;
                    featured_image_url: string | null;
                    featured_image_alt: string | null;
                    hero_image_url: string | null;
                    hero_image_alt: string | null;
                    status: string;
                    is_featured: boolean;
                    og_title: string | null;
                    og_description: string | null;
                    og_image_url: string | null;
                    author_id: string | null;
                    category_id: string | null;
                    view_count: number;
                    scheduled_publish_at: string | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    published_at?: string | null;
                    title: string;
                    slug: string;
                    excerpt?: string | null;
                    content?: string | null;
                    meta_description?: string | null;
                    meta_keywords?: string | null;
                    featured_image_url?: string | null;
                    featured_image_alt?: string | null;
                    hero_image_url?: string | null;
                    hero_image_alt?: string | null;
                    status?: string;
                    is_featured?: boolean;
                    og_title?: string | null;
                    og_description?: string | null;
                    og_image_url?: string | null;
                    author_id?: string | null;
                    category_id?: string | null;
                    view_count?: number;
                    scheduled_publish_at?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    published_at?: string | null;
                    title?: string;
                    slug?: string;
                    excerpt?: string | null;
                    content?: string | null;
                    meta_description?: string | null;
                    meta_keywords?: string | null;
                    featured_image_url?: string | null;
                    featured_image_alt?: string | null;
                    hero_image_url?: string | null;
                    hero_image_alt?: string | null;
                    status?: string;
                    is_featured?: boolean;
                    og_title?: string | null;
                    og_description?: string | null;
                    og_image_url?: string | null;
                    author_id?: string | null;
                    category_id?: string | null;
                    view_count?: number;
                    scheduled_publish_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "blog_posts_author_id_fkey";
                        columns: ["author_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "blog_posts_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "blog_categories";
                        referencedColumns: ["id"];
                    },
                ];
            };
            blog_tags: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    slug: string;
                    color: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    slug: string;
                    color?: string;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    name?: string;
                    slug?: string;
                    color?: string;
                };
                Relationships: [];
            };
            blog_post_tags: {
                Row: {
                    id: string;
                    created_at: string;
                    blog_post_id: string;
                    blog_tag_id: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    blog_post_id: string;
                    blog_tag_id: string;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    blog_post_id?: string;
                    blog_tag_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "blog_post_tags_blog_post_id_fkey";
                        columns: ["blog_post_id"];
                        isOneToOne: false;
                        referencedRelation: "blog_posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "blog_post_tags_blog_tag_id_fkey";
                        columns: ["blog_tag_id"];
                        isOneToOne: false;
                        referencedRelation: "blog_tags";
                        referencedColumns: ["id"];
                    },
                ];
            };
            blog_images: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    filename: string;
                    original_filename: string;
                    file_path: string;
                    file_size: number;
                    mime_type: string;
                    width: number | null;
                    height: number | null;
                    alt_text: string | null;
                    caption: string | null;
                    blog_post_id: string | null;
                    uploaded_by: string | null;
                    is_active: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    filename: string;
                    original_filename: string;
                    file_path: string;
                    file_size: number;
                    mime_type: string;
                    width?: number | null;
                    height?: number | null;
                    alt_text?: string | null;
                    caption?: string | null;
                    blog_post_id?: string | null;
                    uploaded_by?: string | null;
                    is_active?: boolean;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    filename?: string;
                    original_filename?: string;
                    file_path?: string;
                    file_size?: number;
                    mime_type?: string;
                    width?: number | null;
                    height?: number | null;
                    alt_text?: string | null;
                    caption?: string | null;
                    blog_post_id?: string | null;
                    uploaded_by?: string | null;
                    is_active?: boolean;
                };
                Relationships: [
                    {
                        foreignKeyName: "blog_images_blog_post_id_fkey";
                        columns: ["blog_post_id"];
                        isOneToOne: false;
                        referencedRelation: "blog_posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "blog_images_uploaded_by_fkey";
                        columns: ["uploaded_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                ];
            };
        };
        Views: Record<string, unknown>;
        Functions: Record<string, unknown>;
        Enums: Record<string, unknown>;
        CompositeTypes: Record<string, unknown>;
    };
}
