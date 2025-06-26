import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import { deleteBlogPostImages, deleteFeaturedAndHeroImages } from "@/services/blog-image.service";

// GET /api/blog/posts/[slug] - Fetch a single blog post by slug
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } },
) {
    try {
        const supabase = await createClient();
        const { slug } = params;

        // Fetch post with related data
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
            if (error.code === "PGRST116") {
                return NextResponse.json(
                    { error: "Post not found" },
                    { status: 404 },
                );
            }
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to fetch post" },
                { status: 500 },
            );
        }

        // Transform data for frontend
        const transformedPost = {
            id: post.id,
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            meta_description: post.meta_description,
            meta_keywords: post.meta_keywords,
            featured_image_url: post.featured_image_url,
            featured_image_alt: post.featured_image_alt,
            hero_image_url: post.hero_image_url,
            hero_image_alt: post.hero_image_alt,
            og_title: post.og_title,
            og_description: post.og_description,
            og_image_url: post.og_image_url,
            published_at: post.published_at,
            updated_at: post.updated_at,
            created_at: post.created_at,
            author_id: post.author_id,
            category_name: post.blog_categories?.name,
            category_slug: post.blog_categories?.slug,
            category_color: post.blog_categories?.color,
            view_count: post.view_count,
            tags:
                post.blog_post_tags
                    ?.map((pt: any) => pt.blog_tags?.name)
                    .filter(Boolean) || [],
        };

        // Increment view count (fire and forget)
        supabase
            .rpc("increment_blog_post_views", { post_slug: slug })
            .then(undefined, (error: any) => {
                console.error("View count increment error:", error);
            });

        return NextResponse.json(transformedPost);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// PUT /api/blog/posts/[slug] - Update a blog post
export async function PUT(
    request: NextRequest,
    { params }: { params: { slug: string } },
) {
    try {
        const supabase = createServiceClient();
        const { slug } = params;
        const body = await request.json();

        // Check if post exists
        const { data: existingPost, error: fetchError } = await supabase
            .from("blog_posts")
            .select("id")
            .eq("slug", slug)
            .single();

        if (fetchError) {
            if (fetchError.code === "PGRST116") {
                return NextResponse.json(
                    { error: "Post not found" },
                    { status: 404 },
                );
            }
            console.error("Database error:", fetchError);
            return NextResponse.json(
                { error: "Failed to fetch post" },
                { status: 500 },
            );
        }

        // Prepare update data
        const updateData: any = {
            title: body.title,
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
            scheduled_publish_at: body.scheduled_publish_at || null,
            updated_at: new Date().toISOString(),
            published_at: undefined,
        };

        // Set published_at if publishing for the first time
        if (
            body.status === "published" &&
            body.previous_status !== "published"
        ) {
            updateData.published_at = new Date().toISOString();
        }

        // Update blog post
        const { data: updatedPost, error: updateError } = await supabase
            .from("blog_posts")
            .update(updateData)
            .eq("id", existingPost.id)
            .select()
            .single();

        if (updateError) {
            console.error("Post update error:", updateError);
            return NextResponse.json(
                { error: "Failed to update post" },
                { status: 500 },
            );
        }

        // Update tag relationships if provided
        if (body.tag_ids !== undefined) {
            // Delete existing relationships
            await supabase
                .from("blog_post_tags")
                .delete()
                .eq("blog_post_id", existingPost.id);

            // Insert new relationships
            if (body.tag_ids.length > 0) {
                const tagRelations = body.tag_ids.map((tagId: string) => ({
                    blog_post_id: existingPost.id,
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
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// DELETE /api/blog/posts/[slug] - Delete a blog post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string } },
) {
    try {
        const supabase = await createClient();
        const { slug } = params;

        // Check if post exists and get image URLs
        const { data: existingPost, error: fetchError } = await supabase
            .from("blog_posts")
            .select("id, featured_image_url, hero_image_url")
            .eq("slug", slug)
            .single();

        if (fetchError) {
            if (fetchError.code === "PGRST116") {
                return NextResponse.json(
                    { error: "Post not found" },
                    { status: 404 },
                );
            }
            console.error("Database error:", fetchError);
            return NextResponse.json(
                { error: "Failed to fetch post" },
                { status: 500 },
            );
        }

        // Delete associated images from storage and database
        const imageCleanupResult = await deleteBlogPostImages(existingPost.id);

        // Delete featured and hero images
        const featuredHeroCleanupResult = await deleteFeaturedAndHeroImages(
            existingPost.featured_image_url,
            existingPost.hero_image_url
        );

        // Log image cleanup results
        if (!imageCleanupResult.success || !featuredHeroCleanupResult.success) {
            console.warn("Image cleanup warnings:", {
                blogImages: imageCleanupResult.errors,
                featuredHero: featuredHeroCleanupResult.errors
            });
        }

        // Delete the post (cascade will handle related records)
        const { error: deleteError } = await supabase
            .from("blog_posts")
            .delete()
            .eq("id", existingPost.id);

        if (deleteError) {
            console.error("Post deletion error:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete post" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            message: "Post deleted successfully",
            imagesDeleted: imageCleanupResult.deletedImages + featuredHeroCleanupResult.deletedImages
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
