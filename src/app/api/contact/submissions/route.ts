import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactFormSubmissionsResponse, ContactSubmissionQueryParams } from "@/types/contact";

// GET /api/contact/submissions - Get contact form submissions (admin only)
export async function GET(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const params: ContactSubmissionQueryParams = {
            page: parseInt(searchParams.get('page') || '1'),
            limit: parseInt(searchParams.get('limit') || '20'),
            status: searchParams.get('status') as any,
            search: searchParams.get('search') || undefined,
            start_date: searchParams.get('start_date') || undefined,
            end_date: searchParams.get('end_date') || undefined,
            is_spam: searchParams.get('is_spam') === 'true' ? true : 
                     searchParams.get('is_spam') === 'false' ? false : undefined
        };

        // Build query
        let query = supabase
            .from("contact_form_submissions")
            .select("*", { count: 'exact' });

        // Apply filters
        if (params.status) {
            query = query.eq('status', params.status);
        }

        if (params.is_spam !== undefined) {
            query = query.eq('is_spam', params.is_spam);
        }

        if (params.search) {
            query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,company_name.ilike.%${params.search}%,message.ilike.%${params.search}%`);
        }

        if (params.start_date) {
            query = query.gte('created_at', params.start_date);
        }

        if (params.end_date) {
            query = query.lte('created_at', params.end_date);
        }

        // Apply pagination
        const offset = ((params.page || 1) - 1) * (params.limit || 20);
        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + (params.limit || 20) - 1);

        const { data: submissions, error: fetchError, count } = await query;

        if (fetchError) {
            console.error("Submissions fetch error:", fetchError);
            throw fetchError;
        }

        // Debug logging
        console.log("Fetched submissions count:", count);
        console.log("Fetched submissions data:", submissions?.length || 0, "items");

        const response: ContactFormSubmissionsResponse = {
            success: true,
            data: submissions || [],
            total: count || 0,
            page: params.page || 1,
            limit: params.limit || 20
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("Contact submissions fetch error:", error);
        
        const response: ContactFormSubmissionsResponse = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch contact submissions"
        };

        return NextResponse.json(response, { status: 500 });
    }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
