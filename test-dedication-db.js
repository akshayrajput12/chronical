// Test script to verify dedication section database setup
const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDedicationDatabase() {
    console.log('🔍 Testing dedication section database setup...\n');

    // Test 1: Check if tables exist
    console.log('1. Testing table existence...');
    try {
        const { data: sectionsTest, error: sectionsError } = await supabase
            .from('about_dedication_sections')
            .select('*')
            .limit(1);
        
        if (sectionsError) {
            console.error('❌ about_dedication_sections table error:', sectionsError.message);
        } else {
            console.log('✅ about_dedication_sections table exists');
        }

        const { data: itemsTest, error: itemsError } = await supabase
            .from('about_dedication_items')
            .select('*')
            .limit(1);
        
        if (itemsError) {
            console.error('❌ about_dedication_items table error:', itemsError.message);
        } else {
            console.log('✅ about_dedication_items table exists');
        }

        const { data: imagesTest, error: imagesError } = await supabase
            .from('about_dedication_images')
            .select('*')
            .limit(1);
        
        if (imagesError) {
            console.error('❌ about_dedication_images table error:', imagesError.message);
        } else {
            console.log('✅ about_dedication_images table exists');
        }
    } catch (error) {
        console.error('❌ Table test failed:', error.message);
    }

    console.log('\n2. Testing database functions...');
    
    // Test 2: Check database functions
    try {
        const { data: sectionData, error: sectionError } = await supabase.rpc('get_about_dedication_section');
        
        if (sectionError) {
            console.error('❌ get_about_dedication_section function error:', sectionError.message);
        } else {
            console.log('✅ get_about_dedication_section function works');
            console.log('   Section data:', sectionData);
        }

        const { data: itemsData, error: itemsError } = await supabase.rpc('get_about_dedication_items');
        
        if (itemsError) {
            console.error('❌ get_about_dedication_items function error:', itemsError.message);
        } else {
            console.log('✅ get_about_dedication_items function works');
            console.log('   Items count:', itemsData?.length || 0);
            if (itemsData && itemsData.length > 0) {
                console.log('   First item:', {
                    title: itemsData[0].title,
                    image_url: itemsData[0].image_url,
                    fallback_image_url: itemsData[0].fallback_image_url
                });
            }
        }

        const { data: imagesData, error: imagesError } = await supabase.rpc('get_about_dedication_images');
        
        if (imagesError) {
            console.error('❌ get_about_dedication_images function error:', imagesError.message);
        } else {
            console.log('✅ get_about_dedication_images function works');
            console.log('   Images count:', imagesData?.length || 0);
        }
    } catch (error) {
        console.error('❌ Function test failed:', error.message);
    }

    console.log('\n3. Testing storage bucket...');
    
    // Test 3: Check storage bucket
    try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
            console.error('❌ Storage buckets error:', bucketsError.message);
        } else {
            const dedicationBucket = buckets.find(bucket => bucket.name === 'about-dedication');
            if (dedicationBucket) {
                console.log('✅ about-dedication storage bucket exists');
                
                // Try to list files in the bucket
                const { data: files, error: filesError } = await supabase.storage
                    .from('about-dedication')
                    .list('', { limit: 5 });
                
                if (filesError) {
                    console.log('⚠️  Could not list files in bucket:', filesError.message);
                } else {
                    console.log('   Files in bucket:', files?.length || 0);
                }
            } else {
                console.error('❌ about-dedication storage bucket not found');
            }
        }
    } catch (error) {
        console.error('❌ Storage test failed:', error.message);
    }

    console.log('\n🏁 Database test completed!');
}

testDedicationDatabase().catch(console.error);
