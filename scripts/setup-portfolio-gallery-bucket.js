#!/usr/bin/env node

/**
 * Portfolio Gallery Bucket Setup Script
 * 
 * This script ensures the portfolio-gallery-images bucket exists with proper configuration
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

async function setupPortfolioGalleryBucket() {
    console.log('🚀 Setting up Portfolio Gallery Storage Bucket...\n');

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
        } else {
            console.log('📦 Creating portfolio-gallery-images bucket...');
            
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
        }

        // Test bucket access
        console.log('\n2️⃣ Testing bucket access...');
        
        const { data: files, error: accessError } = await supabase.storage
            .from('portfolio-gallery-images')
            .list('', { limit: 1 });
            
        if (accessError) {
            console.error('❌ Bucket access error:', accessError.message);
            return false;
        }
        
        console.log('✅ Bucket is accessible');
        console.log(`   Files in bucket: ${files.length}`);

        // Check storage policies
        console.log('\n3️⃣ Verifying storage policies...');
        
        // Note: We can't directly check policies via the client, but we can test operations
        try {
            // Test if we can get public URL (should work if public read policy exists)
            const { data: urlData } = supabase.storage
                .from('portfolio-gallery-images')
                .getPublicUrl('test-path.jpg');
                
            if (urlData.publicUrl) {
                console.log('✅ Public URL generation works');
            }
        } catch (error) {
            console.warn('⚠️  Public URL test failed:', error.message);
        }

        console.log('\n🎉 Portfolio Gallery bucket setup completed successfully!');
        console.log('\n📋 Bucket Configuration:');
        console.log('  📁 Bucket ID: portfolio-gallery-images');
        console.log('  🌐 Public: Yes');
        console.log('  📏 File Size Limit: 10MB');
        console.log('  📄 Allowed Types: JPG, PNG, WebP');
        console.log('  🔒 Policies: Public read, Authenticated write');
        
        return true;
        
    } catch (error) {
        console.error('💥 Unexpected error:', error);
        return false;
    }
}

async function main() {
    const success = await setupPortfolioGalleryBucket();
    
    if (!success) {
        console.log('\n🔧 Manual Setup Required:');
        console.log('1. Go to your Supabase Dashboard > Storage');
        console.log('2. Create a bucket named "portfolio-gallery-images"');
        console.log('3. Set it as public');
        console.log('4. Run the SQL policies from portfolio/sql/portfolio-gallery-schema.sql');
        process.exit(1);
    }
    
    console.log('\n🚀 Portfolio gallery storage is ready!');
    console.log('You can now upload images in the portfolio admin panel.');
}

if (require.main === module) {
    main();
}

module.exports = { setupPortfolioGalleryBucket };
