import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/contact/test-submissions - Test database connection and data
export async function GET(request: NextRequest) {
    try {
        // Use service role for admin operations
        const supabase = await createClient(true);

        // Test basic connection
        console.log("Testing database connection...");

        // Get all submissions without any filters
        const { data: allSubmissions, error: allError, count } = await supabase
            .from("contact_form_submissions")
            .select("*", { count: 'exact' });

        console.log("All submissions query result:");
        console.log("- Error:", allError);
        console.log("- Count:", count);
        console.log("- Data length:", allSubmissions?.length || 0);
        console.log("- First submission:", allSubmissions?.[0] || "None");

        if (allError) {
            return NextResponse.json({
                success: false,
                error: allError.message,
                details: allError
            }, { status: 500 });
        }

        // Test table structure
        const { data: tableInfo, error: tableError } = await supabase
            .from("contact_form_submissions")
            .select("*")
            .limit(1);

        return NextResponse.json({
            success: true,
            totalCount: count,
            submissions: allSubmissions || [],
            sampleSubmission: tableInfo?.[0] || null,
            message: `Found ${count || 0} submissions in contact_form_submissions table`
        });

    } catch (error) {
        console.error("Test submissions error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            details: error
        }, { status: 500 });
    }
}
