#!/usr/bin/env node

/**
 * Portfolio Schema Setup Script
 * 
 * This script runs the portfolio gallery schema setup with proper error handling
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupPortfolioSchema() {
    console.log('🚀 Setting up Portfolio Gallery Schema...\n');

    try {
        // Read the SQL schema file
        const schemaPath = path.join(__dirname, '..', 'portfolio', 'sql', 'portfolio-gallery-schema.sql');
        
        if (!fs.existsSync(schemaPath)) {
            console.error('❌ Schema file not found:', schemaPath);
            return false;
        }

        const sqlContent = fs.readFileSync(schemaPath, 'utf8');
        console.log('📄 Schema file loaded successfully');

        // Split the SQL into individual statements
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

        let successCount = 0;
        let errorCount = 0;

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            // Skip comments and empty statements
            if (statement.startsWith('--') || statement.trim().length === 0) {
                continue;
            }

            try {
                console.log(`${i + 1}/${statements.length} Executing statement...`);
                
                const { error } = await supabase.rpc('exec_sql', { 
                    sql_query: statement + ';' 
                });

                if (error) {
                    // Some errors are expected (like "already exists")
                    if (error.message.includes('already exists') || 
                        error.message.includes('does not exist') ||
                        error.message.includes('duplicate key')) {
                        console.log(`⚠️  Expected warning: ${error.message.substring(0, 100)}...`);
                    } else {
                        console.error(`❌ Error: ${error.message}`);
                        errorCount++;
                    }
                } else {
                    console.log('✅ Success');
                    successCount++;
                }
            } catch (err) {
                console.error(`❌ Unexpected error: ${err.message}`);
                errorCount++;
            }
        }

        console.log(`\n📊 Execution Summary:`);
        console.log(`  ✅ Successful: ${successCount}`);
        console.log(`  ❌ Errors: ${errorCount}`);
        console.log(`  ⚠️  Warnings: ${statements.length - successCount - errorCount}`);

        // Test the setup
        console.log('\n🧪 Testing setup...');
        
        // Test bucket creation
        const { data: buckets } = await supabase.storage.listBuckets();
        const portfolioBucket = buckets?.find(b => b.id === 'portfolio-gallery-images');
        
        if (portfolioBucket) {
            console.log('✅ Storage bucket created successfully');
        } else {
            console.log('⚠️  Storage bucket not found, creating manually...');
            
            const { error: bucketError } = await supabase.storage.createBucket('portfolio-gallery-images', {
                public: true,
                fileSizeLimit: 10485760, // 10MB
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            });
            
            if (bucketError && !bucketError.message.includes('already exists')) {
                console.error('❌ Failed to create bucket:', bucketError.message);
            } else {
                console.log('✅ Storage bucket created');
            }
        }

        // Test database tables
        const { data: items, error: itemsError } = await supabase
            .from('portfolio_items')
            .select('count(*)')
            .limit(1);
            
        if (!itemsError) {
            console.log('✅ Database tables accessible');
        } else {
            console.error('❌ Database tables error:', itemsError.message);
        }

        console.log('\n🎉 Portfolio Gallery schema setup completed!');
        return true;
        
    } catch (error) {
        console.error('💥 Unexpected error:', error);
        return false;
    }
}

async function main() {
    const success = await setupPortfolioSchema();
    
    if (!success) {
        console.log('\n🔧 Manual Setup Required:');
        console.log('1. Go to your Supabase Dashboard > SQL Editor');
        console.log('2. Copy and paste the contents of portfolio/sql/portfolio-gallery-schema.sql');
        console.log('3. Run the SQL manually');
        process.exit(1);
    }
    
    console.log('\n🚀 Portfolio gallery is ready!');
    console.log('You can now use the portfolio admin panel to upload images.');
}

if (require.main === module) {
    main();
}
