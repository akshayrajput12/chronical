const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function fixContactFormRLS() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase environment variables');
        console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
        console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        console.log('Fixing contact form RLS policy...');

        // Drop existing policy if it exists
        const dropPolicyQuery = `
            DROP POLICY IF EXISTS "Public can insert form submissions" ON contact_form_submissions;
        `;

        const { error: dropError } = await supabase.rpc('exec_sql', { 
            sql: dropPolicyQuery 
        });

        if (dropError) {
            console.log('Drop policy result (may be expected if policy doesn\'t exist):', dropError);
        }

        // Recreate the policy
        const createPolicyQuery = `
            CREATE POLICY "Public can insert form submissions" ON contact_form_submissions
                FOR INSERT WITH CHECK (true);
        `;

        const { error: createError } = await supabase.rpc('exec_sql', { 
            sql: createPolicyQuery 
        });

        if (createError) {
            console.error('Error creating policy:', createError);
            return;
        }

        // Ensure RLS is enabled
        const enableRLSQuery = `
            ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;
        `;

        const { error: rlsError } = await supabase.rpc('exec_sql', { 
            sql: enableRLSQuery 
        });

        if (rlsError) {
            console.log('RLS enable result (may be expected if already enabled):', rlsError);
        }

        console.log('✅ Contact form RLS policy fixed successfully!');

        // Test the fix by trying to insert a test record
        console.log('Testing the fix...');
        
        const testSubmission = {
            name: 'Test User',
            email: 'test@example.com',
            message: 'Test message',
            agreed_to_terms: true,
            status: 'new',
            is_spam: false,
            spam_score: 0.0
        };

        const { data: testData, error: testError } = await supabase
            .from('contact_form_submissions')
            .insert(testSubmission)
            .select()
            .single();

        if (testError) {
            console.error('❌ Test insertion failed:', testError);
        } else {
            console.log('✅ Test insertion successful! ID:', testData.id);
            
            // Clean up test record
            await supabase
                .from('contact_form_submissions')
                .delete()
                .eq('id', testData.id);
            
            console.log('✅ Test record cleaned up');
        }

    } catch (error) {
        console.error('Error fixing RLS policy:', error);
    }
}

fixContactFormRLS();
