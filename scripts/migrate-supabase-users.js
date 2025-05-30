/**
 * This script migrates users from one Supabase project to another
 * 
 * To run this script:
 * 1. Make sure both old and new Supabase credentials are set
 * 2. Run: node scripts/migrate-supabase-users.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Old Supabase configuration
const OLD_SUPABASE_URL = process.env.OLD_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const OLD_SUPABASE_SERVICE_KEY = process.env.OLD_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// New Supabase configuration
const NEW_SUPABASE_URL = process.env.NEW_SUPABASE_URL;
const NEW_SUPABASE_SERVICE_KEY = process.env.NEW_SUPABASE_SERVICE_KEY;

if (!OLD_SUPABASE_URL || !OLD_SUPABASE_SERVICE_KEY || !NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables');
  console.error('Please set OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY, NEW_SUPABASE_URL, and NEW_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// Create Supabase admin clients
const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY);
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

// Function to fetch users from old Supabase project
async function fetchOldUsers() {
  try {
    // Using auth.admin.listUsers() to get all users
    const { data, error } = await oldSupabase.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    return data.users;
  } catch (error) {
    console.error('Error fetching users from old Supabase:', error);
    throw error;
  }
}

// Function to create a user in the new Supabase project
async function createUserInNewSupabase(user) {
  try {
    // Generate a secure random password
    // In a real migration, you'd want to implement a password reset flow
    const securePassword = Math.random().toString(36).slice(-10) + 
                          Math.random().toString(36).toUpperCase().slice(-2) + 
                          '!';
    
    // Create the user in the new Supabase Auth
    const { data: authData, error: authError } = await newSupabase.auth.admin.createUser({
      email: user.email,
      password: securePassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata,
    });

    if (authError) {
      throw authError;
    }

    console.log(`Created user in new Supabase Auth: ${user.email}`);

    // Migrate additional user data if needed
    // For example, if you have a users table with additional data
    if (authData.user) {
      // Fetch additional user data from old Supabase
      const { data: userData, error: userDataError } = await oldSupabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (userDataError && userDataError.code !== 'PGRST116') {
        console.error(`Error fetching additional data for ${user.email}:`, userDataError);
      }

      if (userData) {
        // Insert the additional data into the new Supabase
        const { error: insertError } = await newSupabase
          .from('admin_users')
          .insert({
            email: userData.email,
            role: userData.role,
            full_name: userData.full_name,
            avatar_url: userData.avatar_url,
          });

        if (insertError) {
          console.error(`Error inserting additional data for ${user.email}:`, insertError);
        } else {
          console.log(`Migrated additional data for user: ${user.email}`);
        }
      }
    }

    return authData.user;
  } catch (error) {
    console.error(`Error creating user in new Supabase: ${user.email}`, error);
    throw error;
  }
}

// Main migration function
async function migrateUsers() {
  try {
    console.log('Starting user migration from old Supabase to new Supabase...');
    
    // Fetch users from old Supabase
    const oldUsers = await fetchOldUsers();
    console.log(`Found ${oldUsers.length} users in old Supabase`);
    
    // Migrate each user
    for (const user of oldUsers) {
      try {
        // Check if user already exists in new Supabase
        const { data: existingUsers, error: lookupError } = await newSupabase.auth.admin.listUsers({
          filters: {
            email: user.email,
          },
        });
        
        if (lookupError) {
          console.error(`Error looking up user ${user.email}:`, lookupError);
          continue;
        }
        
        if (existingUsers && existingUsers.users && existingUsers.users.length > 0) {
          console.log(`User already exists in new Supabase: ${user.email}`);
          continue;
        }
        
        // Create the user in new Supabase
        await createUserInNewSupabase(user);
        console.log(`Successfully migrated user: ${user.email}`);
      } catch (error) {
        console.error(`Failed to migrate user ${user.email}:`, error);
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateUsers();
