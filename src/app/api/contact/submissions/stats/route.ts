import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactSubmissionStats } from "@/types/contact";

// GET /api/contact/submissions/stats - Get submission statistics
export async function GET(request: NextRequest) {
    try {
        // Use service role for admin operations
        const supabase = await createClient(true);

        const { data, error } = await supabase
            .from("contact_form_submissions")
            .select("status, is_spam, created_at");

        if (error) {
            console.error("Error fetching submission stats:", error);
            return NextResponse.json(
                { error: "Failed to fetch submission stats" },
                { status: 500 }
            );
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const stats: ContactSubmissionStats = {
            total: data.length,
            new: 0,
            read: 0,
            replied: 0,
            archived: 0,
            spam: 0,
            today: 0,
            this_week: 0,
            this_month: 0
        };

        data.forEach(submission => {
            // Status counts
            if (submission.status === 'new') stats.new++;
            else if (submission.status === 'read') stats.read++;
            else if (submission.status === 'replied') stats.replied++;
            else if (submission.status === 'archived') stats.archived++;
            
            // Spam count
            if (submission.is_spam) stats.spam++;
            
            // Date-based counts
            const submissionDate = new Date(submission.created_at);
            if (submissionDate >= today) stats.today++;
            if (submissionDate >= thisWeek) stats.this_week++;
            if (submissionDate >= thisMonth) stats.this_month++;
        });

        return NextResponse.json(stats);

    } catch (error) {
        console.error("Error in GET /api/contact/submissions/stats:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
