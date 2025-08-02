import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PrivacyPolicy, UpdatePrivacyPolicyRequest } from '@/types/privacy-policy';

// GET - Fetch active privacy policy
export async function GET() {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('privacy_policy')
            .select('*')
            .eq('is_active', true)
            .order('version', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching privacy policy:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch privacy policy' },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { success: false, error: 'Privacy policy not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: data as PrivacyPolicy,
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Update privacy policy
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body: UpdatePrivacyPolicyRequest = await request.json();

        // Validate required fields
        if (!body.title?.trim() || !body.content?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Title and content are required' },
                { status: 400 }
            );
        }

        // Get current active privacy policy
        const { data: currentPolicy } = await supabase
            .from('privacy_policy')
            .select('*')
            .eq('is_active', true)
            .single();

        if (currentPolicy) {
            // Deactivate current policy
            await supabase
                .from('privacy_policy')
                .update({ is_active: false })
                .eq('id', currentPolicy.id);
        }

        // Create new version
        const newVersion = currentPolicy ? currentPolicy.version + 1 : 1;

        const { data: newPolicy, error: insertError } = await supabase
            .from('privacy_policy')
            .insert({
                title: body.title.trim(),
                content: body.content,
                meta_title: body.meta_title?.trim() || null,
                meta_description: body.meta_description?.trim() || null,
                meta_keywords: body.meta_keywords?.trim() || null,
                og_title: body.og_title?.trim() || null,
                og_description: body.og_description?.trim() || null,
                og_image_url: body.og_image_url?.trim() || null,
                contact_email: body.contact_email?.trim() || 'info@chroniclesexhibits.com',
                is_active: body.is_active !== false,
                version: newVersion,
                last_updated_by: user.id,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating privacy policy:', insertError);
            return NextResponse.json(
                { success: false, error: 'Failed to update privacy policy' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: newPolicy as PrivacyPolicy,
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Create new privacy policy (admin only)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body: UpdatePrivacyPolicyRequest = await request.json();

        // Validate required fields
        if (!body.title?.trim() || !body.content?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const { data: newPolicy, error: insertError } = await supabase
            .from('privacy_policy')
            .insert({
                title: body.title.trim(),
                content: body.content,
                meta_title: body.meta_title?.trim() || null,
                meta_description: body.meta_description?.trim() || null,
                meta_keywords: body.meta_keywords?.trim() || null,
                og_title: body.og_title?.trim() || null,
                og_description: body.og_description?.trim() || null,
                og_image_url: body.og_image_url?.trim() || null,
                contact_email: body.contact_email?.trim() || 'info@chroniclesexhibits.com',
                is_active: body.is_active !== false,
                version: 1,
                last_updated_by: user.id,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating privacy policy:', insertError);
            return NextResponse.json(
                { success: false, error: 'Failed to create privacy policy' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: newPolicy as PrivacyPolicy,
        }, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
