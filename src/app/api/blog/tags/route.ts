import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/blog/tags - Fetch all blog tags
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: tags, error } = await supabase
            .from("blog_tags")
            .select("*")
            .order("name");

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to fetch tags" },
                { status: 500 }
            );
        }

        return NextResponse.json({ tags: tags || [] });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/blog/tags - Create a new tag
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
        const { data: existingTag } = await supabase
            .from("blog_tags")
            .select("id")
            .eq("slug", slug)
            .single();

        if (existingTag) {
            return NextResponse.json(
                { error: "A tag with this slug already exists" },
                { status: 400 }
            );
        }

        // Prepare tag data
        const tagData = {
            name: body.name,
            slug,
            color: body.color || "#6b7280",
        };

        // Insert tag
        const { data: tag, error } = await supabase
            .from("blog_tags")
            .insert([tagData])
            .select()
            .single();

        if (error) {
            console.error("Tag creation error:", error);
            return NextResponse.json(
                { error: "Failed to create tag" },
                { status: 500 }
            );
        }

        return NextResponse.json(tag, { status: 201 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
