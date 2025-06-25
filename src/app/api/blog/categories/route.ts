import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/blog/categories - Fetch all blog categories
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get("active_only") === "true";

        let query = supabase
            .from("blog_categories")
            .select("*")
            .order("sort_order");

        if (activeOnly) {
            query = query.eq("is_active", true);
        }

        const { data: categories, error } = await query;

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to fetch categories" },
                { status: 500 }
            );
        }

        return NextResponse.json({ categories: categories || [] });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/blog/categories - Create a new category
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        // Validate required fields
        if (!body.name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        let slug = body.slug;
        if (!slug) {
            slug = body.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
        }

        // Check if slug already exists
        const { data: existingCategory } = await supabase
            .from("blog_categories")
            .select("id")
            .eq("slug", slug)
            .single();

        if (existingCategory) {
            return NextResponse.json(
                { error: "A category with this slug already exists" },
                { status: 400 }
            );
        }

        // Prepare category data
        const categoryData = {
            name: body.name,
            slug,
            description: body.description || null,
            color: body.color || "#a5cd39",
            sort_order: body.sort_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
        };

        // Insert category
        const { data: category, error } = await supabase
            .from("blog_categories")
            .insert([categoryData])
            .select()
            .single();

        if (error) {
            console.error("Category creation error:", error);
            return NextResponse.json(
                { error: "Failed to create category" },
                { status: 500 }
            );
        }

        return NextResponse.json(category, { status: 201 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
