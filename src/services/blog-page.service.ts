import { createServiceClient } from "@/lib/supabase/service";
import { createStaticClient } from "@/lib/supabase/server";
import { BlogPostSummary, BlogPostWithDetails } from "@/types/blog";

export interface BlogPageData {
    posts: BlogPostSummary[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export interface BlogDetailPageData {
    post: BlogPostWithDetails;
    relatedPosts: BlogPostSummary[];
}

/**
 * Fetches blog posts for the main blog listing page
 * This replaces the useEffect call in the blog page component
 */
export async function getBlogPageData(
    page: number = 1,
    pageSize: number = 20,
    status: string = "published",
    category?: string,
    search?: string,
    featured?: boolean
): Promise<BlogPageData> {
    try {
        const supabase = createServiceClient();

        // Calculate offset
        const offset = (page - 1) * pageSize;

        // Build query
        let query = supabase.from("blog_posts").select(
            `
                id,
                title,
                slug,
                excerpt,
                featured_image_url,
                featured_image_alt,
                published_at,
                created_at,
                updated_at,
                status,
                is_featured,
                view_count,
                blog_categories (
                    name,
                    slug,
                    color
                )
            `,
            { count: "exact" },
        );

        // Apply filters
        if (status !== "all") {
            query = query.eq("status", status);
        }

        if (status === "published") {
            query = query.lte("published_at", new Date().toISOString());
        }

        if (category) {
            query = query.eq("blog_categories.slug", category);
        }

        if (featured === true) {
            query = query.eq("is_featured", true);
        }

        if (search) {
            query = query.or(
                `title.ilike.%${search}%,excerpt.ilike.%${search}%`,
            );
        }

        // Apply pagination and ordering
        query = query
            .order("published_at", { ascending: false })
            .range(offset, offset + pageSize - 1);

        const { data: posts, error, count } = await query;

        if (error) {
            console.error("Error fetching blog posts:", error);
            throw new Error("Failed to fetch blog posts");
        }

        // Transform data to match BlogPostSummary interface
        const transformedPosts: BlogPostSummary[] = (posts || []).map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || "",
            featured_image_url: post.featured_image_url || "",
            featured_image_alt: post.featured_image_alt || "",
            published_at: post.published_at || post.created_at,
            created_at: post.created_at,
            updated_at: post.updated_at,
            status: post.status,
            is_featured: post.is_featured,
            view_count: post.view_count,
            tags: [], // TODO: Implement tags relationship when available
            category: post.blog_categories ? {
                name: post.blog_categories?.[0]?.name || "",
                slug: post.blog_categories?.[0]?.slug || "",
                color: post.blog_categories?.[0]?.color || ""
            } : undefined
        }));

        const totalCount = count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            posts: transformedPosts,
            totalCount,
            currentPage: page,
            totalPages
        };

    } catch (error) {
        console.error("Error in getBlogPageData:", error);
        // Return fallback data structure
        return {
            posts: [],
            totalCount: 0,
            currentPage: page,
            totalPages: 0
        };
    }
}

/**
 * Fetches all published blog post slugs for static generation
 * Used by generateStaticParams in blog detail pages
 * Optimized for SSG with timeout and error handling
 */
export async function getAllBlogSlugs(): Promise<string[]> {
    try {
        const supabase = createStaticClient();

        // Add timeout for build-time reliability
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout fetching blog slugs')), 10000);
        });

        const dataPromise = supabase
            .from("blog_posts")
            .select("slug")
            .eq("status", "published")
            .not("slug", "is", null)
            .limit(1000); // Reasonable limit for static generation

        const { data, error } = await Promise.race([dataPromise, timeoutPromise]);

        if (error) {
            console.error("Error fetching blog slugs:", error);
            return [];
        }

        return data?.map(post => post.slug).filter(Boolean) || [];
    } catch (error) {
        console.error("Error in getAllBlogSlugs:", error);
        // Return empty array to allow build to continue
        return [];
    }
}

/**
 * Fetches a single blog post by slug with related posts
 * This replaces the useEffect call in the blog detail page component
 */
export async function getBlogDetailPageData(slug: string): Promise<BlogDetailPageData | null> {
    try {
        const supabase = createServiceClient();

        // Fetch the main blog post
        const { data: post, error } = await supabase
            .from("blog_posts")
            .select(
                `
                *,
                blog_categories (
                    name,
                    slug,
                    color
                ),
                blog_post_tags (
                    blog_tags (
                        id,
                        name,
                        slug,
                        color
                    )
                )
            `,
            )
            .eq("slug", slug)
            .eq("status", "published")
            .lte("published_at", new Date().toISOString())
            .single();

        if (error) {
            console.error("Error fetching blog post:", error);
            return null;
        }

        if (!post) {
            return null;
        }

        // Transform tags data
        const tags = post.blog_post_tags?.map((tagRelation: any) => tagRelation.blog_tags) || [];

        // Create the blog post with details
        const blogPostWithDetails: BlogPostWithDetails = {
            ...post,
            category: post.blog_categories,
            tags: tags
        };

        // Fetch related posts (same category or recent posts)
        const { data: relatedPostsData, error: relatedError } = await supabase
            .from("blog_posts")
            .select(
                `
                id,
                title,
                slug,
                excerpt,
                featured_image_url,
                featured_image_alt,
                published_at,
                created_at,
                updated_at,
                status,
                is_featured,
                view_count,
                blog_categories (
                    name,
                    slug,
                    color
                )
            `
            )
            .eq("status", "published")
            .lte("published_at", new Date().toISOString())
            .neq("id", post.id)
            .order("published_at", { ascending: false })
            .limit(4);

        if (relatedError) {
            console.error("Error fetching related posts:", relatedError);
        }

        // Transform related posts data
        const relatedPosts: BlogPostSummary[] = (relatedPostsData || []).map(relatedPost => ({
            id: relatedPost.id,
            title: relatedPost.title,
            slug: relatedPost.slug,
            excerpt: relatedPost.excerpt || "",
            featured_image_url: relatedPost.featured_image_url || "",
            featured_image_alt: relatedPost.featured_image_alt || "",
            published_at: relatedPost.published_at || relatedPost.created_at,
            created_at: relatedPost.created_at,
            updated_at: relatedPost.updated_at,
            status: relatedPost.status,
            is_featured: relatedPost.is_featured,
            view_count: relatedPost.view_count,
            tags: [], // TODO: Implement tags relationship when available
            category: relatedPost.blog_categories ? {
                name: relatedPost.blog_categories?.[0]?.name || "",
                slug: relatedPost.blog_categories?.[0]?.slug || "",
                color: relatedPost.blog_categories?.[0]?.color || ""
            } : undefined
        }));

        return {
            post: blogPostWithDetails,
            relatedPosts
        };

    } catch (error) {
        console.error("Error in getBlogDetailPageData:", error);
        return null;
    }
}

/**
 * Increments the view count for a blog post
 * This should be called server-side when a post is viewed
 */
export async function incrementBlogPostViews(postSlug: string): Promise<void> {
    try {
        const supabase = createServiceClient();

        const { error } = await supabase.rpc("increment_blog_post_views", {
            post_slug: postSlug
        });

        if (error) {
            console.error("Error incrementing blog post views:", error);
        }
    } catch (error) {
        console.error("Error in incrementBlogPostViews:", error);
    }
}
