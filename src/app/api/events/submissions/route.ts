import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { EventFormSubmission, EventFormSubmissionInput } from '@/types/events';

// GET /api/events/submissions - Fetch form submissions with filtering
export async function GET(request: NextRequest) {
    try {
        // Use service client for admin operations to bypass RLS
        const supabase = createServiceClient();

        // Note: Authentication should be handled by middleware or session management
        // For now, using service client to ensure admin can access all submissions

        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status');
        const event_id = searchParams.get('event_id');
        const search = searchParams.get('search');
        const is_spam = searchParams.get('is_spam') === 'true';
        const sort_by = searchParams.get('sort_by') || 'created_at';
        const sort_order = searchParams.get('sort_order') || 'desc';

        const offset = (page - 1) * limit;



        // Build query
        let query = supabase
            .from('event_form_submissions')
            .select(`
                *,
                event:events(
                    id,
                    title,
                    slug
                )
            `);

        // Apply filters
        if (status) {
            query = query.eq('status', status);
        }

        if (event_id) {
            query = query.eq('event_id', event_id);
        }

        if (is_spam !== null) {
            query = query.eq('is_spam', is_spam);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%,message.ilike.%${search}%`);
        }

        // Apply sorting
        query = query.order(sort_by, { ascending: sort_order === 'asc' });

        // Get total count for pagination
        const { count, error: countError } = await supabase
            .from('event_form_submissions')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('Error getting count:', countError);
        }

        // Execute query with pagination
        const { data: submissions, error } = await query
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching submissions:', error);
            return NextResponse.json(
                { error: 'Failed to fetch submissions', details: error.message },
                { status: 500 }
            );
        }

        const totalPages = Math.ceil((count || 0) / limit);

        const response = {
            submissions: submissions || [],
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_count: count || 0,
                per_page: limit,
                has_next: page < totalPages,
                has_prev: page > 1
            }
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

// POST /api/events/submissions - Create new form submission (public endpoint)
export async function POST(request: NextRequest) {
    try {
        // Use service client to bypass RLS for form submissions
        const supabase = createServiceClient();
        
        const submissionData: EventFormSubmissionInput = await request.json();

        // Get client IP and user agent for tracking
        const ip = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const referrer = request.headers.get('referer') || 'direct';

        // Basic spam detection
        const isSpam = detectSpam(submissionData);

        // Prepare submission data with all the fields the form sends
        // After running the migration script, these columns should exist
        const submissionForDB: any = {
            name: submissionData.name,
            email: submissionData.email,
            ip_address: ip,
            user_agent: userAgent,
            referrer,
            is_spam: isSpam,
            status: isSpam ? 'archived' : 'new',
        };

        // Add event_id if provided
        if (submissionData.event_id) {
            submissionForDB.event_id = submissionData.event_id;
        }

        // Add optional fields only if they have values
        if (submissionData.phone) {
            submissionForDB.phone = submissionData.phone;
        }
        if (submissionData.message) {
            submissionForDB.message = submissionData.message;
        }
        if (submissionData.attachment_url) {
            submissionForDB.attachment_url = submissionData.attachment_url;
        }

        // Add the form-specific fields (these will be added by the migration script)
        if (submissionData.company_name) {
            submissionForDB.company_name = submissionData.company_name;
        }
        if (submissionData.exhibition_name) {
            submissionForDB.exhibition_name = submissionData.exhibition_name;
        }
        if (submissionData.budget) {
            submissionForDB.budget = submissionData.budget;
        }
        if (submissionData.attachment_filename) {
            submissionForDB.attachment_filename = submissionData.attachment_filename;
        }
        if (submissionData.attachment_size) {
            submissionForDB.attachment_size = submissionData.attachment_size;
        }

        console.log('Attempting to insert submission:', JSON.stringify(submissionForDB, null, 2));

        const { data: submission, error } = await supabase
            .from('event_form_submissions')
            .insert([submissionForDB])
            .select(`
                *,
                event:events(
                    id,
                    title,
                    slug
                )
            `)
            .single();

        if (error) {
            console.error('Error creating submission:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            console.error('Attempted to insert:', JSON.stringify(submissionForDB, null, 2));

            // Return more specific error information
            return NextResponse.json(
                {
                    error: 'Failed to submit form',
                    details: error.message,
                    code: error.code
                },
                { status: 500 }
            );
        }

        // TODO: Send email notification to admin
        // TODO: Send confirmation email to user

        return NextResponse.json({
            success: true,
            message: 'Form submitted successfully',
            submission_id: submission.id,
        }, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/events/submissions - Bulk update submissions
export async function PUT(request: NextRequest) {
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

        const { action, submission_ids, data: updateData } = await request.json();

        if (!action || !submission_ids || !Array.isArray(submission_ids)) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        let updateFields: any = {};

        switch (action) {
            case 'mark_read':
                updateFields.status = 'read';
                break;
            case 'mark_unread':
                updateFields.status = 'new';
                break;
            case 'mark_replied':
                updateFields.status = 'replied';
                break;
            case 'archive':
                updateFields.status = 'archived';
                break;
            case 'mark_spam':
                updateFields.is_spam = true;
                updateFields.status = 'archived';
                break;
            case 'mark_not_spam':
                updateFields.is_spam = false;
                updateFields.status = 'new';
                break;
            case 'update':
                updateFields = updateData;
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        const { data: submissions, error } = await supabase
            .from('event_form_submissions')
            .update(updateFields)
            .in('id', submission_ids)
            .select();

        if (error) {
            console.error('Error updating submissions:', error);
            return NextResponse.json(
                { error: 'Failed to update submissions' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            updated_count: submissions?.length || 0,
            submissions,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/events/submissions - Bulk delete submissions
export async function DELETE(request: NextRequest) {
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

        const { submission_ids } = await request.json();

        if (!submission_ids || !Array.isArray(submission_ids)) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        // Delete submissions
        const { data: deletedSubmissions, error } = await supabase
            .from('event_form_submissions')
            .delete()
            .in('id', submission_ids)
            .select('id, name, email');

        if (error) {
            console.error('Error deleting submissions:', error);
            return NextResponse.json(
                { error: 'Failed to delete submissions' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            deleted_count: deletedSubmissions?.length || 0,
            deleted_submissions: deletedSubmissions,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Simple spam detection function
function detectSpam(submission: EventFormSubmissionInput): boolean {
    const spamKeywords = [
        'viagra', 'casino', 'lottery', 'winner', 'congratulations',
        'click here', 'free money', 'make money fast', 'work from home',
        'weight loss', 'lose weight', 'diet pills', 'crypto', 'bitcoin'
    ];

    const text = `${submission.name} ${submission.email} ${submission.message}`.toLowerCase();
    
    // Check for spam keywords
    const hasSpamKeywords = spamKeywords.some(keyword => text.includes(keyword));
    
    // Check for suspicious patterns
    const hasMultipleUrls = (text.match(/https?:\/\//g) || []).length > 2;
    const hasExcessiveCaps = text.replace(/[^A-Z]/g, '').length > text.length * 0.3;
    const hasRepeatedChars = /(.)\1{4,}/.test(text);
    
    // Check email domain
    const suspiciousDomains = ['tempmail', 'guerrillamail', '10minutemail', 'mailinator'];
    const emailDomain = submission.email.split('@')[1]?.toLowerCase() || '';
    const hasSuspiciousDomain = suspiciousDomains.some(domain => emailDomain.includes(domain));
    
    return hasSpamKeywords || hasMultipleUrls || hasExcessiveCaps || hasRepeatedChars || hasSuspiciousDomain;
}
