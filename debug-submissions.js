// Debug script to check submissions table and data
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vuceqeajjczcjeqadbqv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1Y2VxZWFqamN6Y2plcWFkYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzM5ODExNSwiZXhwIjoyMDYyOTc0MTE1fQ.6fU8Rv0c25voaejR5fPIvuxwQj7BioHFTwSh2DvKjDU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugSubmissions() {
    console.log('🔍 Debugging event form submissions...\n');
    
    try {
        // 1. Check if table exists and get structure
        console.log('1. Checking table structure...');
        const { data: columns, error: columnsError } = await supabase
            .rpc('exec_sql', {
                sql: `
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns 
                    WHERE table_name = 'event_form_submissions'
                    ORDER BY ordinal_position;
                `
            });

        if (columnsError) {
            console.log('   Using fallback method to check table...');
            // Fallback: try to select from table
            const { data: testData, error: testError } = await supabase
                .from('event_form_submissions')
                .select('*')
                .limit(1);
            
            if (testError) {
                console.error('   ❌ Table access error:', testError);
            } else {
                console.log('   ✅ Table exists and is accessible');
                if (testData && testData.length > 0) {
                    console.log('   📋 Sample columns:', Object.keys(testData[0]));
                }
            }
        } else {
            console.log('   ✅ Table structure:');
            console.table(columns);
        }

        // 2. Count total submissions
        console.log('\n2. Counting submissions...');
        const { count, error: countError } = await supabase
            .from('event_form_submissions')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('   ❌ Count error:', countError);
        } else {
            console.log(`   📊 Total submissions: ${count}`);
        }

        // 3. Get recent submissions
        console.log('\n3. Fetching recent submissions...');
        const { data: submissions, error: fetchError } = await supabase
            .from('event_form_submissions')
            .select(`
                id,
                name,
                email,
                company_name,
                created_at,
                status,
                is_spam,
                event:events(title)
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        if (fetchError) {
            console.error('   ❌ Fetch error:', fetchError);
        } else {
            console.log(`   📝 Recent submissions (${submissions.length}):`);
            submissions.forEach((sub, index) => {
                console.log(`   ${index + 1}. ${sub.name} (${sub.email}) - ${sub.status} - ${sub.created_at}`);
                if (sub.company_name) console.log(`      Company: ${sub.company_name}`);
                if (sub.event?.title) console.log(`      Event: ${sub.event.title}`);
            });
        }

        // 4. Check RLS policies
        console.log('\n4. Checking RLS policies...');
        const { data: policies, error: policiesError } = await supabase
            .rpc('exec_sql', {
                sql: `
                    SELECT policyname, cmd, permissive, roles, qual, with_check
                    FROM pg_policies 
                    WHERE tablename = 'event_form_submissions';
                `
            });

        if (policiesError) {
            console.log('   ⚠️  Could not check RLS policies:', policiesError.message);
        } else {
            console.log('   🔒 RLS Policies:');
            if (policies && policies.length > 0) {
                console.table(policies);
            } else {
                console.log('   ⚠️  No RLS policies found - this might be the issue!');
            }
        }

        // 5. Test API endpoint
        console.log('\n5. Testing API endpoint...');
        try {
            const response = await fetch('http://localhost:3000/api/events/submissions?page=1&limit=5');
            const apiData = await response.json();
            
            console.log(`   📡 API Response: ${response.status}`);
            if (response.ok) {
                console.log(`   ✅ API working - found ${apiData.submissions?.length || 0} submissions`);
            } else {
                console.log(`   ❌ API error:`, apiData);
            }
        } catch (apiError) {
            console.log('   ⚠️  Could not test API (server might not be running):', apiError.message);
        }

    } catch (error) {
        console.error('❌ Debug failed:', error);
    }
}

console.log('🚀 Starting debug process...');
console.log('Make sure your Next.js server is running for API test\n');

debugSubmissions();
