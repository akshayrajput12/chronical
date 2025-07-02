import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

// PATCH /api/events/submissions/[id] - Update submission status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServiceClient();
        const { status, admin_notes } = await request.json();
        const { id: submissionId } = await params;

        // Update the submission
        const { data, error } = await supabase
            .from('event_form_submissions')
            .update({
                status,
                admin_notes,
                updated_at: new Date().toISOString(),
            })
            .eq('id', submissionId)
            .select()
            .single();

        if (error) {
            console.error('Error updating submission:', error);
            return NextResponse.json(
                { error: 'Failed to update submission' },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            message: 'Submission updated successfully',
            submission: data 
        });

    } catch (error) {
        console.error('Error in PATCH /api/events/submissions/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/events/submissions/[id] - Delete submission
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServiceClient();
        const { id: submissionId } = await params;

        // Delete the submission
        const { error } = await supabase
            .from('event_form_submissions')
            .delete()
            .eq('id', submissionId);

        if (error) {
            console.error('Error deleting submission:', error);
            return NextResponse.json(
                { error: 'Failed to delete submission' },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            message: 'Submission deleted successfully'
        });

    } catch (error) {
        console.error('Error in DELETE /api/events/submissions/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/events/submissions/[id] - Get single submission (for view details)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createServiceClient();
        const { id: submissionId } = await params;

        // Fetch the submission with event details
        const { data: submission, error } = await supabase
            .from('event_form_submissions')
            .select(`
                *,
                event:events(
                    id,
                    title,
                    slug,
                    start_date,
                    end_date,
                    venue
                )
            `)
            .eq('id', submissionId)
            .single();

        if (error) {
            console.error('Error fetching submission:', error);
            return NextResponse.json(
                { error: 'Submission not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ submission });

    } catch (error) {
        console.error('Error in GET /api/events/submissions/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
