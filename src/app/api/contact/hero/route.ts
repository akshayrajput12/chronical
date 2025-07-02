import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactHeroSectionInput } from "@/types/contact";

// GET /api/contact/hero - Get active hero section (admin only)
export async function GET(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        const { data: hero, error: fetchError } = await supabase
            .from("contact_hero_section")
            .select("*")
            .eq("is_active", true)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                // No hero section found
                return NextResponse.json({
                    success: true,
                    data: null
                });
            }
            
            console.error("Database error:", fetchError);
            return NextResponse.json({
                success: false,
                error: "Failed to fetch hero section"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: hero
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}

// POST /api/contact/hero - Create new hero section (admin only)
export async function POST(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        const heroData: ContactHeroSectionInput = await request.json();

        // Validate required fields
        if (!heroData.title?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Title is required"
            }, { status: 400 });
        }

        if (!heroData.subtitle?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Subtitle is required"
            }, { status: 400 });
        }

        if (!heroData.background_image_url?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Background image is required"
            }, { status: 400 });
        }

        // Deactivate existing hero sections if this one is active
        if (heroData.is_active) {
            await supabase
                .from("contact_hero_section")
                .update({ is_active: false })
                .eq("is_active", true);
        }

        // Add timestamps
        const heroWithTimestamps = {
            ...heroData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data: hero, error: insertError } = await supabase
            .from("contact_hero_section")
            .insert(heroWithTimestamps)
            .select()
            .single();

        if (insertError) {
            console.error("Database error:", insertError);
            return NextResponse.json({
                success: false,
                error: "Failed to create hero section"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: hero
        }, { status: 201 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}

// PUT /api/contact/hero - Update hero section (admin only)
export async function PUT(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        const requestData = await request.json();
        const { id, ...heroData }: ContactHeroSectionInput & { id: string } = requestData;

        if (!id) {
            return NextResponse.json({
                success: false,
                error: "Hero section ID is required"
            }, { status: 400 });
        }

        // Validate required fields
        if (!heroData.title?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Title is required"
            }, { status: 400 });
        }

        if (!heroData.subtitle?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Subtitle is required"
            }, { status: 400 });
        }

        if (!heroData.background_image_url?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Background image is required"
            }, { status: 400 });
        }

        // Deactivate other hero sections if this one is being activated
        if (heroData.is_active) {
            await supabase
                .from("contact_hero_section")
                .update({ is_active: false })
                .neq("id", id)
                .eq("is_active", true);
        }

        // Update the hero section
        const { data: hero, error: updateError } = await supabase
            .from("contact_hero_section")
            .update({ 
                ...heroData, 
                updated_at: new Date().toISOString() 
            })
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            if (updateError.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: "Hero section not found"
                }, { status: 404 });
            }
            
            console.error("Database error:", updateError);
            return NextResponse.json({
                success: false,
                error: "Failed to update hero section"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: hero
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}
