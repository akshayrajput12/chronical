import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContactMapSettings, ContactMapSettingsInput } from '@/types/contact';

export async function GET() {
    try {
        const supabase = await createClient(true); // Use service role to bypass RLS
        
        const { data, error } = await supabase
            .from('contact_map_settings')
            .select('*')
            .eq('is_active', true)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching map settings:', error);
            return NextResponse.json({ error: 'Failed to fetch map settings' }, { status: 500 });
        }

        // Return default settings if none found
        if (!data) {
            const defaultSettings: ContactMapSettings = {
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
            };
            return NextResponse.json(defaultSettings);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in map settings GET:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient(true); // Use service role to bypass RLS
        const body = await request.json();

        // Validate required fields
        if (!body.map_embed_url) {
            return NextResponse.json({ error: 'Map embed URL is required' }, { status: 400 });
        }

        // Prepare data with defaults for backward compatibility
        const mapData: Partial<ContactMapSettings> = {
            map_embed_url: body.map_embed_url,
            map_title: body.map_title || '',
            map_height: body.map_height || 400,
            parking_title: body.parking_title || '',
            parking_description: body.parking_description || '',
            parking_background_image: body.parking_background_image || '',
            parking_maps_download_url: body.parking_maps_download_url || '',
            google_maps_url: body.google_maps_url || '',
            show_parking_section: body.show_parking_section || false,
            show_map_section: body.show_map_section !== false, // Default to true
            is_active: body.is_active !== false, // Default to true
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('contact_map_settings')
            .insert(mapData)
            .select()
            .single();

        if (error) {
            console.error('Error creating map settings:', error);
            return NextResponse.json({ error: 'Failed to create map settings' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in map settings POST:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient(true); // Use service role to bypass RLS
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'Map settings ID is required' }, { status: 400 });
        }

        // Validate required fields
        if (!body.map_embed_url) {
            return NextResponse.json({ error: 'Map embed URL is required' }, { status: 400 });
        }

        // Prepare update data
        const updateData: Partial<ContactMapSettings> = {
            map_embed_url: body.map_embed_url,
            map_title: body.map_title || '',
            map_height: body.map_height || 400,
            parking_title: body.parking_title || '',
            parking_description: body.parking_description || '',
            parking_background_image: body.parking_background_image || '',
            parking_maps_download_url: body.parking_maps_download_url || '',
            google_maps_url: body.google_maps_url || '',
            show_parking_section: body.show_parking_section || false,
            show_map_section: body.show_map_section !== false, // Default to true
            is_active: body.is_active !== false, // Default to true
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('contact_map_settings')
            .update(updateData)
            .eq('id', body.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating map settings:', error);
            return NextResponse.json({ error: 'Failed to update map settings' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in map settings PUT:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
