#!/usr/bin/env node

/**
 * Create Portfolio Bucket Script
 * 
 * This script creates the portfolio-gallery-images bucket with proper configuration
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createPortfolioBucket() {
    console.log('🚀 Creating Portfolio Gallery Bucket...\n');

    try {
        // Check if bucket already exists
        console.log('1️⃣ Checking existing buckets...');
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.error('❌ Error listing buckets:', listError.message);
            return false;
        }

        const existingBucket = buckets.find(bucket => bucket.id === 'portfolio-gallery-images');
        
        if (existingBucket) {
            console.log('✅ portfolio-gallery-images bucket already exists');
            console.log('   Public:', existingBucket.public);
            console.log('   Created:', existingBucket.created_at);
            return true;
        }

        // Create the bucket
        console.log('2️⃣ Creating portfolio-gallery-images bucket...');
        
        const { data: newBucket, error: createError } = await supabase.storage.createBucket('portfolio-gallery-images', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        });
        
        if (createError) {
            console.error('❌ Error creating bucket:', createError.message);
            return false;
        }
        
        console.log('✅ portfolio-gallery-images bucket created successfully');
        console.log('   Bucket ID:', newBucket?.id || 'portfolio-gallery-images');

        // Test bucket access
        console.log('\n3️⃣ Testing bucket access...');
        
        const { data: files, error: accessError } = await supabase.storage
            .from('portfolio-gallery-images')
            .list('', { limit: 1 });
            
        if (accessError) {
            console.error('❌ Bucket access error:', accessError.message);
            return false;
        }
        
        console.log('✅ Bucket is accessible');

        // Test public URL generation
        console.log('\n4️⃣ Testing public URL generation...');
        
        const { data: urlData } = supabase.storage
            .from('portfolio-gallery-images')
            .getPublicUrl('test-image.jpg');
            
        if (urlData.publicUrl) {
            console.log('✅ Public URL generation works');
            console.log('   Sample URL:', urlData.publicUrl);
        } else {
            console.error('❌ Public URL generation failed');
            return false;
        }

        console.log('\n🎉 Portfolio Gallery bucket setup completed successfully!');
        console.log('\n📋 Bucket Configuration:');
        console.log('  📁 Bucket ID: portfolio-gallery-images');
        console.log('  🌐 Public: Yes');
        console.log('  📏 File Size Limit: 10MB');
        console.log('  📄 Allowed Types: JPG, PNG, WebP');
        
        return true;
        
    } catch (error) {
        console.error('💥 Unexpected error:', error);
        return false;
    }
}

async function main() {
    const success = await createPortfolioBucket();
    
    if (!success) {
        console.log('\n🔧 Manual Setup Required:');
        console.log('1. Go to your Supabase Dashboard > Storage');
        console.log('2. Create a bucket named "portfolio-gallery-images"');
        console.log('3. Set it as public');
        console.log('4. Set file size limit to 10MB');
        console.log('5. Set allowed MIME types: image/jpeg, image/jpg, image/png, image/webp');
        process.exit(1);
    }
    
    console.log('\n🚀 Portfolio gallery storage is ready!');
    console.log('\nNext steps:');
    console.log('1. Run the SQL schema: portfolio/sql/portfolio-gallery-schema.sql in Supabase SQL Editor');
    console.log('2. Test the portfolio admin panel at /admin/pages/portfolio');
}

if (require.main === module) {
    main();
}

module.exports = { createPortfolioBucket };
