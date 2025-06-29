// Setup script to create the portfolio bucket
// Run this script if you encounter bucket upload errors

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupPortfolioBucket() {
    try {
        console.log('🔍 Checking existing buckets...');
        
        // List existing buckets
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.error('❌ Error listing buckets:', listError);
            return;
        }
        
        console.log('📦 Existing buckets:', buckets?.map(b => b.id));
        
        // Check if portfolio bucket exists
        const portfolioBucketExists = buckets?.some(bucket => bucket.id === 'city-portfolio');
        
        if (portfolioBucketExists) {
            console.log('✅ Portfolio bucket already exists!');
            return;
        }
        
        console.log('🚀 Creating city-portfolio bucket...');
        
        // Create the portfolio bucket
        const { data, error } = await supabase.storage.createBucket('city-portfolio', {
            public: true,
            fileSizeLimit: 52428800, // 50MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        });
        
        if (error) {
            console.error('❌ Error creating bucket:', error);
            return;
        }
        
        console.log('✅ Portfolio bucket created successfully!');
        console.log('📁 Bucket data:', data);
        
        // Verify the bucket was created
        const { data: updatedBuckets } = await supabase.storage.listBuckets();
        console.log('📦 Updated buckets:', updatedBuckets?.map(b => b.id));
        
    } catch (error) {
        console.error('💥 Unexpected error:', error);
    }
}

// Run the setup
setupPortfolioBucket();

console.log(`
🔧 Portfolio Bucket Setup Script
================================

This script creates the 'city-portfolio' bucket for storing portfolio images.

If you see any errors:
1. Make sure your Supabase credentials are correct
2. Check that you have storage permissions in your Supabase project
3. Verify your Supabase project has storage enabled

To run this script:
node scripts/setup-portfolio-bucket.js

Or you can run the SQL script directly in your Supabase SQL editor:
cities/sql/portfolio-bucket-setup.sql
`);
