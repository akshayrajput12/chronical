// Check the actual structure of the event_form_submissions table
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vuceqeajjczcjeqadbqv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1Y2VxZWFqamN6Y2plcWFkYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzM5ODExNSwiZXhwIjoyMDYyOTc0MTE1fQ.6fU8Rv0c25voaejR5fPIvuxwQj7BioHFTwSh2DvKjDU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
    console.log('Checking event_form_submissions table structure...\n');
    
    try {
        // Query the information schema to get column details
        const { data, error } = await supabase
            .rpc('exec_sql', {
                sql: `
                    SELECT 
                        column_name,
                        data_type,
                        is_nullable,
                        column_default
                    FROM information_schema.columns 
                    WHERE table_name = 'event_form_submissions'
                    ORDER BY ordinal_position;
                `
            });

        if (error) {
            console.error('Error querying table structure:', error);
            
            // Fallback: try to get structure by selecting from the table
            console.log('\nTrying fallback method...');
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('event_form_submissions')
                .select('*')
                .limit(1);
            
            if (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            } else {
                console.log('Table exists and is accessible');
                if (fallbackData && fallbackData.length > 0) {
                    console.log('Sample row structure:', Object.keys(fallbackData[0]));
                } else {
                    console.log('Table is empty, cannot determine structure from data');
                }
            }
        } else {
            console.log('Table structure:');
            console.table(data);
        }

        // Also check if the table exists at all
        const { data: tableExists, error: tableError } = await supabase
            .from('event_form_submissions')
            .select('count(*)')
            .limit(1);

        if (tableError) {
            console.error('\nTable access error:', tableError);
        } else {
            console.log('\n✅ Table exists and is accessible');
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

checkTableStructure();
