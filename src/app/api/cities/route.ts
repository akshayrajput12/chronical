import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { CityInput } from "@/types/cities";

// GET /api/cities - Fetch all cities with optional filtering
export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceClient();
        const { searchParams } = new URL(request.url);
        
        // Extract query parameters
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search");
        const isActive = searchParams.get("is_active");
        const countryCode = searchParams.get("country_code");
        const includeRelations = searchParams.get("include_relations") === "true";

        // Build base query
        let query;

        if (includeRelations) {
            query = supabase.from("cities").select(`
                *,
                services:city_services(*),
                content_sections:city_content_sections(*),
                portfolio_items:city_portfolio_items(*),
                components:city_components(*),
                preferred_services:city_preferred_services(*),
                contact_details:city_contact_details(*),
                statistics:city_statistics(*)
            `);
        } else {
            query = supabase.from("cities").select("*");
        }

        // Apply filters
        if (isActive !== null) {
            query = query.eq("is_active", isActive === "true");
        }

        if (search) {
            query = query.or(
                `name.ilike.%${search}%,description.ilike.%${search}%,country_code.ilike.%${search}%`
            );
        }

        if (countryCode) {
            query = query.eq("country_code", countryCode);
        }

        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        
        query = query.range(from, to).order("created_at", { ascending: false });

        const { data: cities, error, count } = await query;

        if (error) {
            console.error("Error fetching cities:", error);
            return NextResponse.json(
                { error: "Failed to fetch cities" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            cities: cities || [],
            total: count || 0,
            page,
            limit,
        });
    } catch (error) {
        console.error("Error in GET /api/cities:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/cities - Create a new city
export async function POST(request: NextRequest) {
    try {
        const supabase = createServiceClient();
        const body: CityInput = await request.json();

        // Validate required fields
        if (!body.name) {
            return NextResponse.json(
                { error: "City name is required" },
                { status: 400 }
            );
        }

        // Generate unique slug if not provided
        let slug = body.slug;
        if (!slug) {
            const { data: slugData, error: slugError } = await supabase.rpc(
                "generate_unique_city_slug",
                { title_text: body.name }
            );

            if (slugError) {
                console.error("Slug generation error:", slugError);
                return NextResponse.json(
                    { error: "Failed to generate slug" },
                    { status: 500 }
                );
            }

            slug = slugData;
        }

        // Check if slug already exists
        const { data: existingCity } = await supabase
            .from("cities")
            .select("id")
            .eq("slug", slug)
            .single();

        if (existingCity) {
            return NextResponse.json(
                { error: "A city with this slug already exists" },
                { status: 400 }
            );
        }

        // Prepare city data
        const cityData = {
            ...body,
            slug,
            is_active: body.is_active ?? true,
        };

        // Insert city
        const { data: city, error: insertError } = await supabase
            .from("cities")
            .insert([cityData])
            .select()
            .single();

        if (insertError) {
            console.error("Error creating city:", insertError);
            return NextResponse.json(
                { error: "Failed to create city" },
                { status: 500 }
            );
        }

        return NextResponse.json({ city }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/cities:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT /api/cities - Bulk update cities
export async function PUT(request: NextRequest) {
    try {
        const supabase = createServiceClient();
        const body = await request.json();
        const { action, cityIds, data } = body;

        if (!action || !cityIds || !Array.isArray(cityIds)) {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        let result;

        switch (action) {
            case "activate":
                result = await supabase
                    .from("cities")
                    .update({ is_active: true })
                    .in("id", cityIds);
                break;

            case "deactivate":
                result = await supabase
                    .from("cities")
                    .update({ is_active: false })
                    .in("id", cityIds);
                break;

            case "delete":
                result = await supabase
                    .from("cities")
                    .delete()
                    .in("id", cityIds);
                break;

            case "update":
                if (!data) {
                    return NextResponse.json(
                        { error: "Update data is required" },
                        { status: 400 }
                    );
                }
                result = await supabase
                    .from("cities")
                    .update(data)
                    .in("id", cityIds);
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }

        if (result.error) {
            console.error(`Error performing ${action} on cities:`, result.error);
            return NextResponse.json(
                { error: `Failed to ${action} cities` },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            message: `Successfully ${action}d ${cityIds.length} cities`,
            affected: cityIds.length 
        });
    } catch (error) {
        console.error("Error in PUT /api/cities:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/cities - Bulk delete cities
export async function DELETE(request: NextRequest) {
    try {
        const supabase = createServiceClient();
        const { searchParams } = new URL(request.url);
        const cityIds = searchParams.get("ids")?.split(",");

        if (!cityIds || cityIds.length === 0) {
            return NextResponse.json(
                { error: "City IDs are required" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("cities")
            .delete()
            .in("id", cityIds);

        if (error) {
            console.error("Error deleting cities:", error);
            return NextResponse.json(
                { error: "Failed to delete cities" },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            message: `Successfully deleted ${cityIds.length} cities`,
            deleted: cityIds.length 
        });
    } catch (error) {
        console.error("Error in DELETE /api/cities:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
