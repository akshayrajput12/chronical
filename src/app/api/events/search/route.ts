import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EventSearchResult, EventSearchResponse } from '@/types/events';

// GET /api/events/search - Search events with relevance scoring
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        
        const query = searchParams.get('q') || searchParams.get('query');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category_slug = searchParams.get('category');
        const event_type = searchParams.get('type');
        const venue = searchParams.get('venue');
        const organizer = searchParams.get('organizer');
        
        if (!query || query.trim().length < 2) {
            return NextResponse.json(
                { error: 'Search query must be at least 2 characters long' },
                { status: 400 }
            );
        }

        const offset = (page - 1) * limit;
        const searchTerm = query.trim();

        // Use the database search function for better performance and relevance
        const { data: searchResults, error } = await supabase
            .rpc('search_events', {
                p_search_term: searchTerm,
                p_limit: limit,
                p_offset: offset
            });

        if (error) {
            console.error('Error searching events:', error);
            return NextResponse.json(
                { error: 'Failed to search events' },
                { status: 500 }
            );
        }

        // Apply additional filters if provided
        let filteredResults = searchResults || [];

        if (category_slug) {
            filteredResults = filteredResults.filter(
                (event: any) => event.category_slug === category_slug
            );
        }

        if (event_type) {
            filteredResults = filteredResults.filter(
                (event: any) => event.event_type?.toLowerCase().includes(event_type.toLowerCase())
            );
        }

        if (venue) {
            filteredResults = filteredResults.filter(
                (event: any) => event.venue?.toLowerCase().includes(venue.toLowerCase())
            );
        }

        if (organizer) {
            filteredResults = filteredResults.filter(
                (event: any) => event.organizer?.toLowerCase().includes(organizer.toLowerCase())
            );
        }

        // Get total count for pagination (approximate for performance)
        const totalResults = filteredResults.length;
        const hasMore = totalResults === limit; // Approximate check

        const response: EventSearchResponse = {
            results: filteredResults,
            total: totalResults,
            query: searchTerm,
            page,
            limit,
            has_more: hasMore,
            filters: {
                category_slug: category_slug || undefined,
                event_type: event_type || undefined,
                venue: venue || undefined,
                organizer: organizer || undefined,
            },
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/events/search - Advanced search with complex filters
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        const {
            query,
            filters = {},
            page = 1,
            limit = 10,
            sort_by = 'relevance',
            sort_order = 'desc'
        } = await request.json();

        if (!query || query.trim().length < 2) {
            return NextResponse.json(
                { error: 'Search query must be at least 2 characters long' },
                { status: 400 }
            );
        }

        const offset = (page - 1) * limit;
        const searchTerm = query.trim();

        // Build advanced search query
        let searchQuery = supabase
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
            .eq('is_active', true)
            .not('published_at', 'is', null);

        // Apply text search
        searchQuery = searchQuery.or(
            `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,organizer.ilike.%${searchTerm}%,venue.ilike.%${searchTerm}%`
        );

        // Apply filters
        if (filters.category_id) {
            searchQuery = searchQuery.eq('category_id', filters.category_id);
        }

        if (filters.event_type) {
            searchQuery = searchQuery.ilike('event_type', `%${filters.event_type}%`);
        }

        if (filters.industry) {
            searchQuery = searchQuery.ilike('industry', `%${filters.industry}%`);
        }

        if (filters.audience) {
            searchQuery = searchQuery.ilike('audience', `%${filters.audience}%`);
        }

        if (filters.venue) {
            searchQuery = searchQuery.ilike('venue', `%${filters.venue}%`);
        }

        if (filters.organizer) {
            searchQuery = searchQuery.ilike('organizer', `%${filters.organizer}%`);
        }

        if (filters.is_featured !== undefined) {
            searchQuery = searchQuery.eq('is_featured', filters.is_featured);
        }

        // Date range filters
        if (filters.start_date) {
            searchQuery = searchQuery.gte('start_date', filters.start_date);
        }

        if (filters.end_date) {
            searchQuery = searchQuery.lte('end_date', filters.end_date);
        }

        // Apply sorting
        if (sort_by === 'relevance') {
            // For relevance, we'll use a simple scoring based on where the match occurs
            // This is a simplified version - the database function provides better scoring
            searchQuery = searchQuery.order('is_featured', { ascending: false });
            searchQuery = searchQuery.order('created_at', { ascending: false });
        } else {
            const ascending = sort_order === 'asc';
            switch (sort_by) {
                case 'title':
                    searchQuery = searchQuery.order('title', { ascending });
                    break;
                case 'date':
                case 'start_date':
                    searchQuery = searchQuery.order('start_date', { ascending });
                    break;
                case 'created_at':
                    searchQuery = searchQuery.order('created_at', { ascending });
                    break;
                case 'organizer':
                    searchQuery = searchQuery.order('organizer', { ascending });
                    break;
                default:
                    searchQuery = searchQuery.order('created_at', { ascending: false });
            }
        }

        // Execute query with pagination
        const { data: events, error, count } = await searchQuery
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error in advanced search:', error);
            return NextResponse.json(
                { error: 'Failed to search events' },
                { status: 500 }
            );
        }

        // Calculate relevance scores for results
        const resultsWithScores: EventSearchResult[] = (events || []).map(event => {
            let score = 0;
            const titleMatch = event.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const descMatch = event.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const organizerMatch = event.organizer?.toLowerCase().includes(searchTerm.toLowerCase());
            const venueMatch = event.venue?.toLowerCase().includes(searchTerm.toLowerCase());

            if (titleMatch) score += 3;
            if (descMatch) score += 2;
            if (organizerMatch) score += 1.5;
            if (venueMatch) score += 1;
            if (event.is_featured) score += 0.5;

            return {
                ...event,
                category_name: event.category?.name,
                category_slug: event.category?.slug,
                category_color: event.category?.color,
                relevance_score: score,
            };
        });

        // Sort by relevance if requested
        if (sort_by === 'relevance') {
            resultsWithScores.sort((a, b) => b.relevance_score - a.relevance_score);
        }

        const response: EventSearchResponse = {
            results: resultsWithScores,
            total: count || 0,
            query: searchTerm,
            page,
            limit,
            has_more: (count || 0) > offset + limit,
            filters,
            sort_by,
            sort_order,
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/events/search/suggestions - Get search suggestions
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        
        const query = searchParams.get('q') || '';
        const limit = parseInt(searchParams.get('limit') || '5');

        if (!query || query.trim().length < 2) {
            return NextResponse.json({
                suggestions: [],
            });
        }

        const searchTerm = query.trim();

        // Get suggestions from different fields
        const [titleSuggestions, organizerSuggestions, venueSuggestions] = await Promise.all([
            // Title suggestions
            supabase
                .from('events')
                .select('title')
                .eq('is_active', true)
                .not('published_at', 'is', null)
                .ilike('title', `%${searchTerm}%`)
                .limit(limit),

            // Organizer suggestions
            supabase
                .from('events')
                .select('organizer')
                .eq('is_active', true)
                .not('published_at', 'is', null)
                .ilike('organizer', `%${searchTerm}%`)
                .not('organizer', 'is', null)
                .limit(limit),

            // Venue suggestions
            supabase
                .from('events')
                .select('venue')
                .eq('is_active', true)
                .not('published_at', 'is', null)
                .ilike('venue', `%${searchTerm}%`)
                .not('venue', 'is', null)
                .limit(limit),
        ]);

        // Combine and deduplicate suggestions
        const suggestions = [
            ...(titleSuggestions.data || []).map(item => ({
                text: item.title,
                type: 'title',
            })),
            ...(organizerSuggestions.data || []).map(item => ({
                text: item.organizer,
                type: 'organizer',
            })),
            ...(venueSuggestions.data || []).map(item => ({
                text: item.venue,
                type: 'venue',
            })),
        ];

        // Remove duplicates and limit results
        const uniqueSuggestions = suggestions
            .filter((item, index, self) => 
                self.findIndex(s => s.text === item.text) === index
            )
            .slice(0, limit);

        return NextResponse.json({
            suggestions: uniqueSuggestions,
            query: searchTerm,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
