import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EventStatistics } from '@/types/events';

// GET /api/events/statistics - Fetch event statistics for admin dashboard
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        // Use the database function for statistics
        const { data: stats, error } = await supabase
            .rpc('get_event_statistics');

        if (error) {
            console.error('Error fetching statistics:', error);
            return NextResponse.json(
                { error: 'Failed to fetch statistics' },
                { status: 500 }
            );
        }

        // Get additional statistics not covered by the function
        const [
            upcomingEventsResult,
            pastEventsResult,
            draftEventsResult,
            recentSubmissionsResult
        ] = await Promise.all([
            // Upcoming events
            supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true)
                .not('published_at', 'is', null)
                .gte('start_date', new Date().toISOString()),
            
            // Past events
            supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true)
                .not('published_at', 'is', null)
                .lt('end_date', new Date().toISOString()),
            
            // Draft events
            supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .is('published_at', null),
            
            // Recent submissions (last 7 days)
            supabase
                .from('event_form_submissions')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        const statistics: EventStatistics & {
            upcoming_events: number;
            past_events: number;
            draft_events: number;
            recent_submissions: number;
        } = {
            ...stats[0],
            upcoming_events: upcomingEventsResult.count || 0,
            past_events: pastEventsResult.count || 0,
            draft_events: draftEventsResult.count || 0,
            recent_submissions: recentSubmissionsResult.count || 0,
        };

        return NextResponse.json({
            statistics,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/events/statistics/dashboard - Get comprehensive dashboard data
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        // Get comprehensive dashboard data
        const [
            statisticsResult,
            recentEventsResult,
            upcomingEventsResult,
            recentSubmissionsResult,
            categoriesResult
        ] = await Promise.all([
            // Basic statistics
            supabase.rpc('get_event_statistics'),
            
            // Recent events (last 10)
            supabase
                .from('events')
                .select(`
                    id,
                    title,
                    slug,
                    is_active,
                    is_featured,
                    created_at,
                    published_at,
                    category:event_categories(name, color)
                `)
                .order('created_at', { ascending: false })
                .limit(10),
            
            // Upcoming events (next 5)
            supabase
                .rpc('get_upcoming_events', { p_limit: 5 }),
            
            // Recent submissions (last 10)
            supabase
                .from('event_form_submissions')
                .select(`
                    id,
                    name,
                    email,
                    company_name,
                    status,
                    is_spam,
                    created_at,
                    event:events(title)
                `)
                .order('created_at', { ascending: false })
                .limit(10),
            
            // Categories with event counts
            supabase
                .from('event_categories')
                .select('*')
                .eq('is_active', true)
                .order('display_order')
        ]);

        // Get event counts per category
        const categoriesWithCounts = await Promise.all(
            (categoriesResult.data || []).map(async (category) => {
                const { count } = await supabase
                    .from('events')
                    .select('*', { count: 'exact', head: true })
                    .eq('category_id', category.id)
                    .eq('is_active', true);

                return {
                    ...category,
                    event_count: count || 0,
                };
            })
        );

        // Calculate trends (compare with previous period)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

        const [currentPeriodEvents, previousPeriodEvents] = await Promise.all([
            supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', thirtyDaysAgo),
            
            supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', sixtyDaysAgo)
                .lt('created_at', thirtyDaysAgo)
        ]);

        const eventsTrend = calculateTrend(
            currentPeriodEvents.count || 0,
            previousPeriodEvents.count || 0
        );

        const dashboardData = {
            statistics: statisticsResult.data?.[0] || {},
            recent_events: recentEventsResult.data || [],
            upcoming_events: upcomingEventsResult.data || [],
            recent_submissions: recentSubmissionsResult.data || [],
            categories: categoriesWithCounts,
            trends: {
                events: eventsTrend,
            },
        };

        return NextResponse.json({
            dashboard: dashboardData,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper function to calculate trend percentage
function calculateTrend(current: number, previous: number): {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'neutral';
} {
    if (previous === 0) {
        return {
            value: current,
            percentage: current > 0 ? 100 : 0,
            direction: current > 0 ? 'up' : 'neutral',
        };
    }

    const percentage = ((current - previous) / previous) * 100;
    
    return {
        value: current,
        percentage: Math.abs(percentage),
        direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral',
    };
}
