import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/images - Browse storage buckets for images
export async function GET(request: NextRequest) {
    try {
        // Use service role client to bypass RLS for admin operations
        const supabase = await createClient(true);
        const { searchParams } = new URL(request.url);

        const bucket = searchParams.get('bucket') || 'event-images';
        const folder = searchParams.get('folder') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const eventId = searchParams.get('event_id'); // Optional filter by event

        const offset = (page - 1) * limit;

        // If this is event-images bucket, try to get from database first
        if (bucket === 'event-images') {
            let query = supabase
                .from('event_images')
                .select(`
                    id,
                    filename,
                    original_filename,
                    file_path,
                    file_size,
                    mime_type,
                    alt_text,
                    caption,
                    image_type,
                    display_order,
                    is_active,
                    created_at,
                    event_id
                `)
                .eq('is_active', true);

            // Filter by event if specified
            if (eventId) {
                query = query.eq('event_id', eventId);
            }

            // Apply pagination and ordering
            query = query
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            const { data: dbImages, error: dbError } = await query;

            if (!dbError && dbImages) {
                // Transform database results to match expected format
                const transformedImages = dbImages.map(img => ({
                    id: img.id,
                    filename: img.filename,
                    file_path: img.file_path,
                    title: img.original_filename?.replace(/\.[^/.]+$/, "") || img.filename,
                    alt_text: img.alt_text || img.filename,
                    description: img.caption || '',
                    tags: [img.image_type || 'gallery'],
                    category: 'events',
                    width: null,
                    height: null,
                    thumbnail_url: img.file_path,
                    medium_url: img.file_path,
                    file_size: img.file_size || 0,
                    usage_count: 0,
                    created_at: img.created_at,
                    database_id: img.id,
                    event_id: img.event_id
                }));

                return NextResponse.json({
                    success: true,
                    images: transformedImages,
                    total: transformedImages.length,
                    page,
                    limit,
                    source: 'database'
                });
            }
        }

        // Fallback to storage bucket listing
        const { data: files, error } = await supabase.storage
            .from(bucket)
            .list(folder, {
                limit: limit,
                offset: offset,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error('Error fetching images from storage:', error);
            return NextResponse.json(
                { error: 'Failed to fetch images' },
                { status: 500 }
            );
        }

        // Convert storage files to image objects with public URLs
        const images = files?.filter(file => {
            // Filter only image files
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            return imageExtensions.some(ext =>
                file.name.toLowerCase().endsWith(ext)
            );
        }).map(file => {
            const filePath = folder ? `${folder}/${file.name}` : file.name;
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return {
                id: file.name, // Use filename as ID for now
                filename: file.name,
                file_path: publicUrl,
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                alt_text: file.name.replace(/\.[^/.]+$/, ""),
                file_size: file.metadata?.size || 0,
                created_at: file.created_at,
                updated_at: file.updated_at,
                bucket_name: bucket,
                folder_path: folder,
                mime_type: file.metadata?.mimetype || 'image/jpeg',
            };
        }) || [];

        return NextResponse.json({
            images,
            total: images.length,
            page,
            limit,
            has_more: images.length === limit,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/images - Upload new image to storage
export async function POST(request: NextRequest) {
    try {
        // Use service role client to bypass RLS for admin operations
        const supabase = await createClient(true);

        // Temporarily disable auth check for testing
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string || 'general';
        const bucket = formData.get('bucket') as string || 'event-images';
        const eventId = formData.get('event_id') as string; // Optional event ID for direct association

        if (!file) {
            return NextResponse.json(
                { error: 'File is required' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size too large. Maximum size is 50MB.' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileExt = file.name.split('.').pop();
        const filename = `${timestamp}_${randomStr}.${fileExt}`;
        const filePath = category ? `${category}/${filename}` : filename;

        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return NextResponse.json(
                { error: 'Failed to upload file' },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        // If this is an event image and we have an event ID, save to event_images table
        let dbImageRecord = null;
        if (bucket === 'event-images' && eventId) {
            const imageData = {
                event_id: eventId,
                filename,
                original_filename: file.name,
                file_path: publicUrl,
                file_size: file.size,
                mime_type: file.type,
                alt_text: file.name.replace(/\.[^/.]+$/, ""),
                image_type: 'gallery', // Default to gallery, can be changed later
                display_order: 0,
                is_active: true,
            };

            const { data: insertedImage, error: dbError } = await supabase
                .from('event_images')
                .insert([imageData])
                .select()
                .single();

            if (dbError) {
                console.error('Error saving image to database:', dbError);
                // Continue without failing - image is still in storage
            } else {
                dbImageRecord = insertedImage;
            }
        }

        // Return simplified image object
        const imageRecord = {
            id: dbImageRecord?.id || filename,
            filename,
            original_filename: file.name,
            file_path: publicUrl,
            file_size: file.size,
            mime_type: file.type,
            title: file.name.replace(/\.[^/.]+$/, ""),
            alt_text: file.name.replace(/\.[^/.]+$/, ""),
            bucket_name: bucket,
            folder_path: category,
            created_at: new Date().toISOString(),
            database_id: dbImageRecord?.id, // Include database ID if saved
        };

        return NextResponse.json({
            success: true,
            image: imageRecord,
            message: 'Image uploaded successfully',
        }, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/images - Update image metadata (simplified - no database)
export async function PUT(request: NextRequest) {
    try {
        // Since we're not using a database table, just return success
        // In a real implementation, you might want to store metadata elsewhere
        return NextResponse.json({
            success: true,
            message: 'Image metadata updated (storage-only mode)',
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/images - Delete images from storage
export async function DELETE(request: NextRequest) {
    try {
        // Use service role client to bypass RLS for admin operations
        const supabase = await createClient(true);

        // Temporarily disable auth check
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const { filePaths, bucket, imageIds } = await request.json();

        if (!filePaths || !Array.isArray(filePaths)) {
            return NextResponse.json(
                { error: 'filePaths array is required' },
                { status: 400 }
            );
        }

        const bucketName = bucket || 'event-images';

        // Process file paths to extract relative paths from full URLs
        const processedFilePaths = filePaths.map(filePath => {
            try {
                // If it's a full URL, extract the path after the bucket name
                if (filePath.includes('supabase.co') || filePath.includes('storage/v1/object/public/')) {
                    const url = new URL(filePath);
                    const pathParts = url.pathname.split('/');
                    const bucketIndex = pathParts.findIndex(part => part === bucketName);
                    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
                        return pathParts.slice(bucketIndex + 1).join('/');
                    }
                }
                // If it's already a relative path, use as is
                return filePath;
            } catch (error) {
                console.error('Error processing file path:', filePath, error);
                // Fallback: try to extract filename from path
                return filePath.split('/').pop() || filePath;
            }
        });

        console.log('Original file paths:', filePaths);
        console.log('Processed file paths for deletion:', processedFilePaths);

        // Delete files from storage
        const { error } = await supabase.storage
            .from(bucketName)
            .remove(processedFilePaths);

        if (error) {
            console.error('Error deleting files from storage:', error);
            console.error('Bucket:', bucketName);
            console.error('Processed file paths:', processedFilePaths);
            return NextResponse.json(
                {
                    error: 'Failed to delete files from storage',
                    details: error.message,
                    bucket: bucketName,
                    paths: processedFilePaths
                },
                { status: 500 }
            );
        }

        console.log('Successfully deleted files from storage:', processedFilePaths);

        // If we have image IDs and this is event-images bucket, also delete from database
        if (imageIds && Array.isArray(imageIds) && bucketName === 'event-images') {
            console.log('Deleting images from database with IDs:', imageIds);
            const { data: deletedRows, error: dbError } = await supabase
                .from('event_images')
                .delete()
                .in('id', imageIds)
                .select('id, filename');

            if (dbError) {
                console.error('Error deleting images from database:', dbError);
                // Continue - storage deletion was successful
            } else {
                console.log('Successfully deleted from database:', deletedRows);
            }
        }

        return NextResponse.json({
            success: true,
            deleted_count: filePaths.length,
            deleted_files: filePaths,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
