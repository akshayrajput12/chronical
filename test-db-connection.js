// Test database connection and events table
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vuceqeajjczcjeqadbqv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1Y2VxZWFqamN6Y2plcWFkYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTgxMTUsImV4cCI6MjA2Mjk3NDExNX0.p3p01IV5uI9Wkg-H0XniU51K-oDMFoDHnEigghGge-c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    
    try {
        // Test basic connection
        const { data, error } = await supabase
            .from('events')
            .select('count(*)', { count: 'exact' });
            
        if (error) {
            console.error('Error connecting to events table:', error);
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });
        } else {
            console.log('✅ Successfully connected to events table');
            console.log('Events count:', data);
        }
        
        // Test event categories table
        const { data: categoriesData, error: categoriesError } = await supabase
            .from('event_categories')
            .select('count(*)', { count: 'exact' });
            
        if (categoriesError) {
            console.error('Error connecting to event_categories table:', categoriesError);
        } else {
            console.log('✅ Successfully connected to event_categories table');
            console.log('Categories count:', categoriesData);
        }
        
        // Test a simple select query
        const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('id, title, slug')
            .limit(5);
            
        if (eventsError) {
            console.error('Error fetching events:', eventsError);
        } else {
            console.log('✅ Successfully fetched events:');
            console.log(eventsData);
        }
        
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
