import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactGroupCompanyInput } from "@/types/contact";

// GET /api/contact/companies/[id] - Get single company (admin only)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);
        const { id } = await params;

        const { data: company, error: fetchError } = await supabase
            .from("contact_group_companies")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: "Company not found"
                }, { status: 404 });
            }
            
            console.error("Database error:", fetchError);
            return NextResponse.json({
                success: false,
                error: "Failed to fetch company"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: company
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}

// PATCH /api/contact/companies/[id] - Update company (admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);
        const { id } = await params;

        const updateData: Partial<ContactGroupCompanyInput> = await request.json();

        // Validate required fields if they are being updated
        if (updateData.region !== undefined && !updateData.region.trim()) {
            return NextResponse.json({
                success: false,
                error: "Region cannot be empty"
            }, { status: 400 });
        }

        if (updateData.address !== undefined && !updateData.address.trim()) {
            return NextResponse.json({
                success: false,
                error: "Address cannot be empty"
            }, { status: 400 });
        }

        if (updateData.phone !== undefined && !updateData.phone.trim()) {
            return NextResponse.json({
                success: false,
                error: "Phone cannot be empty"
            }, { status: 400 });
        }

        if (updateData.email !== undefined && !updateData.email.trim()) {
            return NextResponse.json({
                success: false,
                error: "Email cannot be empty"
            }, { status: 400 });
        }

        // Validate URL format if provided
        if (updateData.company_url !== undefined && updateData.company_url && updateData.company_url.trim()) {
            const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
            if (!urlPattern.test(updateData.company_url.trim())) {
                return NextResponse.json({
                    success: false,
                    error: "Please enter a valid URL (must start with http:// or https://)"
                }, { status: 400 });
            }
        }

        // Add updated_at timestamp
        const updateObject = {
            ...updateData,
            updated_at: new Date().toISOString()
        };

        const { data: updatedCompany, error: updateError } = await supabase
            .from("contact_group_companies")
            .update(updateObject)
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            if (updateError.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: "Company not found"
                }, { status: 404 });
            }
            
            console.error("Database error:", updateError);
            return NextResponse.json({
                success: false,
                error: "Failed to update company"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: updatedCompany
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}

// DELETE /api/contact/companies/[id] - Delete company (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);
        const { id } = await params;

        const { error: deleteError } = await supabase
            .from("contact_group_companies")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error("Database error:", deleteError);
            return NextResponse.json({
                success: false,
                error: "Failed to delete company"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}
