import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContactFormSettings, ContactFormSettingsInput } from '@/types/contact';

// GET /api/contact/form-settings - Get form settings (admin only)
export async function GET() {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);
        
        const { data, error } = await supabase
            .from('contact_form_settings')
            .select('*')
            .eq('is_active', true)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching form settings:', error);
            return NextResponse.json({ 
                success: false, 
                error: 'Failed to fetch form settings' 
            }, { status: 500 });
        }

        // Return null if no settings found (PGRST116 is "not found")
        return NextResponse.json({
            success: true,
            data: data || null
        });

    } catch (error) {
        console.error('Error in form settings GET:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}

// POST /api/contact/form-settings - Create new form settings (admin only)
export async function POST(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        const settingsData: ContactFormSettingsInput = await request.json();

        // Validate required fields
        if (!settingsData.form_title?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Form title is required"
            }, { status: 400 });
        }

        if (!settingsData.success_message?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Success message is required"
            }, { status: 400 });
        }

        if (!settingsData.success_description?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Success description is required"
            }, { status: 400 });
        }

        if (!settingsData.sidebar_phone?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Sidebar phone is required"
            }, { status: 400 });
        }

        if (!settingsData.sidebar_email?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Sidebar email is required"
            }, { status: 400 });
        }

        if (!settingsData.sidebar_address?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Sidebar address is required"
            }, { status: 400 });
        }

        if (settingsData.max_file_size_mb && settingsData.max_file_size_mb <= 0) {
            return NextResponse.json({
                success: false,
                error: "Maximum file size must be greater than 0"
            }, { status: 400 });
        }

        if (settingsData.require_terms_agreement && !settingsData.terms_text?.trim()) {
            return NextResponse.json({
                success: false,
                error: "Terms text is required when terms agreement is enabled"
            }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('contact_form_settings')
            .insert(settingsData)
            .select()
            .single();

        if (error) {
            console.error('Error creating form settings:', error);
            return NextResponse.json({
                success: false,
                error: error.message || 'Failed to create form settings'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error in form settings POST:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}
