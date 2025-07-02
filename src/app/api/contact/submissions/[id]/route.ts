import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactFormSubmissionResponse, ContactFormSubmissionUpdate } from "@/types/contact";

// GET /api/contact/submissions/[id] - Get single submission (admin only)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);
        const { id } = await params;

        const { data: submission, error: fetchError } = await supabase
            .from("contact_form_submissions")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: "Submission not found"
                }, { status: 404 });
            }
            throw fetchError;
        }

        const response: ContactFormSubmissionResponse = {
            success: true,
            data: submission
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("Contact submission fetch error:", error);
        
        const response: ContactFormSubmissionResponse = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch contact submission"
        };

        return NextResponse.json(response, { status: 500 });
    }
}

// PATCH /api/contact/submissions/[id] - Update submission (admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);
        const { id } = await params;

        const updateData: ContactFormSubmissionUpdate = await request.json();

        // Prepare update object
        const updateObject: any = {};

        if (updateData.status) {
            updateObject.status = updateData.status;
        }

        if (updateData.is_spam !== undefined) {
            updateObject.is_spam = updateData.is_spam;
        }

        if (updateData.admin_notes !== undefined) {
            updateObject.admin_notes = updateData.admin_notes;
        }

        if (updateData.handled_by) {
            updateObject.handled_by = updateData.handled_by;
            updateObject.handled_at = new Date().toISOString();
        }

        // Update submission
        const { data: updatedSubmission, error: updateError } = await supabase
            .from("contact_form_submissions")
            .update(updateObject)
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            if (updateError.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: "Submission not found"
                }, { status: 404 });
            }
            throw updateError;
        }

        const response: ContactFormSubmissionResponse = {
            success: true,
            data: updatedSubmission
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("Contact submission update error:", error);
        
        const response: ContactFormSubmissionResponse = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update contact submission"
        };

        return NextResponse.json(response, { status: 500 });
    }
}

// DELETE /api/contact/submissions/[id] - Delete submission (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);
        const { id } = await params;

        const { error: deleteError } = await supabase
            .from("contact_form_submissions")
            .delete()
            .eq("id", id);

        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({
            success: true
        });

    } catch (error) {
        console.error("Contact submission delete error:", error);
        
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete contact submission"
        }, { status: 500 });
    }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
