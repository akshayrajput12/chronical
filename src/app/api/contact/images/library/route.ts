import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ContactStorageBucket, CONTACT_STORAGE_CONFIGS } from '@/types/contact';

export async function GET(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        const { searchParams } = new URL(request.url);
        const bucket = searchParams.get('bucket') as ContactStorageBucket || 'contact-images';
        const folder = searchParams.get('folder') || '';
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Validate bucket
        if (!CONTACT_STORAGE_CONFIGS[bucket]) {
            return NextResponse.json(
                { success: false, error: 'Invalid storage bucket' },
                { status: 400 }
            );
        }

        // List files from storage
        const { data: files, error } = await supabase.storage
            .from(bucket)
            .list(folder, {
                limit,
                offset,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error('Storage list error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch images' },
                { status: 500 }
            );
        }

        const config = CONTACT_STORAGE_CONFIGS[bucket];
        
        // Process files and get URLs
        const processedFiles = files
            .filter(file => file.name !== '.emptyFolderPlaceholder')
            .map(file => {
                const filePath = folder ? `${folder}/${file.name}` : file.name;
                let url = '';
                
                if (config.isPublic) {
                    const { data: urlData } = supabase.storage
                        .from(bucket)
                        .getPublicUrl(filePath);
                    url = urlData.publicUrl;
                }

                return {
                    id: file.id || file.name,
                    name: file.name,
                    url,
                    size: file.metadata?.size || 0,
                    type: file.metadata?.mimetype || '',
                    created_at: file.created_at || file.updated_at || new Date().toISOString(),
                    bucket,
                    path: filePath
                };
            });

        return NextResponse.json({
            success: true,
            data: processedFiles,
            total: processedFiles.length,
            bucket,
            folder
        });

    } catch (error) {
        console.error('Image library error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
