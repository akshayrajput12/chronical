import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Event, EventInput } from '@/types/events';

// GET /api/events/[id] - Fetch single event by ID or slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';

        // Use service role client for admin access to bypass RLS
        const supabase = await createClient(isAdmin);

        // Determine if ID is UUID or slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const searchField = isUUID ? 'id' : 'slug';

        // Build query
        let query = supabase
            .from('events')
            .select(`
                *,
                category:event_categories(
                    id,
                    name,
                    slug,
                    color,
                    description
                )
            `)
            .eq(searchField, id);

        // Apply filters only for public access (not admin)
        if (!isAdmin) {
            query = query
                .eq('is_active', true)
                .not('published_at', 'is', null);
        }

        const { data: event, error } = await query.single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Event not found' },
                    { status: 404 }
                );
            }
            console.error('Error fetching event:', error);
            return NextResponse.json(
                { error: 'Failed to fetch event' },
                { status: 500 }
            );
        }

        // Get other events (all events excluding current event) - simplified query
        // First, let's try a simple query without joins to see if we get any results
        const { data: relatedEvents, error: relatedError } = await supabase
            .from('events')
            .select(`
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
            `)
            .neq('id', event.id)
            .eq('is_active', true)
            .not('published_at', 'is', null)
            .order('created_at', { ascending: false })
            .limit(6);

        // Log any errors with related events query
        if (relatedError) {
            console.error('Error fetching related events:', relatedError);
        }

        // Transform data
        const transformedEvent: Event = {
            ...event,
            category_name: event.category?.name,
            category_slug: event.category?.slug,
            category_color: event.category?.color,
            gallery_images: [], // Empty for now since we removed the images join
        };

        // If no published events found, try to get any active events (fallback)
        let finalRelatedEvents = relatedEvents;
        if (!relatedEvents || relatedEvents.length === 0) {
            const { data: anyActiveEvents } = await supabase
                .from('events')
                .select(`
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
                `)
                .neq('id', event.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(6);

            finalRelatedEvents = anyActiveEvents;
        }

        // If we have events, fetch their categories separately
        let categoriesMap: { [key: string]: any } = {};
        if (finalRelatedEvents && finalRelatedEvents.length > 0) {
            const categoryIds = finalRelatedEvents
                .map(e => e.category_id)
                .filter(id => id);

            if (categoryIds.length > 0) {
                const { data: categories } = await supabase
                    .from('event_categories')
                    .select('id, name, color')
                    .in('id', categoryIds);

                if (categories) {
                    categoriesMap = categories.reduce((acc: { [key: string]: any }, cat) => {
                        acc[cat.id] = cat;
                        return acc;
                    }, {});
                }
            }
        }

        // Transform related events to include category name and color
        const transformedRelatedEvents = finalRelatedEvents?.map(relatedEvent => {
            const category = categoriesMap[relatedEvent.category_id];
            return {
                ...relatedEvent,
                category_name: category?.name || 'Event',
                category_color: category?.color || '#22c55e',
                // Use existing date_range if available, otherwise format from dates
                date_range: relatedEvent.date_range ||
                    (relatedEvent.start_date && relatedEvent.end_date
                        ? `${new Date(relatedEvent.start_date).toLocaleDateString()} - ${new Date(relatedEvent.end_date).toLocaleDateString()}`
                        : relatedEvent.start_date
                            ? new Date(relatedEvent.start_date).toLocaleDateString()
                            : 'Date TBD')
            };
        }) || [];



        return NextResponse.json({
            event: transformedEvent,
            related_events: transformedRelatedEvents,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/events/[id] - Update single event
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role client to bypass RLS for admin operations
        const supabase = await createClient(true);

        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const { id } = await params;
        const eventData: Partial<EventInput> = await request.json();

        console.log('Updating event with ID:', id);
        console.log('Event data received:', eventData);

        // Clean data - convert empty strings to null for foreign key fields
        const cleanedEventData = {
            ...eventData,
            category_id: eventData.category_id && eventData.category_id.trim() !== '' ? eventData.category_id : null,
        };

        // Add metadata - using null since auth is disabled
        const eventWithMetadata = {
            ...cleanedEventData,
            updated_by: null,
        };

        console.log('Final event data for update:', eventWithMetadata);

        // First check if event exists
        const { data: existingEvent, error: checkError } = await supabase
            .from('events')
            .select('id, title')
            .eq('id', id)
            .single();

        if (checkError || !existingEvent) {
            console.error('Event not found:', checkError);
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        console.log('Found existing event:', existingEvent);

        // Update event
        const { data: event, error } = await supabase
            .from('events')
            .update(eventWithMetadata)
            .eq('id', id)
            .select(`
                *,
                category:event_categories(
                    id,
                    name,
                    slug,
                    color
                )
            `)
            .single();

        console.log('Update result:', { event, error });

        if (error) {
            console.error('Database error updating event:', error);

            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Event not found' },
                    { status: 404 }
                );
            }

            // Handle unique constraint violations
            if (error.code === '23505') {
                if (error.message.includes('slug')) {
                    return NextResponse.json(
                        { error: 'An event with this URL slug already exists' },
                        { status: 400 }
                    );
                }
                if (error.message.includes('title')) {
                    return NextResponse.json(
                        { error: 'An event with this title already exists' },
                        { status: 400 }
                    );
                }
                return NextResponse.json(
                    { error: 'Duplicate entry detected' },
                    { status: 400 }
                );
            }

            // Handle foreign key constraint violations
            if (error.code === '23503') {
                if (error.message.includes('category_id')) {
                    return NextResponse.json(
                        { error: 'Invalid category selected' },
                        { status: 400 }
                    );
                }
                return NextResponse.json(
                    { error: 'Invalid reference data' },
                    { status: 400 }
                );
            }

            // Handle not null constraint violations
            if (error.code === '23502') {
                return NextResponse.json(
                    { error: `Required field missing: ${error.message}` },
                    { status: 400 }
                );
            }

            // Handle RLS policy violations
            if (error.code === '42501' || error.message.includes('row-level security')) {
                return NextResponse.json(
                    { error: 'Permission denied - check RLS policies' },
                    { status: 403 }
                );
            }

            return NextResponse.json(
                { error: `Database error: ${error.message}` },
                { status: 500 }
            );
        }

        // Transform response
        const transformedEvent: Event = {
            ...event,
            category_name: event.category?.name,
            category_slug: event.category?.slug,
            category_color: event.category?.color,
        };

        return NextResponse.json({
            success: true,
            event: transformedEvent,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/events/[id] - Delete single event
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role client to bypass RLS for admin operations
        const supabase = await createClient(true);

        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const { id } = await params;

        // Check if event exists
        const { data: existingEvent, error: checkError } = await supabase
            .from('events')
            .select('id, title')
            .eq('id', id)
            .single();

        if (checkError) {
            if (checkError.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Event not found' },
                    { status: 404 }
                );
            }
            console.error('Error checking event:', checkError);
            return NextResponse.json(
                { error: 'Failed to check event' },
                { status: 500 }
            );
        }

        // Delete related images first (cascade should handle this, but being explicit)
        await supabase
            .from('event_images')
            .delete()
            .eq('event_id', id);

        // Delete event
        const { error: deleteError } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting event:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete event' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Event "${existingEvent.title}" deleted successfully`,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/events/[id] - Partial update (for quick actions like toggle active/featured)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role client to bypass RLS for admin operations
        const supabase = await createClient(true);

        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const { id } = await params;
        const { action, value } = await request.json();

        const updateData: any = { updated_by: null };

        switch (action) {
            case 'toggle_active':
                // Get current status first
                const { data: currentEvent } = await supabase
                    .from('events')
                    .select('is_active')
                    .eq('id', id)
                    .single();
                
                updateData.is_active = !currentEvent?.is_active;
                break;
                
            case 'toggle_featured':
                const { data: currentFeatured } = await supabase
                    .from('events')
                    .select('is_featured')
                    .eq('id', id)
                    .single();
                
                updateData.is_featured = !currentFeatured?.is_featured;
                break;
                
            case 'set_active':
                updateData.is_active = Boolean(value);
                break;
                
            case 'set_featured':
                updateData.is_featured = Boolean(value);
                break;
                
            case 'publish':
                updateData.published_at = new Date().toISOString();
                updateData.is_active = true;
                break;
                
            case 'unpublish':
                updateData.published_at = null;
                break;
                
            case 'set_display_order':
                updateData.display_order = parseInt(value) || 0;
                break;
                
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        const { data: event, error } = await supabase
            .from('events')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                category:event_categories(
                    id,
                    name,
                    slug,
                    color
                )
            `)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Event not found' },
                    { status: 404 }
                );
            }
            console.error('Error updating event:', error);
            return NextResponse.json(
                { error: 'Failed to update event' },
                { status: 500 }
            );
        }

        // Transform response
        const transformedEvent: Event = {
            ...event,
            category_name: event.category?.name,
            category_slug: event.category?.slug,
            category_color: event.category?.color,
        };

        return NextResponse.json({
            success: true,
            event: transformedEvent,
            action,
            message: `Event ${action} completed successfully`,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
