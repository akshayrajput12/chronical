import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactGroupCompanyInput } from "@/types/contact";

// GET /api/contact/companies - Get all group companies (admin only)
export async function GET(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        const { data: companies, error: fetchError } = await supabase
            .from("contact_group_companies")
            .select("*")
            .order("sort_order", { ascending: true });

        if (fetchError) {
            console.error("Database error:", fetchError);
            return NextResponse.json({
                success: false,
                error: "Failed to fetch companies"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: companies || []
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}

// POST /api/contact/companies - Create new group company (admin only)
export async function POST(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        const companyData: ContactGroupCompanyInput = await request.json();

        // Validate required fields
        if (!companyData.region?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Region is required"
            }, { status: 400 });
        }

        if (!companyData.address?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Address is required"
            }, { status: 400 });
        }

        if (!companyData.phone?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Phone is required"
            }, { status: 400 });
        }

        if (!companyData.email?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Email is required"
            }, { status: 400 });
        }

        // Validate URL format if provided
        if (companyData.company_url && companyData.company_url.trim()) {
            const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
            if (!urlPattern.test(companyData.company_url.trim())) {
                return NextResponse.json({
                    success: false,
                    error: "Please enter a valid URL (must start with http:// or https://)"
                }, { status: 400 });
            }
        }

        // Set default sort_order if not provided
        if (companyData.sort_order === undefined) {
            const { count } = await supabase
                .from("contact_group_companies")
                .select("*", { count: 'exact', head: true });

            companyData.sort_order = (count || 0) + 1;
        }

        const { data: newCompany, error: insertError } = await supabase
            .from("contact_group_companies")
            .insert(companyData)
            .select()
            .single();

        if (insertError) {
            console.error("Database error:", insertError);
            return NextResponse.json({
                success: false,
                error: "Failed to create company"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: newCompany
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}
