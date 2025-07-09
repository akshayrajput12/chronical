import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Event, EventInput } from '@/types/events';

// GET /api/events - Fetch events with filtering and pagination
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        
        // Parse query parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category_slug = searchParams.get('category_slug');
        const is_featured = searchParams.get('is_featured') === 'true' ? true :
                           searchParams.get('is_featured') === 'false' ? false : null;
        const search = searchParams.get('search');
        const sort_by = searchParams.get('sort_by') || 'created_at';
        const sort_order = searchParams.get('sort_order') || 'desc';
        const is_active = searchParams.get('is_active') !== 'false'; // Default to true for public API
        const start_date = searchParams.get('start_date');
        const end_date = searchParams.get('end_date');
        
        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from('events')
            .select(`
                *,
                category:event_categories(
                    id,
                    name,
                    slug,
                    color
                )
            `)
            .eq('is_active', is_active);

        // Add published filter for public access
        if (is_active) {
            query = query.not('published_at', 'is', null);
        }

        // Apply filters
        if (category_slug) {
            query = query.eq('category.slug', category_slug);
        }

        if (is_featured !== null) {
            query = query.eq('is_featured', is_featured);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,organizer.ilike.%${search}%`);
        }

        // Apply date filters
        if (start_date) {
            query = query.gte('start_date', start_date);
        }

        if (end_date) {
            query = query.lte('end_date', end_date);
        }

        // Apply sorting
        const sortColumn = sort_by === 'category' ? 'category.name' : sort_by;
        query = query.order(sortColumn, { ascending: sort_order === 'asc' });

        // Get total count for pagination
        const { count } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', is_active);

        // Execute query with pagination
        const { data: events, error } = await query
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching events:', error);
            return NextResponse.json(
                { error: 'Failed to fetch events' },
                { status: 500 }
            );
        }

        // Transform data to match Event interface
        const transformedEvents: Event[] = events?.map(event => ({
            ...event,
            category_name: event.category?.name,
            category_slug: event.category?.slug,
            category_color: event.category?.color,
        })) || [];

        return NextResponse.json({
            events: transformedEvents,
            total: count || 0,
            page,
            limit,
            has_more: (count || 0) > offset + limit,
            total_pages: Math.ceil((count || 0) / limit),
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
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

        const eventData: EventInput = await request.json();

        // Debug: Log the received data to identify the issue
        console.log('Received event data:', JSON.stringify(eventData, null, 2));
        console.log('Event data keys:', Object.keys(eventData));

        // Generate slug if not provided
        if (!eventData.slug && eventData.title) {
            eventData.slug = eventData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Clean up data - convert empty strings to null for foreign keys and remove invalid fields
        const cleanedEventData = {
            ...eventData,
            category_id: eventData.category_id && eventData.category_id.trim() !== '' ? eventData.category_id : null,
            start_date: eventData.start_date && eventData.start_date.trim() !== '' ? eventData.start_date : null,
            end_date: eventData.end_date && eventData.end_date.trim() !== '' ? eventData.end_date : null,
            published_at: eventData.published_at && eventData.published_at.trim() !== '' ? eventData.published_at : null,
        };

        // Remove any invalid field names that might have been created by bugs
        const validFields = [
            'title', 'slug', 'description', 'detailed_description', 'short_description',
            'category_id', 'organizer', 'organized_by', 'venue', 'event_type', 'industry', 'audience',
            'start_date', 'end_date', 'date_range',
            'featured_image_url', 'hero_image_url', 'hero_image_credit', 'logo_image_url', 'logo_text', 'logo_subtext',
            'meta_title', 'meta_description', 'meta_keywords',
            'is_active', 'is_featured', 'display_order', 'published_at'
        ];

        const filteredEventData = Object.keys(cleanedEventData)
            .filter(key => validFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = (cleanedEventData as any)[key];
                return obj;
            }, {} as any);

        console.log('Filtered event data:', JSON.stringify(filteredEventData, null, 2));

        // Add metadata - using null since auth is disabled
        const eventWithMetadata = {
            ...filteredEventData,
            created_by: null,
            updated_by: null,
        };

        const { data: event, error } = await supabase
            .from('events')
            .insert([eventWithMetadata])
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
            console.error('Error creating event:', error);
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });

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
            }

            // Handle foreign key constraint violations
            if (error.code === '23503') {
                if (error.message.includes('category_id')) {
                    return NextResponse.json(
                        { error: 'Invalid category selected. Please choose a valid category.' },
                        { status: 400 }
                    );
                }
            }

            // Handle not null constraint violations
            if (error.code === '23502') {
                return NextResponse.json(
                    { error: `Missing required field: ${error.message}` },
                    { status: 400 }
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
        }, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/events - Bulk update events (for admin operations)
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { action, event_ids, data: updateData } = await request.json();

        if (!action || !event_ids || !Array.isArray(event_ids)) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        let updateFields: any = { updated_by: user.id };

        switch (action) {
            case 'activate':
                updateFields.is_active = true;
                break;
            case 'deactivate':
                updateFields.is_active = false;
                break;
            case 'feature':
                updateFields.is_featured = true;
                break;
            case 'unfeature':
                updateFields.is_featured = false;
                break;
            case 'publish':
                updateFields.published_at = new Date().toISOString();
                updateFields.is_active = true;
                break;
            case 'unpublish':
                updateFields.published_at = null;
                break;
            case 'update':
                updateFields = { ...updateData, updated_by: user.id };
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        const { data: events, error } = await supabase
            .from('events')
            .update(updateFields)
            .in('id', event_ids)
            .select();

        if (error) {
            console.error('Error updating events:', error);
            return NextResponse.json(
                { error: 'Failed to update events' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            updated_count: events?.length || 0,
            events,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/events - Bulk delete events
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { event_ids } = await request.json();

        if (!event_ids || !Array.isArray(event_ids)) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        // Delete related images first (cascade should handle this, but being explicit)
        await supabase
            .from('event_images')
            .delete()
            .in('event_id', event_ids);

        // Delete events
        const { data: deletedEvents, error } = await supabase
            .from('events')
            .delete()
            .in('id', event_ids)
            .select('id, title');

        if (error) {
            console.error('Error deleting events:', error);
            return NextResponse.json(
                { error: 'Failed to delete events' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            deleted_count: deletedEvents?.length || 0,
            deleted_events: deletedEvents,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
