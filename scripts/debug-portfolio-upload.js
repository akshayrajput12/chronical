#!/usr/bin/env node

/**
 * Debug Portfolio Upload Script
 * 
 * This script debugs the exact issue with portfolio image upload
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugPortfolioUpload() {
    console.log('🔍 Debugging Portfolio Upload Issue...\n');

    try {
        // Step 1: Check bucket access
        console.log('1️⃣ Testing bucket access...');
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.error('❌ Error listing buckets:', listError);
            return false;
        }

        const portfolioBucket = buckets.find(bucket => bucket.id === 'portfolio-gallery-images');
        
        if (!portfolioBucket) {
            console.error('❌ portfolio-gallery-images bucket not found');
            return false;
        }
        
        console.log('✅ Bucket found:', portfolioBucket.id);
        console.log('   Public:', portfolioBucket.public);

        // Step 2: Test file listing in bucket
        console.log('\n2️⃣ Testing file listing in bucket...');
        const { data: files, error: listFilesError } = await supabase.storage
            .from('portfolio-gallery-images')
            .list('', { limit: 10 });
            
        if (listFilesError) {
            console.error('❌ Error listing files:', listFilesError);
            return false;
        }
        
        console.log(`✅ Files in bucket: ${files.length}`);
        if (files.length > 0) {
            console.log('   Sample files:');
            files.slice(0, 3).forEach(file => {
                console.log(`   - ${file.name} (${file.metadata?.size || 'unknown size'})`);
            });
        }

        // Step 3: Test database tables
        console.log('\n3️⃣ Testing database tables...');
        
        // Test portfolio_items table
        const { data: items, error: itemsError } = await supabase
            .from('portfolio_items')
            .select('id, title, image_url')
            .limit(3);
            
        if (itemsError) {
            console.error('❌ Error accessing portfolio_items:', itemsError);
            return false;
        }
        
        console.log(`✅ portfolio_items table: ${items.length} items found`);
        
        // Test portfolio_images table
        const { data: images, error: imagesError } = await supabase
            .from('portfolio_images')
            .select('id, filename, file_path')
            .limit(3);
            
        if (imagesError) {
            console.error('❌ Error accessing portfolio_images:', imagesError);
            return false;
        }
        
        console.log(`✅ portfolio_images table: ${images.length} images found`);

        // Step 4: Test public URL generation
        console.log('\n4️⃣ Testing public URL generation...');
        const testPath = 'test-image.jpg';
        const { data: urlData } = supabase.storage
            .from('portfolio-gallery-images')
            .getPublicUrl(testPath);
            
        if (urlData.publicUrl) {
            console.log('✅ Public URL generation works');
            console.log('   Sample URL:', urlData.publicUrl);
        } else {
            console.error('❌ Public URL generation failed');
            return false;
        }

        // Step 5: Test upload permissions (simulate)
        console.log('\n5️⃣ Testing upload permissions...');
        
        // Create a small test file buffer
        const testFileContent = Buffer.from('test image content');
        const testFileName = `test-upload-${Date.now()}.txt`;
        const testFilePath = `portfolio-gallery/${testFileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('portfolio-gallery-images')
            .upload(testFilePath, testFileContent, {
                contentType: 'text/plain'
            });
            
        if (uploadError) {
            console.error('❌ Upload test failed:', uploadError);
            console.error('   This might be the root cause of the issue');
            return false;
        }
        
        console.log('✅ Upload test successful');
        console.log('   Test file path:', uploadData.path);
        
        // Clean up test file
        const { error: deleteError } = await supabase.storage
            .from('portfolio-gallery-images')
            .remove([testFilePath]);
            
        if (deleteError) {
            console.warn('⚠️  Could not clean up test file:', deleteError);
        } else {
            console.log('✅ Test file cleaned up');
        }

        console.log('\n🎉 All tests passed! Portfolio upload should work.');
        console.log('\n📋 Summary:');
        console.log('  ✅ Bucket exists and is accessible');
        console.log('  ✅ Database tables are working');
        console.log('  ✅ Public URL generation works');
        console.log('  ✅ Upload permissions are correct');
        
        return true;
        
    } catch (error) {
        console.error('💥 Unexpected error:', error);
        return false;
    }
}

async function main() {
    const success = await debugPortfolioUpload();
    
    if (!success) {
        console.log('\n🔧 Possible solutions:');
        console.log('1. Check your Supabase project permissions');
        console.log('2. Verify RLS policies on storage.objects');
        console.log('3. Check if you are authenticated in the admin panel');
        console.log('4. Try refreshing the admin page');
        process.exit(1);
    }
    
    console.log('\n🚀 Portfolio upload should be working!');
    console.log('If you are still seeing errors, the issue might be in the frontend code.');
}

if (require.main === module) {
    main();
}
