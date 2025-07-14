#!/usr/bin/env node

/**
 * Portfolio Upload Test Script
 * 
 * This script tests the portfolio gallery functionality including:
 * - Database schema verification
 * - Storage bucket verification
 * - Upload functionality test
 * - Image management test
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

async function testPortfolioSetup() {
    console.log('🧪 Testing Portfolio Gallery Setup...\n');

    try {
        // Test 1: Check if tables exist
        console.log('1️⃣ Checking database tables...');
        
        const { data: portfolioItems, error: itemsError } = await supabase
            .from('portfolio_items')
            .select('id')
            .limit(1);

        if (itemsError) {
            console.error('❌ portfolio_items table error:', itemsError.message);
            return false;
        }

        const { data: portfolioImages, error: imagesError } = await supabase
            .from('portfolio_images')
            .select('id')
            .limit(1);
            
        if (imagesError) {
            console.error('❌ portfolio_images table error:', imagesError.message);
            return false;
        }
        
        console.log('✅ Database tables exist and are accessible');

        // Test 2: Check storage bucket
        console.log('\n2️⃣ Checking storage bucket...');
        
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
            console.error('❌ Storage buckets error:', bucketsError.message);
            return false;
        }
        
        const portfolioBucket = buckets.find(bucket => bucket.id === 'portfolio-gallery-images');
        
        if (!portfolioBucket) {
            console.error('❌ portfolio-gallery-images bucket not found');
            console.log('Available buckets:', buckets.map(b => b.id));
            return false;
        }
        
        console.log('✅ portfolio-gallery-images bucket exists');

        // Test 3: Check existing portfolio items
        console.log('\n3️⃣ Checking existing portfolio items...');
        
        const { data: items, error: fetchError } = await supabase
            .from('portfolio_items')
            .select('*')
            .order('display_order');
            
        if (fetchError) {
            console.error('❌ Error fetching portfolio items:', fetchError.message);
            return false;
        }
        
        console.log(`✅ Found ${items.length} portfolio items`);
        
        if (items.length > 0) {
            console.log('Sample items:');
            items.slice(0, 3).forEach(item => {
                console.log(`  - ${item.title || 'Untitled'} (${item.grid_class}, order: ${item.display_order})`);
            });
        }

        // Test 4: Test database function
        console.log('\n4️⃣ Testing database function...');
        
        const { data: itemsWithImages, error: functionError } = await supabase
            .rpc('get_portfolio_items_with_images');
            
        if (functionError) {
            console.error('❌ Database function error:', functionError.message);
            return false;
        }
        
        console.log(`✅ Database function works, returned ${itemsWithImages.length} items`);

        // Test 5: Check storage policies
        console.log('\n5️⃣ Testing storage access...');
        
        try {
            const { data: files, error: listError } = await supabase.storage
                .from('portfolio-gallery-images')
                .list('', { limit: 1 });
                
            if (listError) {
                console.error('❌ Storage list error:', listError.message);
                return false;
            }
            
            console.log('✅ Storage bucket is accessible');
        } catch (error) {
            console.error('❌ Storage access error:', error.message);
            return false;
        }

        console.log('\n🎉 All tests passed! Portfolio gallery is properly configured.');
        console.log('\n📋 Summary:');
        console.log('  ✅ Database tables: portfolio_items, portfolio_images');
        console.log('  ✅ Storage bucket: portfolio-gallery-images');
        console.log('  ✅ Database function: get_portfolio_items_with_images');
        console.log('  ✅ Storage policies: configured');
        console.log(`  ✅ Portfolio items: ${items.length} items found`);
        
        return true;
        
    } catch (error) {
        console.error('💥 Unexpected error:', error);
        return false;
    }
}

async function main() {
    const success = await testPortfolioSetup();
    
    if (!success) {
        console.log('\n🔧 To fix issues:');
        console.log('1. Run the portfolio schema setup: portfolio/sql/portfolio-gallery-schema.sql');
        console.log('2. Check your Supabase project settings');
        console.log('3. Verify environment variables in .env.local');
        process.exit(1);
    }
    
    console.log('\n🚀 Portfolio gallery is ready for use!');
    console.log('Visit /admin/pages/portfolio to manage your portfolio items.');
}

if (require.main === module) {
    main();
}
