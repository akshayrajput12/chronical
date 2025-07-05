import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Test endpoint to verify contact form submission works
export async function POST(request: NextRequest) {
    try {
        console.log("Test contact submission started");
        const supabase = await createClient(true); // Use service role
        
        // Test data
        const testData = {
            name: "Test User",
            exhibition_name: "Test Exhibition",
            company_name: "Test Company",
            email: "test@example.com",
            phone: "+1234567890",
            budget: "10000-20000",
            message: "[QUOTATION REQUEST] This is a test submission",
            agreed_to_terms: true,
            status: 'new',
            is_spam: false,
            spam_score: 0.0,
            ip_address: '127.0.0.1',
            user_agent: 'test-agent',
            referrer: 'test'
        };

        console.log("Inserting test data:", testData);

        // Try to insert test data
        const { data: insertedSubmission, error: insertError } = await supabase
            .from("contact_form_submissions")
            .insert(testData)
            .select()
            .single();

        if (insertError) {
            console.error("Test insert error:", insertError);
            return NextResponse.json({
                success: false,
                error: insertError.message,
                details: insertError
            }, { status: 500 });
        }

        console.log("Test submission successful:", insertedSubmission);

        return NextResponse.json({
            success: true,
            message: "Test submission successful",
            data: insertedSubmission
        });

    } catch (error) {
        console.error("Test submission error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            details: error
        }, { status: 500 });
    }
}

// GET endpoint to check if the table exists and is accessible
export async function GET(request: NextRequest) {
    try {
        console.log("Test contact table access");
        const supabase = await createClient(true); // Use service role
        
        // Try to count records in the table
        const { count, error } = await supabase
            .from("contact_form_submissions")
            .select("*", { count: 'exact', head: true });

        if (error) {
            console.error("Table access error:", error);
            return NextResponse.json({
                success: false,
                error: error.message,
                details: error
            }, { status: 500 });
        }

        console.log("Table accessible, record count:", count);

        return NextResponse.json({
            success: true,
            message: "Table is accessible",
            recordCount: count
        });

    } catch (error) {
        console.error("Table access test error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            details: error
        }, { status: 500 });
    }
}
