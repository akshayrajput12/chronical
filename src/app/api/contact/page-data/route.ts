import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactPageResponse } from "@/types/contact";

// GET /api/contact/page-data - Fetch all contact page data
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Fetch hero section data
        const { data: heroData, error: heroError } = await supabase
            .from("contact_hero_section")
            .select("*")
            .eq("is_active", true)
            .single();

        if (heroError && heroError.code !== 'PGRST116') {
            console.error("Hero section error:", heroError);
            throw heroError;
        }

        // Fetch form settings data
        const { data: formSettingsData, error: formSettingsError } = await supabase
            .from("contact_form_settings")
            .select("*")
            .eq("is_active", true)
            .single();

        if (formSettingsError && formSettingsError.code !== 'PGRST116') {
            console.error("Form settings error:", formSettingsError);
            throw formSettingsError;
        }

        // Fetch group companies data
        const { data: groupCompaniesData, error: groupCompaniesError } = await supabase
            .from("contact_group_companies")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (groupCompaniesError) {
            console.error("Group companies error:", groupCompaniesError);
            throw groupCompaniesError;
        }

        // Fetch map settings data
        const { data: mapSettingsData, error: mapSettingsError } = await supabase
            .from("contact_map_settings")
            .select("*")
            .eq("is_active", true)
            .single();

        if (mapSettingsError && mapSettingsError.code !== 'PGRST116') {
            console.error("Map settings error:", mapSettingsError);
            throw mapSettingsError;
        }

        // Combine all data
        const pageData = {
            hero: heroData || {
                id: "default",
                title: "Contact Us",
                subtitle: "Our team is standing by to answer your questions and direct you to the expertise you need for your next event",
                background_image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            formSettings: formSettingsData || {
                id: "default",
                form_title: "Feel Free To Write",
                form_subtitle: "",
                success_message: "Thank You for Your Message!",
                success_description: "We've received your inquiry and will get back to you within 24 hours.",
                sidebar_phone: "+971 54 347 4645",
                sidebar_email: "info@chronicleexhibts.ae",
                sidebar_address: "Al Qouz Industrial Area 1st. No. 5B, Warehouse 14 P.O. Box 128046, Dubai – UAE",
                enable_file_upload: true,
                max_file_size_mb: 10,
                allowed_file_types: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
                require_terms_agreement: true,
                terms_text: "By clicking submit, you agree to our Terms and Conditions",
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            groupCompanies: groupCompaniesData || [
                {
                    id: "default-1",
                    name: "Triumfo Europe",
                    description: "European operations and services",
                    address: "Zum see 7, 14542 Werder (Havel), Germany",
                    phone: "+49 (0) 33 2774 99-100",
                    email: "enquiry@triumfo.de",
                    display_order: 1,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: "default-2",
                    name: "Triumfo United States",
                    description: "North American operations and services",
                    address: "2782 Abels Ln, Las Vegas, NV 89115, USA",
                    phone: "+1 702 992 0440",
                    email: "enquiry@triumfo.us",
                    display_order: 2,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: "default-3",
                    name: "Triumfo India",
                    description: "Indian operations and services",
                    address: "A-65 Sector-83, Phase II, Noida – 201305, India",
                    phone: "+91-0120-4690699",
                    email: "enquiry@triumfo.in",
                    display_order: 3,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ],
            mapSettings: mapSettingsData || {
                id: "default",
                map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5139890547107!2d55.38061577600814!3d25.28692967765328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f42e5a9ddaf97%3A0x563a582dbda7f14c!2sChronicle%20Exhibition%20Organizing%20L.L.C%20%7C%20Exhibition%20Stand%20Builder%20in%20Dubai%2C%20UAE%20-%20Middle%20East!5e0!3m2!1sen!2sin!4v1750325309116!5m2!1sen!2sin",
                map_title: "Dubai World Trade Centre Location",
                map_height: 400,
                parking_title: "On-site parking at Dubai World Trade Centre",
                parking_description: "PLAN YOUR ARRIVAL BY EXPLORING OUR USEFUL PARKING AND ACCESSIBILITY MAPS.",
                parking_background_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                parking_maps_download_url: "#",
                google_maps_url: "https://maps.google.com",
                show_parking_section: true,
                show_map_section: true,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        };

        const response: ContactPageResponse = {
            success: true,
            data: pageData
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("Contact page data fetch error:", error);
        
        const response: ContactPageResponse = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch contact page data"
        };

        return NextResponse.json(response, { status: 500 });
    }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
