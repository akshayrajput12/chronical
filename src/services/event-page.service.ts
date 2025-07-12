import { createClient, createStaticClient } from "@/lib/supabase/server";
import { Event, EventsHero } from "@/types/events";
import { BlogPostSummary } from "@/types/blog";

// Interface for events listing page data
export interface EventsPageData {
    hero: EventsHero | null;
    events: Event[];
    totalCount: number;
    hasMore: boolean;
}

// Interface for event detail page data
export interface EventDetailPageData {
    event: Event;
    relatedEvents: Event[];
    galleryImages: any[];
    blogPosts: BlogPostSummary[];
}

/**
 * Fetches all published event slugs for static generation
 * Used by generateStaticParams in event detail pages
 * Optimized for SSG with timeout and error handling
 */
export async function getAllEventSlugs(): Promise<string[]> {
    try {
        const supabase = createStaticClient();

        // Add timeout for build-time reliability
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
                () => reject(new Error("Timeout fetching event slugs")),
                10000,
            );
        });

        const dataPromise = supabase
            .from("events")
            .select("slug")
            .eq("is_active", true)
            .not("published_at", "is", null)
            .not("slug", "is", null)
            .limit(1000); // Reasonable limit for static generation

        const { data, error } = await Promise.race([
            dataPromise,
            timeoutPromise,
        ]);

        if (error) {
            console.error("Error fetching event slugs:", error);
            return [];
        }

        return data?.map(event => event.slug).filter(Boolean) || [];
    } catch (error) {
        console.error("Error in getAllEventSlugs:", error);
        // Return empty array to allow build to continue
        return [];
    }
}

/**
 * Fetch data for the main events listing page (/top-trade-shows-in-uae-saudi-arabia-middle-east)
 */
export async function getEventsPageData(
    limit: number = 50,
    offset: number = 0,
    isActive: boolean = true,
): Promise<EventsPageData> {
    try {
        const supabase = await createClient();

        // Fetch hero data and events in parallel
        const [heroResult, eventsResult, countResult] = await Promise.all([
            // Fetch active hero content
            supabase
                .from("events_hero")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(1)
                .single(),

            // Fetch events with category information
            supabase
                .from("events")
                .select(
                    `
                    *,
                    category:event_categories(
                        id,
                        name,
                        slug,
                        color,
                        description
                    )
                `,
                )
                .eq("is_active", isActive)
                .not("published_at", "is", null)
                .order("start_date", { ascending: true })
                .range(offset, offset + limit - 1),

            // Get total count for pagination
            supabase
                .from("events")
                .select("id", { count: "exact", head: true })
                .eq("is_active", isActive)
                .not("published_at", "is", null),
        ]);

        // Process results
        const hero = heroResult.data || null;
        const events = eventsResult.data || [];
        const totalCount = countResult.count || 0;
        const hasMore = offset + limit < totalCount;

        // Transform events data
        const transformedEvents: Event[] = events.map(event => ({
            ...event,
            category_name: event.category?.name,
            category_slug: event.category?.slug,
            category_color: event.category?.color,
        }));

        return {
            hero,
            events: transformedEvents,
            totalCount,
            hasMore,
        };
    } catch (error) {
        console.error("Error fetching events page data:", error);
        return {
            hero: null,
            events: [],
            totalCount: 0,
            hasMore: false,
        };
    }
}

/**
 * Fetch data for event detail page (/top-trade-shows-in-uae-saudi-arabia-middle-east/[slug])
 */
export async function getEventDetailPageData(
    slug: string,
): Promise<EventDetailPageData | null> {
    try {
        const supabase = await createClient();

        // Fetch the main event
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select(
                `
                *,
                category:event_categories(
                    id,
                    name,
                    slug,
                    color,
                    description
                )
            `,
            )
            .eq("slug", slug)
            .eq("is_active", true)
            .not("published_at", "is", null)
            .single();

        if (eventError || !event) {
            console.error("Event not found:", eventError);
            return null;
        }

        // Fetch related data in parallel
        const [relatedEventsResult, galleryImagesResult, blogPostsResult] =
            await Promise.all([
                // Fetch related events (same category or recent events)
                supabase
                    .from("events")
                    .select(
                        `
                    id,
                    title,
                    slug,
                    short_description,
                    featured_image_url,
                    start_date,
                    end_date,
                    date_range,
                    venue,
                    category_id
                `,
                    )
                    .neq("id", event.id)
                    .eq("is_active", true)
                    .not("published_at", "is", null)
                    .order("created_at", { ascending: false })
                    .limit(6),

                // Fetch gallery images for this event
                supabase
                    .from("event_images")
                    .select("*")
                    .eq("event_id", event.id)
                    .eq("image_type", "gallery")
                    .eq("is_active", true)
                    .order("display_order", { ascending: true }),

                // Fetch recent blog posts
                supabase
                    .from("blog_posts")
                    .select(
                        `
                    id,
                    title,
                    slug,
                    excerpt,
                    featured_image_url,
                    published_at,
                    view_count,
                    category_id,
                    blog_categories(name, slug, color)
                `,
                    )
                    .eq("status", "published")
                    .not("published_at", "is", null)
                    .order("published_at", { ascending: false })
                    .limit(6),
            ]);

        // Transform event data
        const transformedEvent: Event = {
            ...event,
            category_name: event.category?.name,
            category_slug: event.category?.slug,
            category_color: event.category?.color,
        };

        // Transform related events
        const relatedEvents = (relatedEventsResult.data || []).map(event => ({
            ...event,
            is_active: true,
            is_featured: false,
            display_order: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }));

        // Transform gallery images
        const galleryImages = galleryImagesResult.data || [];

        // Transform blog posts
        const blogPosts: BlogPostSummary[] = (blogPostsResult.data || []).map(
            post => {
                // Handle blog_categories which might be null, object, or array
                const category = post.blog_categories;
                const categoryData = Array.isArray(category)
                    ? category[0]
                    : category;

                return {
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt || "",
                    featured_image_url: post.featured_image_url || "",
                    featured_image_alt: "",
                    published_at: post.published_at || "",
                    view_count: post.view_count || 0,
                    tags: [], // TODO: Implement tags relationship when available
                    category_name: categoryData?.name || "",
                    category_slug: categoryData?.slug || "",
                    category_color: categoryData?.color || "#a5cd39",
                };
            },
        );

        return {
            event: transformedEvent,
            relatedEvents,
            galleryImages,
            blogPosts,
        };
    } catch (error) {
        console.error("Error fetching event detail page data:", error);
        return null;
    }
}

/**
 * Increment event view count (fire and forget)
 * TODO: Add view_count field to events table and create increment_event_views function
 */
export async function incrementEventViews(eventId: string): Promise<void> {
    try {
        // Temporarily disabled until view_count field and increment_event_views function are added
        // const supabase = await createClient();
        //
        // const { error } = await supabase.rpc("increment_event_views", {
        //     event_id: eventId
        // });
        //
        // if (error) {
        //     console.error("Error incrementing event views:", error);
        // }

        console.log(
            `Event view count increment requested for event: ${eventId} (currently disabled)`,
        );
    } catch (error) {
        console.error("Error incrementing event views:", error);
    }
}
