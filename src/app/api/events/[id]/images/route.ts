import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// GET /api/events/[id]/images - Get all images for an event
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient(true);
        const { id } = await params;
        const { searchParams } = new URL(request.url);

        const imageType = searchParams.get('type'); // 'featured', 'hero', 'logo', 'gallery'
        const includeInactive = searchParams.get('include_inactive') === 'true';

        // Determine if ID is UUID or slug and get the actual event ID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        let eventId = id;

        if (!isUUID) {
            // If it's a slug, get the event ID first
            const { data: event, error: eventError } = await supabase
                .from('events')
                .select('id')
                .eq('slug', id)
                .eq('is_active', true)
                .not('published_at', 'is', null)
                .single();

            if (eventError || !event) {
                return NextResponse.json({
                    event_id: id,
                    images: {
                        featured: [],
                        hero: [],
                        logo: [],
                        gallery: [],
                    },
                    total: 0,
                });
            }
            eventId = event.id;
        }

        // Build query - using simplified event_images table
        let query = supabase
            .from('event_images')
            .select(`
                id,
                image_type,
                display_order,
                caption,
                is_active,
                created_at,
                filename,
                file_path,
                alt_text,
                width,
                height,
                file_size,
                mime_type
            `)
            .eq('event_id', eventId);

        // Apply filters
        if (imageType) {
            query = query.eq('image_type', imageType);
        }

        if (!includeInactive) {
            query = query.eq('is_active', true);
        }

        // Order by type priority and display order
        query = query.order('image_type').order('display_order');

        const { data: eventImages, error } = await query;

        if (error) {
            console.error('Error fetching event images:', error);
            // Return empty result instead of error to prevent 500s
            return NextResponse.json({
                event_id: eventId,
                images: {
                    featured: [],
                    hero: [],
                    logo: [],
                    gallery: [],
                },
                total: 0,
            });
        }

        // Group images by type
        const imagesByType: {
            featured: any[];
            hero: any[];
            logo: any[];
            gallery: any[];
        } = {
            featured: [],
            hero: [],
            logo: [],
            gallery: [],
        };

        eventImages?.forEach((image: any) => {
            const imageData = {
                id: image.id,
                image_type: image.image_type,
                display_order: image.display_order,
                caption: image.caption,
                is_active: image.is_active,
                created_at: image.created_at,
                filename: image.filename,
                file_path: image.file_path,
                alt_text: image.alt_text,
                width: image.width,
                height: image.height,
                file_size: image.file_size,
                mime_type: image.mime_type,
            };

            if (imagesByType[image.image_type as keyof typeof imagesByType]) {
                imagesByType[image.image_type as keyof typeof imagesByType].push(imageData);
            }
        });

        return NextResponse.json({
            event_id: eventId,
            images: imagesByType,
            total: eventImages?.length || 0,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/events/[id]/images - Add image to event
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient(true);

        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const { id: eventId } = await params;
        const requestData = await request.json();
        console.log('POST /api/events/[id]/images - Request data:', requestData);

        const {
            filename,
            original_filename,
            file_path,
            image_type = 'gallery',
            display_order = 0,
            caption = null,
            alt_text = 'Event image',
            width = null,
            height = null,
            file_size = 0,
            mime_type = 'image/jpeg'
        } = requestData;

        if (!filename || !file_path) {
            return NextResponse.json(
                { error: 'filename and file_path are required' },
                { status: 400 }
            );
        }

        // Verify event exists
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('id')
            .eq('id', eventId)
            .single();

        if (eventError || !event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        // For non-gallery types, remove existing image of same type
        if (image_type !== 'gallery') {
            await supabase
                .from('event_images')
                .delete()
                .eq('event_id', eventId)
                .eq('image_type', image_type);
        }

        // Add new image
        const insertData = {
            event_id: eventId,
            filename,
            original_filename: original_filename || filename,
            file_path,
            image_type,
            display_order,
            caption,
            alt_text,
            width,
            height,
            file_size,
            mime_type,
            uploaded_by: null, // Since auth is disabled
        };

        console.log('Inserting image data:', insertData);

        const { data: image, error: imageError } = await supabase
            .from('event_images')
            .insert([insertData])
            .select()
            .single();

        if (imageError) {
            console.error('Error creating image:', imageError);
            console.error('Failed insert data:', insertData);
            return NextResponse.json(
                {
                    error: 'Failed to add image to event',
                    details: imageError.message,
                    code: imageError.code
                },
                { status: 500 }
            );
        }

        // Revalidate relevant paths after adding image to event
        try {
            // Revalidate the main events page
            revalidatePath('/top-trade-shows-in-uae-saudi-arabia-middle-east');

            // Get the event slug to revalidate the specific event page
            const { data: eventData } = await supabase
                .from('events')
                .select('slug')
                .eq('id', eventId)
                .single();

            if (eventData?.slug) {
                revalidatePath(`/top-trade-shows-in-uae-saudi-arabia-middle-east/${eventData.slug}`);
            }

            console.log('Revalidated paths after adding image to event:', eventId);
        } catch (revalidateError) {
            console.error('Error during revalidation:', revalidateError);
            // Don't fail the request if revalidation fails
        }

        return NextResponse.json({
            success: true,
            message: 'Image added to event successfully',
            image,
        }, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/events/[id]/images - Update image relations (reorder, update captions)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient(true);

        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const { id: eventId } = await params;
        const { updates } = await request.json();

        if (!updates || !Array.isArray(updates)) {
            return NextResponse.json(
                { error: 'Updates array is required' },
                { status: 400 }
            );
        }

        // Update each image
        const updatePromises = updates.map(async (update: any) => {
            const { id, display_order, caption, is_active } = update;

            return supabase
                .from('event_images')
                .update({
                    display_order,
                    caption,
                    is_active,
                })
                .eq('id', id)
                .eq('event_id', eventId);
        });

        await Promise.all(updatePromises);

        // Revalidate relevant paths after updating images
        try {
            // Revalidate the main events page
            revalidatePath('/top-trade-shows-in-uae-saudi-arabia-middle-east');

            // Get the event slug to revalidate the specific event page
            const { data: eventData } = await supabase
                .from('events')
                .select('slug')
                .eq('id', eventId)
                .single();

            if (eventData?.slug) {
                revalidatePath(`/top-trade-shows-in-uae-saudi-arabia-middle-east/${eventData.slug}`);
            }

            console.log('Revalidated paths after updating images for event:', eventId);
        } catch (revalidateError) {
            console.error('Error during revalidation:', revalidateError);
            // Don't fail the request if revalidation fails
        }

        return NextResponse.json({
            success: true,
            updated_count: updates.length,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}



// DELETE /api/events/[id]/images - Remove image from event
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient(true);

        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const { id: eventId } = await params;
        const { image_ids } = await request.json();

        if (!image_ids || !Array.isArray(image_ids)) {
            return NextResponse.json(
                { error: 'image_ids array is required' },
                { status: 400 }
            );
        }

        // Get image details before deletion for storage cleanup
        const { data: imagesToDelete, error: fetchError } = await supabase
            .from('event_images')
            .select('id, file_path, filename, image_type')
            .eq('event_id', eventId)
            .in('id', image_ids);

        if (fetchError) {
            console.error('Error fetching images to delete:', fetchError);
            return NextResponse.json(
                { error: 'Failed to fetch images' },
                { status: 500 }
            );
        }

        // Delete from database first
        const { data: deletedImages, error } = await supabase
            .from('event_images')
            .delete()
            .eq('event_id', eventId)
            .in('id', image_ids)
            .select('id, image_type');

        if (error) {
            console.error('Error deleting images from database:', error);
            return NextResponse.json(
                { error: 'Failed to remove images from event' },
                { status: 500 }
            );
        }

        // Delete from storage
        if (imagesToDelete && imagesToDelete.length > 0) {
            const filePaths = imagesToDelete.map(img => {
                // Extract the path from the full URL
                try {
                    const url = new URL(img.file_path);
                    return url.pathname.replace('/storage/v1/object/public/event-images/', '');
                } catch {
                    // If URL parsing fails, try to extract path directly
                    return img.file_path.split('/event-images/').pop() || img.filename;
                }
            });

            const { error: storageError } = await supabase.storage
                .from('event-images')
                .remove(filePaths);

            if (storageError) {
                console.error('Error deleting files from storage:', storageError);
                // Don't fail the request - database cleanup was successful
            }
        }

        // Revalidate relevant paths after deleting images from event
        try {
            // Revalidate the main events page
            revalidatePath('/top-trade-shows-in-uae-saudi-arabia-middle-east');

            // Get the event slug to revalidate the specific event page
            const { data: eventData } = await supabase
                .from('events')
                .select('slug')
                .eq('id', eventId)
                .single();

            if (eventData?.slug) {
                revalidatePath(`/top-trade-shows-in-uae-saudi-arabia-middle-east/${eventData.slug}`);
            }

            console.log('Revalidated paths after deleting images from event:', eventId);
        } catch (revalidateError) {
            console.error('Error during revalidation:', revalidateError);
            // Don't fail the request if revalidation fails
        }

        return NextResponse.json({
            success: true,
            deleted_count: deletedImages?.length || 0,
            deleted_images: deletedImages,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
