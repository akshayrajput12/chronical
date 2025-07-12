import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EventCategory, EventCategoryInput } from '@/types/events';

// GET /api/events/categories - Fetch all categories
export async function GET(request: NextRequest) {
    try {
        // Use service role client to bypass RLS for admin operations
        const supabase = await createClient(true);
        const { searchParams } = new URL(request.url);
        
        const is_active = searchParams.get('is_active');
        const include_counts = searchParams.get('include_counts') === 'true';

        // Build query
        let query = supabase
            .from('event_categories')
            .select('*')
            .order('display_order', { ascending: true })
            .order('name', { ascending: true });

        // Filter by active status if specified
        if (is_active !== null) {
            query = query.eq('is_active', is_active === 'true');
        }

        const { data: categories, error } = await query;

        if (error) {
            console.error('Error fetching categories:', error);
            return NextResponse.json(
                { error: 'Failed to fetch categories' },
                { status: 500 }
            );
        }

        // Include event counts if requested
        let categoriesWithCounts = categories;
        if (include_counts) {
            categoriesWithCounts = await Promise.all(
                categories.map(async (category) => {
                    const { count } = await supabase
                        .from('events')
                        .select('*', { count: 'exact', head: true })
                        .eq('category_id', category.id)
                        .eq('is_active', true)
                        .not('published_at', 'is', null);

                    return {
                        ...category,
                        event_count: count || 0,
                    };
                })
            );
        }

        return NextResponse.json({
            categories: categoriesWithCounts,
            total: categories.length,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/events/categories - Create new category
export async function POST(request: NextRequest) {
    try {
        // Use service role client to bypass RLS for admin operations
        const supabase = await createClient(true);
        
        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const categoryData: EventCategoryInput = await request.json();

        // Generate slug if not provided
        if (!categoryData.slug && categoryData.name) {
            categoryData.slug = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Add metadata - don't set user references when auth is disabled for testing
        const categoryWithMetadata = {
            ...categoryData,
            // created_by: null,
            // updated_by: null,
        };

        const { data: category, error } = await supabase
            .from('event_categories')
            .insert([categoryWithMetadata])
            .select()
            .single();

        if (error) {
            console.error('Error creating category:', error);
            
            // Handle unique constraint violations
            if (error.code === '23505') {
                if (error.message.includes('slug')) {
                    return NextResponse.json(
                        { error: 'A category with this URL slug already exists' },
                        { status: 400 }
                    );
                }
                if (error.message.includes('name')) {
                    return NextResponse.json(
                        { error: 'A category with this name already exists' },
                        { status: 400 }
                    );
                }
            }

            return NextResponse.json(
                { error: 'Failed to create category' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            category,
        }, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/events/categories - Bulk update categories
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const { action, category_ids, data: updateData } = await request.json();

        if (!action || !category_ids || !Array.isArray(category_ids)) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        let updateFields: any = { /* updated_by: user.id */ };

        switch (action) {
            case 'activate':
                updateFields.is_active = true;
                break;
            case 'deactivate':
                updateFields.is_active = false;
                break;
            case 'reorder':
                // Handle reordering - expects updateData to be array of {id, display_order}
                if (!updateData || !Array.isArray(updateData)) {
                    return NextResponse.json(
                        { error: 'Invalid reorder data' },
                        { status: 400 }
                    );
                }

                const reorderPromises = updateData.map(({ id, display_order }) =>
                    supabase
                        .from('event_categories')
                        .update({ display_order /* , updated_by: user.id */ })
                        .eq('id', id)
                );

                await Promise.all(reorderPromises);

                return NextResponse.json({
                    success: true,
                    message: 'Categories reordered successfully',
                });

            case 'update':
                updateFields = { ...updateData /* , updated_by: user.id */ };
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        const { data: categories, error } = await supabase
            .from('event_categories')
            .update(updateFields)
            .in('id', category_ids)
            .select();

        if (error) {
            console.error('Error updating categories:', error);
            return NextResponse.json(
                { error: 'Failed to update categories' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            updated_count: categories?.length || 0,
            categories,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/events/categories - Bulk delete categories
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Check authentication - TEMPORARILY DISABLED FOR TESTING
        // const { data: { user }, error: authError } = await supabase.auth.getUser();
        // if (authError || !user) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized' },
        //         { status: 401 }
        //     );
        // }

        const { category_ids } = await request.json();

        if (!category_ids || !Array.isArray(category_ids)) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        // Check if any categories have associated events
        const { data: eventsWithCategories, error: checkError } = await supabase
            .from('events')
            .select('id, title, category_id')
            .in('category_id', category_ids);

        if (checkError) {
            console.error('Error checking category usage:', checkError);
            return NextResponse.json(
                { error: 'Failed to check category usage' },
                { status: 500 }
            );
        }

        if (eventsWithCategories && eventsWithCategories.length > 0) {
            return NextResponse.json(
                { 
                    error: 'Cannot delete categories that have associated events',
                    events_count: eventsWithCategories.length,
                    sample_events: eventsWithCategories.slice(0, 3).map(e => e.title),
                },
                { status: 400 }
            );
        }

        // Delete categories
        const { data: deletedCategories, error } = await supabase
            .from('event_categories')
            .delete()
            .in('id', category_ids)
            .select('id, name');

        if (error) {
            console.error('Error deleting categories:', error);
            return NextResponse.json(
                { error: 'Failed to delete categories' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            deleted_count: deletedCategories?.length || 0,
            deleted_categories: deletedCategories,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
