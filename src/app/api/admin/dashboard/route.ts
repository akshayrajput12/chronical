import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
    totalPages: number;
    totalEvents: number;
    totalBlogPosts: number;
    totalCities: number;
    totalFormSubmissions: number;
    newSubmissionsToday: number;
    publishedEvents: number;
    publishedBlogs: number;
    recentActivity: Array<{
        type: string;
        title: string;
        timestamp: string;
        status: string;
    }>;
}

// GET /api/admin/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient(true); // Use service role for admin operations

        // Initialize stats object
        const stats: DashboardStats = {
            totalPages: 8, // Static count of main pages
            totalEvents: 0,
            totalBlogPosts: 0,
            totalCities: 0,
            totalFormSubmissions: 0,
            newSubmissionsToday: 0,
            publishedEvents: 0,
            publishedBlogs: 0,
            recentActivity: []
        };

        // Get events statistics
        const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('id, title, published_at, is_active, created_at')
            .order('created_at', { ascending: false });

        if (!eventsError && eventsData) {
            stats.totalEvents = eventsData.length;
            stats.publishedEvents = eventsData.filter(event => 
                event.published_at && event.is_active
            ).length;

            // Add recent events to activity
            eventsData.slice(0, 3).forEach(event => {
                stats.recentActivity.push({
                    type: 'event',
                    title: `Event: ${event.title}`,
                    timestamp: event.created_at,
                    status: event.published_at && event.is_active ? 'published' : 'draft'
                });
            });
        }

        // Get blog posts statistics
        const { data: blogData, error: blogError } = await supabase
            .from('blog_posts')
            .select('id, title, status, published_at, created_at')
            .order('created_at', { ascending: false });

        if (!blogError && blogData) {
            stats.totalBlogPosts = blogData.length;
            stats.publishedBlogs = blogData.filter(post => 
                post.status === 'published' && post.published_at
            ).length;

            // Add recent blog posts to activity
            blogData.slice(0, 3).forEach(post => {
                stats.recentActivity.push({
                    type: 'blog',
                    title: `Blog: ${post.title}`,
                    timestamp: post.created_at,
                    status: post.status
                });
            });
        }

        // Get cities statistics
        const { data: citiesData, error: citiesError } = await supabase
            .from('cities')
            .select('id, name, is_active, created_at')
            .order('created_at', { ascending: false });

        if (!citiesError && citiesData) {
            stats.totalCities = citiesData.length;

            // Add recent cities to activity
            citiesData.slice(0, 2).forEach(city => {
                stats.recentActivity.push({
                    type: 'city',
                    title: `City: ${city.name}`,
                    timestamp: city.created_at,
                    status: city.is_active ? 'active' : 'inactive'
                });
            });
        }

        // Get form submissions statistics
        const { data: submissionsData, error: submissionsError } = await supabase
            .from('contact_form_submissions')
            .select('id, name, message, status, created_at')
            .order('created_at', { ascending: false });

        if (!submissionsError && submissionsData) {
            stats.totalFormSubmissions = submissionsData.length;

            // Count submissions from today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            stats.newSubmissionsToday = submissionsData.filter(submission => {
                const submissionDate = new Date(submission.created_at);
                return submissionDate >= today;
            }).length;

            // Add recent form submissions to activity
            submissionsData.slice(0, 3).forEach(submission => {
                const messagePreview = submission.message.length > 50 
                    ? submission.message.substring(0, 50) + '...'
                    : submission.message;
                
                stats.recentActivity.push({
                    type: 'form',
                    title: `Form: ${submission.name} - ${messagePreview}`,
                    timestamp: submission.created_at,
                    status: submission.status
                });
            });
        }

        // Sort recent activity by timestamp (most recent first)
        stats.recentActivity.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // Limit to 10 most recent activities
        stats.recentActivity = stats.recentActivity.slice(0, 10);

        return NextResponse.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch dashboard statistics"
        }, { status: 500 });
    }
}
