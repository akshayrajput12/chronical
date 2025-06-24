import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase";

// GET /api/blog/posts - Fetch blog posts with pagination and filtering
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("page_size") || "10");
        const category = searchParams.get("category");
        const tag = searchParams.get("tag");
        const status = searchParams.get("status") || "published";
        const search = searchParams.get("search");
        const featured = searchParams.get("featured");
        const sortBy = searchParams.get("sort_by") || "published_at";
        const sortOrder = searchParams.get("sort_order") || "desc";
        const relatedTo = searchParams.get("related_to");
        const exclude = searchParams.get("exclude");

        // Handle related posts query
        if (relatedTo) {
            try {
                const { data: relatedPosts, error: relatedError } =
                    await supabase.rpc("get_related_blog_posts", {
                        current_post_id: relatedTo,
                        limit_count: pageSize,
                    });

                if (relatedError) {
                    console.error("Related posts error:", relatedError);
                    return NextResponse.json({
                        posts: [],
                        total_count: 0,
                        page: 1,
                        page_size: pageSize,
                        has_more: false,
                    });
                }

                return NextResponse.json({
                    posts: relatedPosts || [],
                    total_count: relatedPosts?.length || 0,
                    page: 1,
                    page_size: pageSize,
                    has_more: false,
                });
            } catch (error) {
                console.error("Related posts error:", error);
                return NextResponse.json({
                    posts: [],
                    total_count: 0,
                    page: 1,
                    page_size: pageSize,
                    has_more: false,
                });
            }
        }

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

        if (featured === "true") {
            query = query.eq("is_featured", true);
        }

        if (search) {
            query = query.or(
                `title.ilike.%${search}%,excerpt.ilike.%${search}%`,
            );
        }

        // Apply sorting
        const ascending = sortOrder === "asc";
        query = query.order(sortBy, { ascending });

        // Apply pagination
        query = query.range(offset, offset + pageSize - 1);

        const { data: posts, error, count } = await query;

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to fetch posts" },
                { status: 500 },
            );
        }

        // Transform data for frontend
        const transformedPosts =
            posts?.map(post => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                featured_image_url: post.featured_image_url,
                featured_image_alt: post.featured_image_alt,
                published_at: post.published_at,
                category_name: Array.isArray(post.blog_categories)
                    ? post.blog_categories[0]?.name
                    : (post.blog_categories as any)?.name,
                category_slug: Array.isArray(post.blog_categories)
                    ? post.blog_categories[0]?.slug
                    : (post.blog_categories as any)?.slug,
                category_color: Array.isArray(post.blog_categories)
                    ? post.blog_categories[0]?.color
                    : (post.blog_categories as any)?.color,
                view_count: post.view_count,
                tags: [], // Tags will be fetched separately if needed
            })) || [];

        return NextResponse.json({
            posts: transformedPosts,
            total_count: count || 0,
            page,
            page_size: pageSize,
            has_more: (count || 0) > offset + pageSize,
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// POST /api/blog/posts - Create a new blog post
export async function POST(request: NextRequest) {
    try {
        const supabase = createServiceClient();
        const body = await request.json();

        // Validate required fields
        if (!body.title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 },
            );
        }

        // Generate unique slug if not provided
        let slug = body.slug;
        if (!slug) {
            const { data: slugData, error: slugError } = await supabase.rpc(
                "generate_unique_blog_slug",
                { title_text: body.title },
            );

            if (slugError) {
                console.error("Slug generation error:", slugError);
                return NextResponse.json(
                    { error: "Failed to generate slug" },
                    { status: 500 },
                );
            }

            slug = slugData;
        }

        // Prepare post data
        const postData = {
            title: body.title,
            slug,
            excerpt: body.excerpt || null,
            content: body.content || null,
            meta_description: body.meta_description || null,
            meta_keywords: body.meta_keywords || null,
            featured_image_url: body.featured_image_url || null,
            featured_image_alt: body.featured_image_alt || null,
            hero_image_url: body.hero_image_url || null,
            hero_image_alt: body.hero_image_alt || null,
            status: body.status || "draft",
            is_featured: body.is_featured || false,
            og_title: body.og_title || null,
            og_description: body.og_description || null,
            og_image_url: body.og_image_url || null,
            category_id: body.category_id || null,
            published_at:
                body.status === "published" ? new Date().toISOString() : null,
            scheduled_publish_at: body.scheduled_publish_at || null,
        };

        // Insert blog post
        const { data: post, error: postError } = await supabase
            .from("blog_posts")
            .insert([postData])
            .select()
            .single();

        if (postError) {
            console.error("Post creation error:", postError);
            return NextResponse.json(
                { error: "Failed to create post" },
                { status: 500 },
            );
        }

        // Insert tag relationships if provided
        if (body.tag_ids && body.tag_ids.length > 0) {
            const tagRelations = body.tag_ids.map((tagId: string) => ({
                blog_post_id: post.id,
                blog_tag_id: tagId,
            }));

            const { error: tagError } = await supabase
                .from("blog_post_tags")
                .insert(tagRelations);

            if (tagError) {
                console.error("Tag relation error:", tagError);
                // Don't fail the request, just log the error
            }
        }

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
