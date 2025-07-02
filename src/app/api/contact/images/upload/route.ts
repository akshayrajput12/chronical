import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CONTACT_STORAGE_CONFIGS, ContactStorageBucket } from '@/types/contact';

export async function POST(request: NextRequest) {
    try {
        // Use service role for admin operations to bypass RLS
        const supabase = await createClient(true);

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const bucket = formData.get('bucket') as ContactStorageBucket || 'contact-images';
        const folder = formData.get('folder') as string || '';

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate bucket
        if (!CONTACT_STORAGE_CONFIGS[bucket]) {
            return NextResponse.json(
                { success: false, error: 'Invalid storage bucket' },
                { status: 400 }
            );
        }

        const config = CONTACT_STORAGE_CONFIGS[bucket];

        // Validate file size
        if (file.size > config.maxFileSize) {
            return NextResponse.json(
                { success: false, error: `File size exceeds ${config.maxFileSize / (1024 * 1024)}MB limit` },
                { status: 400 }
            );
        }

        // Validate file type
        if (!config.allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: `File type ${file.type} not allowed` },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split('.').pop();
        const fileName = `${timestamp}_${randomString}.${fileExtension}`;
        
        // Create file path
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error('Storage upload error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to upload file' },
                { status: 500 }
            );
        }

        // Get public URL for public buckets
        let publicUrl = '';
        if (config.isPublic) {
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);
            publicUrl = urlData.publicUrl;
        }

        return NextResponse.json({
            success: true,
            data: {
                url: publicUrl,
                path: filePath,
                fullPath: data.fullPath,
                bucket: bucket,
                size: file.size,
                type: file.type,
                name: fileName
            }
        });

    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
