// Test event form submission API
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vuceqeajjczcjeqadbqv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1Y2VxZWFqamN6Y2plcWFkYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTgxMTUsImV4cCI6MjA2Mjk3NDExNX0.p3p01IV5uI9Wkg-H0XniU51K-oDMFoDHnEigghGge-c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFormSubmission() {
    console.log('Testing event form submission...');
    
    // First, check if the table exists and its structure
    console.log('\n1. Checking table structure...');
    try {
        const { data, error } = await supabase
            .from('event_form_submissions')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('Error checking table:', error);
            return;
        }
        
        console.log('Table exists and is accessible');
        
        // Test inserting a form submission
        console.log('\n2. Testing form submission...');
        const testSubmission = {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890',
            company: 'Test Company',
            message: 'This is a test submission',
            attachment_url: null,
            ip_address: '127.0.0.1',
            user_agent: 'Test Agent',
            referrer: 'direct',
            is_spam: false,
            status: 'new'
        };
        
        const { data: submission, error: insertError } = await supabase
            .from('event_form_submissions')
            .insert([testSubmission])
            .select()
            .single();
        
        if (insertError) {
            console.error('Error inserting submission:', insertError);
            console.error('Error details:', JSON.stringify(insertError, null, 2));
        } else {
            console.log('✅ Form submission successful!');
            console.log('Submission ID:', submission.id);
            
            // Clean up - delete the test submission
            await supabase
                .from('event_form_submissions')
                .delete()
                .eq('id', submission.id);
            console.log('Test submission cleaned up');
        }
        
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

testFormSubmission();
