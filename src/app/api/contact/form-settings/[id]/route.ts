import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContactFormSettings, ContactFormSettingsInput } from '@/types/contact';

// PATCH /api/contact/form-settings/[id] - Update form settings (admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);
        const { id } = await params;

        const updateData: Partial<ContactFormSettingsInput> = await request.json();

        // Validate required fields if they are being updated
        if (updateData.form_title !== undefined && !updateData.form_title.trim()) {
            return NextResponse.json({
                success: false,
                error: "Form title cannot be empty"
            }, { status: 400 });
        }

        if (updateData.success_message !== undefined && !updateData.success_message.trim()) {
            return NextResponse.json({
                success: false,
                error: "Success message cannot be empty"
            }, { status: 400 });
        }

        if (updateData.success_description !== undefined && !updateData.success_description.trim()) {
            return NextResponse.json({
                success: false,
                error: "Success description cannot be empty"
            }, { status: 400 });
        }

        if (updateData.sidebar_phone !== undefined && !updateData.sidebar_phone.trim()) {
            return NextResponse.json({
                success: false,
                error: "Sidebar phone cannot be empty"
            }, { status: 400 });
        }

        if (updateData.sidebar_email !== undefined && !updateData.sidebar_email.trim()) {
            return NextResponse.json({
                success: false,
                error: "Sidebar email cannot be empty"
            }, { status: 400 });
        }

        if (updateData.sidebar_address !== undefined && !updateData.sidebar_address.trim()) {
            return NextResponse.json({
                success: false,
                error: "Sidebar address cannot be empty"
            }, { status: 400 });
        }

        if (updateData.max_file_size_mb !== undefined && updateData.max_file_size_mb <= 0) {
            return NextResponse.json({
                success: false,
                error: "Maximum file size must be greater than 0"
            }, { status: 400 });
        }

        if (updateData.require_terms_agreement && updateData.terms_text !== undefined && !updateData.terms_text.trim()) {
            return NextResponse.json({
                success: false,
                error: "Terms text cannot be empty when terms agreement is enabled"
            }, { status: 400 });
        }

        // Add updated_at timestamp
        const updateObject = {
            ...updateData,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('contact_form_settings')
            .update(updateObject)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: "Form settings not found"
                }, { status: 404 });
            }
            
            console.error('Error updating form settings:', error);
            return NextResponse.json({
                success: false,
                error: error.message || 'Failed to update form settings'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error in form settings PATCH:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}

// DELETE /api/contact/form-settings/[id] - Delete form settings (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);
        const { id } = await params;

        const { error } = await supabase
            .from('contact_form_settings')
            .delete()
            .eq('id', id);

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: "Form settings not found"
                }, { status: 404 });
            }
            
            console.error('Error deleting form settings:', error);
            return NextResponse.json({
                success: false,
                error: error.message || 'Failed to delete form settings'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Form settings deleted successfully'
        });

    } catch (error) {
        console.error('Error in form settings DELETE:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}
