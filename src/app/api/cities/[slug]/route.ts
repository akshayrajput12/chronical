import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { CityInput } from "@/types/cities";

interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

// GET /api/cities/[slug] - Fetch a single city by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServiceClient();
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const includeRelations = searchParams.get("include_relations") === "true";

        // Build query
        let query;

        if (includeRelations) {
            query = supabase.from("cities").select(`
                *,
                services:city_services(
                    id,
                    name,
                    description,
                    image_url,
                    href_link,
                    is_active,
                    sort_order
                ),
                content_sections:city_content_sections(
                    id,
                    section_type,
                    title,
                    subtitle,
                    content,
                    image_url,
                    additional_data,
                    is_active,
                    sort_order
                ),
                portfolio_items:city_portfolio_items(
                    id,
                    title,
                    description,
                    image_url,
                    alt_text,
                    category,
                    project_year,
                    client_name,
                    is_featured,
                    sort_order
                ),
                components:city_components(
                    id,
                    title,
                    description,
                    icon_name,
                    color,
                    is_active,
                    sort_order
                ),
                preferred_services:city_preferred_services(
                    id,
                    service_text,
                    is_active,
                    sort_order
                ),
                contact_details:city_contact_details(
                    id,
                    contact_type,
                    contact_value,
                    display_text,
                    is_primary,
                    is_active,
                    sort_order
                )
            `);
        } else {
            query = supabase.from("cities").select("*");
        }

        const { data: city, error } = await query
            .eq("slug", slug)
            .eq("is_active", true)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return NextResponse.json(
                    { error: "City not found" },
                    { status: 404 }
                );
            }
            console.error("Error fetching city:", error);
            return NextResponse.json(
                { error: "Failed to fetch city" },
                { status: 500 }
            );
        }

        // Sort related data by sort_order
        if (includeRelations && city) {
            if (city.services) {
                city.services.sort((a: any, b: any) => a.sort_order - b.sort_order);
            }
            if (city.content_sections) {
                city.content_sections.sort((a: any, b: any) => a.sort_order - b.sort_order);
            }
            if (city.portfolio_items) {
                city.portfolio_items.sort((a: any, b: any) => a.sort_order - b.sort_order);
            }
            if (city.components) {
                city.components.sort((a: any, b: any) => a.sort_order - b.sort_order);
            }
            if (city.preferred_services) {
                city.preferred_services.sort((a: any, b: any) => a.sort_order - b.sort_order);
            }
            if (city.contact_details) {
                city.contact_details.sort((a: any, b: any) => a.sort_order - b.sort_order);
            }
        }

        return NextResponse.json({ city });
    } catch (error) {
        console.error("Error in GET /api/cities/[slug]:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT /api/cities/[slug] - Update a city by slug
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServiceClient();
        const { slug } = await params;
        const body: Partial<CityInput> = await request.json();

        // First, get the current city to ensure it exists
        const { data: existingCity, error: fetchError } = await supabase
            .from("cities")
            .select("id, slug")
            .eq("slug", slug)
            .single();

        if (fetchError || !existingCity) {
            return NextResponse.json(
                { error: "City not found" },
                { status: 404 }
            );
        }

        // If slug is being updated, check for uniqueness
        if (body.slug && body.slug !== slug) {
            const { data: slugExists } = await supabase
                .from("cities")
                .select("id")
                .eq("slug", body.slug)
                .neq("id", existingCity.id)
                .single();

            if (slugExists) {
                return NextResponse.json(
                    { error: "A city with this slug already exists" },
                    { status: 400 }
                );
            }
        }

        // Update the city
        const { data: city, error: updateError } = await supabase
            .from("cities")
            .update(body)
            .eq("id", existingCity.id)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating city:", updateError);
            return NextResponse.json(
                { error: "Failed to update city" },
                { status: 500 }
            );
        }

        return NextResponse.json({ city });
    } catch (error) {
        console.error("Error in PUT /api/cities/[slug]:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/cities/[slug] - Delete a city by slug
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServiceClient();
        const { slug } = await params;

        // First, get the city to ensure it exists
        const { data: existingCity, error: fetchError } = await supabase
            .from("cities")
            .select("id")
            .eq("slug", slug)
            .single();

        if (fetchError || !existingCity) {
            return NextResponse.json(
                { error: "City not found" },
                { status: 404 }
            );
        }

        // Delete the city (cascade will handle related records)
        const { error: deleteError } = await supabase
            .from("cities")
            .delete()
            .eq("id", existingCity.id);

        if (deleteError) {
            console.error("Error deleting city:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete city" },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            message: "City deleted successfully",
            deleted_id: existingCity.id 
        });
    } catch (error) {
        console.error("Error in DELETE /api/cities/[slug]:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
