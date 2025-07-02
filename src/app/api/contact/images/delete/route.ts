import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContactStorageBucket } from '@/types/contact';

export async function DELETE(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        const { searchParams } = new URL(request.url);
        const bucket = searchParams.get('bucket') as ContactStorageBucket;
        const filePath = searchParams.get('path');

        if (!bucket || !filePath) {
            return NextResponse.json(
                { success: false, error: 'Bucket and file path are required' },
                { status: 400 }
            );
        }

        // Delete file from storage
        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Storage delete error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to delete file' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'File deleted successfully'
        });

    } catch (error) {
        console.error('Image delete error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
