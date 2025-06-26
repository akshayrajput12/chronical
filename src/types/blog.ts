// Blog System TypeScript Interfaces
// Comprehensive type definitions for the dynamic blog system

export interface BlogCategory {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    slug: string;
    description?: string;
    color: string;
    is_active: boolean;
    sort_order: number;
}

export interface BlogTag {
    id: string;
    created_at: string;
    name: string;
    slug: string;
    color: string;
}

export interface BlogPost {
    id: string;
    created_at: string;
    updated_at: string;
    published_at?: string;

    // Content fields
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    meta_description?: string;
    meta_keywords?: string;

    // Media fields
    featured_image_url?: string;
    featured_image_alt?: string;
    hero_image_url?: string;
    hero_image_alt?: string;

    // Status and visibility
    status: "draft" | "published" | "archived";
    is_featured: boolean;

    // SEO and social
    og_title?: string;
    og_description?: string;
    og_image_url?: string;

    // Relationships
    author_id?: string;
    category_id?: string;
    category?: BlogCategory;
    tags?: BlogTag[];

    // Analytics
    view_count: number;

    // Scheduling
    scheduled_publish_at?: string;
}

export interface BlogImage {
    id: string;
    created_at: string;
    updated_at: string;

    // File information
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    width?: number;
    height?: number;

    // Metadata
    alt_text?: string;
    caption?: string;

    // Relationships
    blog_post_id?: string;
    uploaded_by?: string;

    // Status
    is_active: boolean;
}

// Extended interfaces for frontend display
export interface BlogPostWithDetails extends BlogPost {
    category_name?: string;
    category_slug?: string;
    category_color?: string;
    tags: BlogTag[];
}

export interface BlogPostSummary {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image_url?: string;
    featured_image_alt?: string;
    published_at?: string;
    category_name?: string;
    category_slug?: string;
    category_color?: string;
    view_count: number;
    tags: string[];
}

// Admin interfaces
export interface CreateBlogPostRequest {
    title: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    meta_description?: string;
    meta_keywords?: string;
    featured_image_url?: string;
    featured_image_alt?: string;
    hero_image_url?: string;
    hero_image_alt?: string;
    status: "draft" | "published" | "archived";
    is_featured?: boolean;
    og_title?: string;
    og_description?: string;
    og_image_url?: string;
    category_id?: string;
    tag_ids?: string[];
    scheduled_publish_at?: string;
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
    id: string;
}

export interface CreateBlogCategoryRequest {
    name: string;
    slug?: string;
    description?: string;
    color?: string;
    sort_order?: number;
}

export interface UpdateBlogCategoryRequest
    extends Partial<CreateBlogCategoryRequest> {
    id: string;
}

export interface CreateBlogTagRequest {
    name: string;
    slug?: string;
    color?: string;
}

export interface UpdateBlogTagRequest extends Partial<CreateBlogTagRequest> {
    id: string;
}

export interface UploadBlogImageRequest {
    file: File;
    alt_text?: string;
    caption?: string;
    blog_post_id?: string;
}

export interface BlogImageUploadResponse {
    id: string;
    filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    width?: number;
    height?: number;
    public_url: string;
}

// API Response interfaces
export interface BlogPostsResponse {
    posts: BlogPostSummary[];
    total_count: number;
    page: number;
    page_size: number;
    has_more: boolean;
}

export interface BlogCategoriesResponse {
    categories: BlogCategory[];
}

export interface BlogTagsResponse {
    tags: BlogTag[];
}

// Query parameters
export interface BlogPostsQueryParams {
    page?: number;
    page_size?: number;
    category?: string;
    tag?: string;
    status?: "draft" | "published" | "archived";
    search?: string;
    featured?: boolean;
    sort_by?:
        | "published_at"
        | "created_at"
        | "updated_at"
        | "title"
        | "view_count";
    sort_order?: "asc" | "desc";
}

// Form interfaces for admin
export interface BlogPostFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    meta_description: string;
    meta_keywords: string;
    featured_image_url: string;
    featured_image_alt: string;
    hero_image_url: string;
    hero_image_alt: string;
    status: "draft" | "published" | "archived";
    is_featured: boolean;
    og_title: string;
    og_description: string;
    og_image_url: string;
    category_id: string;
    tag_ids: string[];
    scheduled_publish_at: string;
}

export interface BlogCategoryFormData {
    name: string;
    slug: string;
    description: string;
    color: string;
    sort_order: number;
    is_active: boolean;
}

export interface BlogTagFormData {
    name: string;
    slug: string;
    color: string;
}

// Validation interfaces
export interface BlogPostValidationErrors {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    category_id?: string;
    featured_image_url?: string;
    scheduled_publish_at?: string;
}

export interface BlogCategoryValidationErrors {
    name?: string;
    slug?: string;
    color?: string;
    sort_order?: string;
}

export interface BlogTagValidationErrors {
    name?: string;
    slug?: string;
    color?: string;
}

// Utility types
export type BlogPostStatus = "draft" | "published" | "archived";
export type BlogSortField =
    | "published_at"
    | "created_at"
    | "updated_at"
    | "title"
    | "view_count";
export type SortOrder = "asc" | "desc";

// Component prop interfaces
export interface BlogCardProps {
    post: BlogPostSummary;
    index: number;
    onClick?: (slug: string) => void;
    className?: string;
    style?: React.CSSProperties;
}

export interface BlogCarouselProps {
    posts: BlogPostSummary[];
}

export interface BlogPostsSectionProps {
    blogPosts: BlogPostSummary[];
}

export interface BlogDetailHeroProps {
    title: string;
    subtitle?: string;
    date: string;
    heroImage?: string;
    category?: {
        name: string;
        color: string;
    };
}

export interface BlogDetailContentProps {
    content: string;
    images?: BlogImage[];
}

// Admin component prop interfaces
export interface BlogAdminTableProps {
    posts: BlogPost[];
    onEdit: (post: BlogPost) => void;
    onDelete: (postId: string) => void;
    onStatusChange: (postId: string, status: BlogPostStatus) => void;
}

export interface BlogPostEditorProps {
    post?: BlogPost;
    categories: BlogCategory[];
    tags: BlogTag[];
    onSave: (post: CreateBlogPostRequest | UpdateBlogPostRequest) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export interface BlogCategoryManagerProps {
    categories: BlogCategory[];
    onAdd: (category: CreateBlogCategoryRequest) => void;
    onEdit: (category: UpdateBlogCategoryRequest) => void;
    onDelete: (categoryId: string) => void;
}

export interface BlogTagManagerProps {
    tags: BlogTag[];
    onAdd: (tag: CreateBlogTagRequest) => void;
    onEdit: (tag: UpdateBlogTagRequest) => void;
    onDelete: (tagId: string) => void;
}

export interface BlogImageManagerProps {
    images: BlogImage[];
    onUpload: (request: UploadBlogImageRequest) => void;
    onDelete: (imageId: string) => void;
    onSelect?: (image: BlogImage) => void;
    selectedImages?: string[];
}
