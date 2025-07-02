import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/contact/submissions/[id]/reply - Send reply to submission
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { message } = await request.json();
        
        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Use service role for admin operations
        const supabase = await createClient(true);

        const { error } = await supabase
            .from("contact_form_submissions")
            .update({
                status: 'replied',
                admin_notes: message,
                updated_at: new Date().toISOString()
            })
            .eq("id", params.id);

        if (error) {
            console.error("Error sending reply:", error);
            return NextResponse.json(
                { error: "Failed to send reply" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error in POST /api/contact/submissions/[id]/reply:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
