#!/usr/bin/env node

/**
 * Check Existing Buckets Script
 * 
 * This script lists all existing storage buckets to help debug the portfolio gallery issue
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

async function checkBuckets() {
    console.log('🔍 Checking all storage buckets...\n');

    try {
        // List all buckets
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.error('❌ Error listing buckets:', listError.message);
            return false;
        }

        console.log(`📦 Found ${buckets.length} storage buckets:\n`);
        
        buckets.forEach((bucket, index) => {
            console.log(`${index + 1}. ${bucket.id}`);
            console.log(`   Name: ${bucket.name}`);
            console.log(`   Public: ${bucket.public}`);
            console.log(`   Created: ${bucket.created_at}`);
            console.log(`   Updated: ${bucket.updated_at}`);
            console.log('');
        });

        // Check specifically for portfolio-related buckets
        const portfolioBuckets = buckets.filter(bucket => 
            bucket.id.includes('portfolio') || bucket.name.includes('portfolio')
        );

        if (portfolioBuckets.length > 0) {
            console.log('🎨 Portfolio-related buckets found:');
            portfolioBuckets.forEach(bucket => {
                console.log(`  - ${bucket.id} (${bucket.public ? 'public' : 'private'})`);
            });
        } else {
            console.log('⚠️  No portfolio-related buckets found');
        }

        // Check if the specific bucket we need exists
        const portfolioGalleryBucket = buckets.find(bucket => bucket.id === 'portfolio-gallery-images');
        
        if (portfolioGalleryBucket) {
            console.log('\n✅ portfolio-gallery-images bucket exists!');
            console.log('   This should work for the portfolio admin.');
        } else {
            console.log('\n❌ portfolio-gallery-images bucket NOT found');
            console.log('   This is why the portfolio admin upload is failing.');
            
            // Suggest similar buckets
            const similarBuckets = buckets.filter(bucket => 
                bucket.id.includes('portfolio') || 
                bucket.id.includes('gallery') ||
                bucket.id.includes('image')
            );
            
            if (similarBuckets.length > 0) {
                console.log('\n🔍 Similar buckets found:');
                similarBuckets.forEach(bucket => {
                    console.log(`  - ${bucket.id}`);
                });
                console.log('\nYou might want to use one of these or create the missing bucket.');
            }
        }

        return true;
        
    } catch (error) {
        console.error('💥 Unexpected error:', error);
        return false;
    }
}

async function main() {
    const success = await checkBuckets();
    
    if (!success) {
        process.exit(1);
    }
    
    console.log('\n🚀 Bucket check completed!');
}

if (require.main === module) {
    main();
}

module.exports = { checkBuckets };
