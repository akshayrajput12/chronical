/**
 * This script migrates users from Clerk to Supabase Auth
 *
 * To run this script:
 * 1. Make sure both Clerk and Supabase credentials are in your .env file
 * 2. Run: npx ts-node -r dotenv/config src/scripts/migrate-users.ts
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Clerk API configuration
const CLERK_API_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API_URL = 'https://api.clerk.dev/v1';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!CLERK_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Function to fetch users from Clerk
async function fetchClerkUsers() {
  try {
    const response = await fetch(`${CLERK_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${CLERK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
    throw error;
  }
}

// Define ClerkUser interface
interface ClerkUser {
  id: string;
  email_addresses?: { email_address: string }[];
  first_name?: string;
  last_name?: string;
  image_url?: string;
  [key: string]: unknown;
}

// Function to create a user in Supabase
async function createSupabaseUser(email: string, password: string, userData: ClerkUser) {
  try {
    // Generate a secure random password if none exists
    // In a real migration, you'd want to implement a password reset flow
    const securePassword = password || Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2) + '!';

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: securePassword,
      email_confirm: true, // Auto-confirm the email
    });

    if (authError) {
      throw authError;
    }

    console.log(`Created user in Supabase Auth: ${email}`);

    // Store additional user data in the admin_users table
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('admin_users')
        .insert({
          email,
          clerk_id: userData.id,
          role: 'admin',
          full_name: userData.first_name && userData.last_name
            ? `${userData.first_name} ${userData.last_name}`
            : null,
          avatar_url: userData.image_url || null,
        });

      if (dbError) {
        console.error(`Error inserting user data for ${email}:`, dbError);
      } else {
        console.log(`Stored additional data for user: ${email}`);
      }
    }

    return authData.user;
  } catch (error) {
    console.error(`Error creating user in Supabase: ${email}`, error);
    throw error;
  }
}

// Main migration function
async function migrateUsers() {
  try {
    console.log('Starting user migration from Clerk to Supabase...');

    // Fetch users from Clerk
    const clerkUsers = await fetchClerkUsers();
    console.log(`Found ${clerkUsers.length} users in Clerk`);

    // Migrate each user
    for (const user of clerkUsers) {
      const email = user.email_addresses?.[0]?.email_address;

      if (!email) {
        console.warn(`Skipping user without email: ${user.id}`);
        continue;
      }

      try {
        // Check if user already exists in Supabase
        const { data: existingUsers, error: lookupError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', email)
          .limit(1);

        if (lookupError) {
          console.error(`Error looking up user ${email}:`, lookupError);
          continue;
        }

        if (existingUsers && existingUsers.length > 0) {
          console.log(`User already exists in Supabase: ${email}`);
          continue;
        }

        // Create the user in Supabase
        await createSupabaseUser(email, '', user);
        console.log(`Successfully migrated user: ${email}`);
      } catch (error) {
        console.error(`Failed to migrate user ${email}:`, error);
      }
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateUsers();
