import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EventsHero, EventsHeroInput } from '@/types/events';

// GET /api/events/hero - Fetch active hero content
export async function GET(request: NextRequest) {
    try {
        // Use service role client to bypass RLS for admin operations
        const supabase = await createClient(true);

        const { data: hero, error } = await supabase
            .from('events_hero')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No hero content found, return default
                return NextResponse.json({
                    hero: {
                        id: null,
                        main_heading: 'Welcome to Dubai World Trade Centre',
                        sub_heading: 'Dubai\'s epicentre for events and business in the heart of the city',
                        background_image_url: null,
                        background_overlay_opacity: 0.30,
                        background_overlay_color: '#000000',
                        text_color: '#ffffff',
                        heading_font_size: 'responsive',
                        is_active: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }
                });
            }
            console.error('Error fetching hero content:', error);
            return NextResponse.json(
                { error: 'Failed to fetch hero content' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            hero,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/events/hero - Create new hero content
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

        const heroData: EventsHeroInput = await request.json();

        // Deactivate existing hero content if this one is active
        if (heroData.is_active) {
            await supabase
                .from('events_hero')
                .update({ is_active: false })
                .eq('is_active', true);
        }

        // Add metadata - using null since auth is disabled
        const heroWithMetadata = {
            ...heroData,
            created_by: null,
            updated_by: null,
        };

        const { data: hero, error } = await supabase
            .from('events_hero')
            .insert([heroWithMetadata])
            .select()
            .single();

        if (error) {
            console.error('Error creating hero content:', error);
            return NextResponse.json(
                { error: 'Failed to create hero content' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            hero,
        }, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/events/hero - Update hero content
export async function PUT(request: NextRequest) {
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

        const requestData = await request.json();
        console.log('PUT request data received:', requestData);

        const { id, ...heroData }: EventsHeroInput & { id?: string } = requestData;

        // If no ID provided, get the active hero or create new one
        let heroId = id;
        if (!heroId) {
            console.log('No ID provided, looking for existing active hero...');
            const { data: existingHero, error: findError } = await supabase
                .from('events_hero')
                .select('id')
                .eq('is_active', true)
                .single();

            if (findError && findError.code !== 'PGRST116') {
                console.error('Error finding existing hero:', findError);
            }

            heroId = existingHero?.id;
            console.log('Found existing hero ID:', heroId);
        }

        // Add metadata - using null since auth is disabled
        const heroWithMetadata = {
            ...heroData,
            updated_by: null,
        };

        console.log('Hero data to save:', heroWithMetadata);

        let hero;
        let error;
        let action;

        if (heroId) {
            // Update existing hero
            console.log('Updating existing hero with ID:', heroId);
            action = 'update';
            const result = await supabase
                .from('events_hero')
                .update(heroWithMetadata)
                .eq('id', heroId)
                .select()
                .single();

            hero = result.data;
            error = result.error;
            console.log('Update result:', { hero, error });
        } else {
            // Create new hero
            console.log('Creating new hero...');
            action = 'create';
            const result = await supabase
                .from('events_hero')
                .insert([{ ...heroWithMetadata, created_by: null }])
                .select()
                .single();

            hero = result.data;
            error = result.error;
            console.log('Create result:', { hero, error });
        }

        // Deactivate other hero content if this one is active
        if (heroData.is_active && hero) {
            await supabase
                .from('events_hero')
                .update({ is_active: false })
                .neq('id', hero.id)
                .eq('is_active', true);
        }

        if (error) {
            console.error('Error updating hero content:', error);
            return NextResponse.json(
                { error: 'Failed to update hero content' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            hero,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/events/hero - Delete hero content
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

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Hero ID is required' },
                { status: 400 }
            );
        }

        // Check if hero exists
        const { data: existingHero, error: checkError } = await supabase
            .from('events_hero')
            .select('id, main_heading')
            .eq('id', id)
            .single();

        if (checkError) {
            if (checkError.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Hero content not found' },
                    { status: 404 }
                );
            }
            console.error('Error checking hero content:', checkError);
            return NextResponse.json(
                { error: 'Failed to check hero content' },
                { status: 500 }
            );
        }

        // Delete hero content
        const { error: deleteError } = await supabase
            .from('events_hero')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting hero content:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete hero content' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Hero content "${existingHero.main_heading}" deleted successfully`,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/events/hero - Quick actions (activate/deactivate)
export async function PATCH(request: NextRequest) {
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

        const { id, action } = await request.json();

        if (!id || !action) {
            return NextResponse.json(
                { error: 'Hero ID and action are required' },
                { status: 400 }
            );
        }

        const updateData: any = { updated_by: null };

        switch (action) {
            case 'activate':
                // Deactivate all other hero content first
                await supabase
                    .from('events_hero')
                    .update({ is_active: false })
                    .eq('is_active', true);
                
                updateData.is_active = true;
                break;
                
            case 'deactivate':
                updateData.is_active = false;
                break;
                
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        const { data: hero, error } = await supabase
            .from('events_hero')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Hero content not found' },
                    { status: 404 }
                );
            }
            console.error('Error updating hero content:', error);
            return NextResponse.json(
                { error: 'Failed to update hero content' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            hero,
            action,
            message: `Hero content ${action}d successfully`,
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
