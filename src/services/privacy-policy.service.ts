import { createServiceClient } from '@/lib/supabase/service';
import { createStaticClient } from '@/lib/supabase/server';
import { PrivacyPolicy, UpdatePrivacyPolicyRequest } from '@/types/privacy-policy';

/**
 * Get the active privacy policy
 */
export async function getActivePrivacyPolicy(): Promise<PrivacyPolicy | null> {
    try {
        const supabase = createStaticClient();

        const { data, error } = await supabase
            .from('privacy_policy')
            .select('*')
            .eq('is_active', true)
            .order('version', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned
                return null;
            }
            console.error('Error fetching active privacy policy:', error);
            throw new Error('Failed to fetch privacy policy');
        }

        return data as PrivacyPolicy;
    } catch (error) {
        console.error('Error in getActivePrivacyPolicy:', error);
        throw error;
    }
}

/**
 * Get all privacy policies (admin only)
 */
export async function getAllPrivacyPolicies(): Promise<PrivacyPolicy[]> {
    try {
        const supabase = createServiceClient();

        const { data, error } = await supabase
            .from('privacy_policy')
            .select('*')
            .order('version', { ascending: false });

        if (error) {
            console.error('Error fetching all privacy policies:', error);
            throw new Error('Failed to fetch privacy policies');
        }

        return data as PrivacyPolicy[];
    } catch (error) {
        console.error('Error in getAllPrivacyPolicies:', error);
        throw error;
    }
}

/**
 * Update privacy policy (creates new version)
 */
export async function updatePrivacyPolicy(
    data: UpdatePrivacyPolicyRequest,
    userId: string
): Promise<PrivacyPolicy> {
    try {
        const supabase = createServiceClient();

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
                title: data.title.trim(),
                content: data.content,
                meta_title: data.meta_title?.trim() || null,
                meta_description: data.meta_description?.trim() || null,
                meta_keywords: data.meta_keywords?.trim() || null,
                og_title: data.og_title?.trim() || null,
                og_description: data.og_description?.trim() || null,
                og_image_url: data.og_image_url?.trim() || null,
                contact_email: data.contact_email?.trim() || 'info@chroniclesexhibits.com',
                is_active: data.is_active !== false,
                version: newVersion,
                last_updated_by: userId,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating privacy policy:', insertError);
            throw new Error('Failed to update privacy policy');
        }

        return newPolicy as PrivacyPolicy;
    } catch (error) {
        console.error('Error in updatePrivacyPolicy:', error);
        throw error;
    }
}

/**
 * Get privacy policy by ID
 */
export async function getPrivacyPolicyById(id: string): Promise<PrivacyPolicy | null> {
    try {
        const supabase = createServiceClient();

        const { data, error } = await supabase
            .from('privacy_policy')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching privacy policy by ID:', error);
            throw new Error('Failed to fetch privacy policy');
        }

        return data as PrivacyPolicy;
    } catch (error) {
        console.error('Error in getPrivacyPolicyById:', error);
        throw error;
    }
}

/**
 * Get privacy policy page data for SSG
 */
export async function getPrivacyPolicyPageData(): Promise<{
    privacyPolicy: PrivacyPolicy | null;
    metadata: {
        title: string;
        description: string;
        keywords: string;
        ogTitle: string;
        ogDescription: string;
        ogImage?: string;
    };
}> {
    try {
        const privacyPolicy = await getActivePrivacyPolicy();

        if (!privacyPolicy) {
            return {
                privacyPolicy: null,
                metadata: {
                    title: 'Privacy Policy - Chronicle Exhibits LLC',
                    description: 'Learn about how Chronicle Exhibits LLC protects your privacy and handles your personal information.',
                    keywords: 'privacy policy, data protection, personal information, Chronicle Exhibits',
                    ogTitle: 'Privacy Policy - Chronicle Exhibits LLC',
                    ogDescription: 'Learn about how Chronicle Exhibits LLC protects your privacy and handles your personal information.',
                },
            };
        }

        return {
            privacyPolicy,
            metadata: {
                title: privacyPolicy.meta_title || privacyPolicy.title,
                description: privacyPolicy.meta_description || 'Learn about how Chronicle Exhibits LLC protects your privacy and handles your personal information.',
                keywords: privacyPolicy.meta_keywords || 'privacy policy, data protection, personal information, Chronicle Exhibits',
                ogTitle: privacyPolicy.og_title || privacyPolicy.title,
                ogDescription: privacyPolicy.og_description || privacyPolicy.meta_description || 'Learn about how Chronicle Exhibits LLC protects your privacy and handles your personal information.',
                ogImage: privacyPolicy.og_image_url,
            },
        };
    } catch (error) {
        console.error('Error in getPrivacyPolicyPageData:', error);
        throw error;
    }
}
